var Mountain = require("../models/mountains");
var Comment = require("../models/comment");

// All The Middleware
var middlewareObj = {};

//   ==============================================================================================

// MiddleWare function for checking if the post belongs to the logged in person
middlewareObj.checkOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Mountain.findById(req.params.id, function(err, foundMountain) {
      if (err) {
        req.flash("error", "Post Not Found !!!");
        res.redirect("back");
      } else {
        // Does the user created / own the post
        // Using the .equals method because foundMountain.author.id is an object and req.user._id is a String (cannot compare the two with "===")
        if (foundMountain.author.id.equals(req.user._id)) {
          // if the info matches, move on ... or next :)
          next();
        } else {
          req.flash("error", "You Do Not Have Permission For This !!!");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You First Need To Be Logged In !!!");
    // redirect to the previous page
    res.redirect("back");
  }
};

//   ==============================================================================================

// MiddleWare function for checking if the comment belongs to the logged in person
middlewareObj.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        res.redirect("back");
      } else {
        // Does the user created / own the comment
        // Using the .equals method because foundComment.author.id is an object and req.user._id is a String (cannot compare the two with "===")
        if (foundComment.author.id.equals(req.user._id)) {
          // if the info matches, move on ... or next :)
          next();
        } else {
          req.flash("error", "You Do Not Have Permission For This !!!");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You First Need To Be Logged In !!!");
    // redirect to the previous page
    res.redirect("back");
  }
};

//   ==============================================================================================

// MiddleWare to check if you are logged in or not
middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("error", "You First Need To Be Logged In !!!");
    res.redirect("/login");
  }
};

module.exports = middlewareObj;
