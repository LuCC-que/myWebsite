const Project = require("./models/project");
const review = require("./models/review");
const Review = require("./models/review");
const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "you must login in");
    return res.redirect("/login");
  }
  next();
};

const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");

  console.log(project);

  found = false;
  admin = false;

  for (const review of project.reviews) {
    if (review.author.equals(req.user._id)) {
      found = true;
      break;
    }
  }
  if (project.author.equals("619473dfa60d4421d032395d")) {
    admin = true;
  }
  if (project.author.equals(req.user._id) || found || admin) {
    return next();
  }
  req.flash("error", "you do not have permission to do that");
  return res.redirect(`/projects/${id}`);
};

const isAdmin = async (req, res, next) => {};

module.exports.vetloggedIn = isLoggedIn;
module.exports.vetAuthor = isAuthor;
