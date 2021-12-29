const express = require("express");
const catchAsyncError = require("../../utils/catchAsyncError");
const { vetReview } = require("../../utils/validateSchemas");
const Review = require("../../models/review");
const Project = require("../../models/project");
const { vetloggedIn, vetAuthor } = require("../../middlewares");

//router separetes the paremeter of the http
const router = express.Router({ mergeParams: true });

router.get("/test", (req, res) => {
  res.send("hit!! in the review routine");
});

router.post(
  "/",
  vetloggedIn,
  vetReview,
  catchAsyncError(async (req, res) => {
    console.log(req.params.id);
    const project = await Project.findById(req.params.id);
    console.log(project);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    console.log(review);
    project.reviews.push(review);
    await review.save();
    await project.save();
    req.flash("success", "A review is created");
    res.redirect(`/projects/${project._id}`);
  })
);

router.delete(
  "/:reviewId",
  vetAuthor,
  catchAsyncError(async (req, res) => {
    const { id, reviewId } = req.params;
    await Project.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "A review is deleted");
    res.redirect(`/projects/${id}`);
  })
);

module.exports = router;
