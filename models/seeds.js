const mongoose = require("mongoose");
const project = require("./project");

mongoose
  .connect("mongodb://localhost:27017/projects", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Seeds: Mongo Connected! :)");
  })
  .catch((err) => {
    console.log("Seeds: Mongo Connected in error :(");
    console.log(err);
  });

const seedProject = [
  {
    title: "project1",
    tags: ["OOb1", "Oob2", "oob3"],
    images: [
      {
        url: "https://source.unsplash.com/collection/483251",
        filename: "test1",
      },
      {
        url: "https://source.unsplash.com/collection/483251",
        filename: "test1",
      },
    ],
    link: "https://www.queensu.ca/",
    breif: "make it short",
    description:
      "This is asdhasioludhiuewof biuowecn idsnbf ciouewncd kjsdn klds ",
    author: "619473dfa60d4421d032395d",
  },

  {
    title: "project2",
    tags: ["OOb1", "Oob2", "oob3"],
    images: [
      {
        url: "https://source.unsplash.com/collection/483251",
        filename: "test1",
      },
      {
        url: "https://source.unsplash.com/collection/483251",
        filename: "test1",
      },
    ],
    link: "https://www.queensu.ca/",
    breif: "make it short",
    description:
      "This is asdhasioludhiuewof biuowecn idsnbf ciouewncd kjsdn klds This is asdhasioludhiuewof biuowecn idsnbf ciouewncd kjsdn kldsThis is asdhasioludhiuewof biuowecn idsnbf ciouewncd kjsdn klds",
    author: "619473dfa60d4421d032395d",
  },

  {
    title: "project3",
    tags: ["OOb1", "Oob2", "oob3"],
    images: [
      {
        url: "https://source.unsplash.com/collection/483251",
        filename: "test1",
      },
      {
        url: "https://source.unsplash.com/collection/483251",
        filename: "test1",
      },
    ],
    link: "https://www.queensu.ca/",
    breif: "make it short",
    description:
      "This is asdhasioludhiuewof biuowecn idsnbf ciouewncd kjsdn klds ",
    author: "619473dfa60d4421d032395d",
  },
];

project
  .insertMany(seedProject)
  .then((req) => console.log(req))
  .catch((err) => console.log(err));
