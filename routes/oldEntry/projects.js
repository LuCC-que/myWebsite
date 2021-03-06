const express = require("express");
const catchAsyncError = require("../../utils/catchAsyncError");
const { vetProject } = require("../../utils/validateSchemas");
const Project = require("../../models/project");
const { vetloggedIn, vetAuthor } = require("../../middlewares");
const multer = require("multer");
const { storage } = require("../../cloudinary/index");
const upload = multer({ storage });

const router = express.Router();

router.get("/test", (req, res) => {
  res.send("hit!!");
});

router.get(
  "/",
  catchAsyncError(async (req, res) => {
    const projects = await Project.find({});
    res.render("projectsold/index", { projects });
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
    project.author = req.user._id;
    await project.save();
    req.flash("success", "A new project is posted successfully");
    res.redirect(`/projectsold/${project._id}`);
  })
);
router.get("/new", (req, res) => {
  res.render("projectsold/new");
});

// router.post("/", upload.array("image"), (req, res) => {
//   console.log(req);
//   res.send("hit");
// });

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
    res.render("projectsold/show", { project });
  })
);

router.get(
  "/:id/edit",
  vetloggedIn,
  catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      req.flash("error", "project does not exist");
      return res.redirect("/projects");
    }
    res.render("projectsold/edit", { project });
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
    const imgs = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));

    project.images.push(...imgs);
    await project.save();
    req.flash("success", "The project is updated!");
    res.redirect(`/projectsold/${project._id}`);
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
    res.redirect("/projects");
  })
);

module.exports = router;
