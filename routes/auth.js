var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req, res) {
  res.render("landing");
});

// =================================================================
// Authentication Routes
// =================================================================

// Show Register Form
router.get("/register", function(req, res) {
  res.render("register");
});

// Sign Up Logic
router.post("/register", function(req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      // req.flash("error", err.message);
      // console.log(err);
      // return res.render("register");
      // not to click twice on sign up button
      return res.render("register", {"error" : err.message})
    }
    passport.authenticate("local")(req, res, function() {
      req.flash("success", "Welcome To The App " + user.username);
      res.redirect("/mountains");
    });
  });
});

// Show Log In Form
router.get("/login", function(req, res) {
  res.render("login");
});

// Log In Logic
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/mountains",
    failureRedirect: "/login"
  }),
  function(req, res) {}
);

// Log Out Route
router.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "You Have Been Logged Out");
  res.redirect("/mountains");
});

module.exports = router;
