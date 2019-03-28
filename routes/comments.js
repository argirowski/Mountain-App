var express = require("express");
var Mountain = require("../models/mountains");
var Comment = require("../models/comment");
var middleware = require("../middleware");
// mergeParams is used to be able to access the ":id" info
var router = express.Router({ mergeParams: true });

// ==================== Comments Routes ====================

// Added a middleware (isLoggedIn) to check if you are logged in or not. if not, you cannot post comments. If you are logged in, you can.
router.get("/new", middleware.isLoggedIn, function(req, res) {
  // Find Mountain by ID
  Mountain.findById(req.params.id, function(err, mountain) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { mountain: mountain });
    }
  });
});

// Also added middleware to prevent anyone adding a comment unless they are logged in
router.post("/", middleware.isLoggedIn, function(req, res) {
  // Find Mountain using the ID
  Mountain.findById(req.params.id, function(err, mountain) {
    if (err) {
      console.log(err);
      res.redirect("/mountains");
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          req.flash("error", "Ups ... Something Went Wrong !!!");
          console.log(err);
        } else {
          // add username and ID to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // then save comment
          comment.save();
          // important... needs to be commentS.push
          mountain.comments.push(comment);
          mountain.save();
          console.log(comment);
          req.flash("success", "Comment Added Successfully !!!");
          res.redirect("/mountains/" + mountain._id);
        }
      });
    }
  });
});

// Edit Comment Route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(
  req,
  res
) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
    if (err) {
      res.redirect("back");
    } else {
      res.render("comments/edit", {
        mountain_id: req.params.id,
        comment: foundComment
      });
    }
  });
});

// Update Comment Route
router.put("/:comment_id", function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(
    err,
    updatedComment
  ) {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/mountains/" + req.params.id);
    }
  });
});

// Delete Comment Route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(
  req, res) {
  //Find the comment by ID and delete it
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if (err) {
      res.redirect("back");
    } else {
      req.flash("success", "Comment Deleted !!!");
      res.redirect("/mountains/" + req.params.id);
    }
  });
});

module.exports = router;
