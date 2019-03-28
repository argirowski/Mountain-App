var express = require("express");
var router = express.Router();
var Mountain = require("../models/mountains");
var middleware = require("../middleware");

// Index - Show All Mountains
router.get("/", function(req, res) {
  // Get All Mountains from DB
  Mountain.find({}, function(err, allMountains) {
    if (err) {
      console.log(err);
    } else {
      res.render("mountains/index", {
        mountains: allMountains,
        currentUser: req.user
      });
    }
  });
});

// Create - add new mountain to DB
router.post("/", middleware.isLoggedIn, function(req, res) {
  // get data from form and add to mountains array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newMountain = {
    name: name,
    image: image,
    description: desc,
    author: author
  };
  // Create a new mountain and save to database
  Mountain.create(newMountain, function(err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      // redirect to mountains page
      res.redirect("/mountains");
    }
  });
  // mountains.push(newMountain);
});

// New - show form to create / add new mountain
router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("mountains/new");
});

// Shows more info about one mountain

router.get("/:id", function(req, res) {
  // Find the Mountain with the proper ID
  Mountain.findById(req.params.id)
    .populate("comments")
    .exec(function(err, foundMountain) {
      if (err) {
        console.log(err);
      } else {
        console.log(foundMountain);
        // Render page with that info
        res.render("mountains/show", { mountain: foundMountain });
      }
    });
});

// Edit Route
router.get("/:id/edit", middleware.checkOwnership, function(req, res) {
  // Check if a user is logged in
  // if (req.isAuthenticated()) {
  Mountain.findById(req.params.id, function(err, foundMountain) {
    // if (err) {
    //   res.redirect("/mountains");
    // } else {
    // Does the user created / own the post
    // Using the .equals method because foundMountain.author.id is an object and req.user._id is a String (cannot compare the two with "===")
    // if (foundMountain.author.id.equals(req.user._id)) {
    res.render("mountains/edit", { mountain: foundMountain });
    // } else {
    //   res.send("You Do Not Have Permission to Do This");
    // }
    // }
  });
  // } else {
  //   console.log("You Need to be logged in to do that !!!");
  //   res.send("You Need to be logged in to do that !!!");
  // }

  // If a user is not logged in, redirect him
});

// Update Route
router.put("/:id", middleware.checkOwnership, function(req, res) {
  // find and update the correct campground
  // only req.body.mountain not not name/image/description because they all were wrapped together in edit.ejs file. For example name="mountain[image]"
  Mountain.findByIdAndUpdate(req.params.id, req.body.mountain, function(
    err,
    updatedMountain
  ) {
    if (err) {
      res.redirect("/mountains");
    } else {
      // redirect
      res.redirect("/mountains/" + req.params.id);
    }
  });
});

// Delete Route
router.delete("/:id", middleware.checkOwnership, function(req, res) {
  Mountain.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/mountains");
    } else {
      res.redirect("/mountains");
    }
  });
});

module.exports = router;