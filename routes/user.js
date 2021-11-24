const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user");
const catchAsyncError = require("../utils/catchAsyncError");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  catchAsyncError(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      console.log(user);
      const registeredUser = await User.register(user, password);
      console.log(registeredUser);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Reg !");
        res.redirect("/projects");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "welcome back!");
    const redirectUrl = req.session.returnTo;
    console.log(redirectUrl);
    res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "logged out");
  res.redirect("/projects");
});

module.exports = router;
