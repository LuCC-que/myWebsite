const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  title: String,
  tags: String,
  images: [
    {
      url: String,
      filename: String,
    },
  ],
  link: String,
  description: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

ProjectSchema.post("findOneAndDelete", async function (project) {
  if (project) {
    await review.deleteMany({
      _id: {
        $in: project.reviews,
      },
    });
  }

  console.log(project);

  console.log("asdasd");
});

module.exports = mongoose.model("Project", ProjectSchema);
