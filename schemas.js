const Joi = require("joi");

module.exports.projectSchema = Joi.object({
  project: Joi.object({
    title: Joi.string().required(),
    link: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required(),
  }).required(),
});
