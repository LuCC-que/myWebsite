const express = require("express");
const catchAsyncError = require("../utils/catchAsyncError");
const { vetProject } = require("../utils/validateSchemas");
const Project = require("../models/project");
const { vetloggedIn, vetAuthor } = require("../middlewares");
const multer = require("multer");
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });

const router = express.Router();

router.get("/test", (req, res) => res.send("hit!!"));

router.get("/new", (req, res) => res.render("project/new"));

router.get(
  "/:id",
  catchAsyncError(async (req, res) => {
    const project = await Project.findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    console.log(project);
    if (!project) {
      req.flash("error", "project does not exist");
      return res.redirect("/projects");
    }
    res.render("project/show", { project });
  })
);

router.post(
  "/",
  vetloggedIn,
  upload.array("image"),
  catchAsyncError(async (req, res) => {
    console.log(req.body);
    const project = new Project(req.body.project);
    console.log(req.files);
    project.images = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    // project.author = req.user._id;
    await project.save();
    req.flash("success", "A new project is posted successfully");
    res.redirect(`/projectsold/${project._id}`);
  })
);

router.get(
  "/:id/e",
  vetloggedIn,
  catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      req.flash("error", "project does not exist");
      return res.redirect("/projects");
    }
    res.render("project/edit", { project });
  })
);

router.put(
  "/:id",
  vetloggedIn,
  upload.array("image"),
  catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const project = await Project.findByIdAndUpdate(id, {
      ...req.body.project,
    });

    if (req.files) {
      project.images = req.files.map((f) => ({
        url: f.path,
        filename: f.filename,
      }));
    }

    await project.save();
    req.flash("success", "The project is updated!");
    res.redirect(`/projects/${project._id}`);
  })
);

router.delete(
  "/:id",
  vetloggedIn,
  catchAsyncError(async (req, res) => {
    const { id } = req.params;
    await Project.findByIdAndDelete(id);
    req.flash("success", "The project is deleted!");
    delete req.session.returnTo;
    res.redirect("/");
  })
);

module.exports = router;
