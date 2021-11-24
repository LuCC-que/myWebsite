const { projectSchema, reviewSchema } = require("../schemas");
const ExpressError = require("./ExpressError");

const validateProject = (req, res, next) => {
  const { error } = projectSchema.validate(req.body.project);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.vetProject = validateProject;

module.exports.vetReview = validateReview;
