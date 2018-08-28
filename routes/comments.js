var express = require("express");

var router = express.Router({mergeParams: true});

var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//Comments new
router.get("/new",middleware.isLoggedIn ,function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("comments/new", {campground: foundCampground});
        }
    });
});


//Comments create
router.post("/",middleware.isLoggedIn ,function(req, res){
    console.log(req.params.id);
   Campground.findById(req.params.id, function(err, foundCampground) {
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
           Comment.create(req.body.comment, function(err, comment){
               if(err){
                   req.flash("error", "Something went wrong with data")
                   console.log(err);
               } else {
                   console.log()
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   comment.save();
                   foundCampground.comments.push(comment);
                   foundCampground.save();
                   req.flash("success", "Successfully added comment");
                   res.redirect("/campgrounds/" + foundCampground._id);
               }
           })
       }
   }) ;
});

//edit
router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
            res.render("comments/edit", {campground_id: req.params.id, comment:foundComment}); 
    });
});

//update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
            res.redirect("/campgrounds/" + req.params.id);
    })
});

//destroy

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
    })
});

module.exports = router;
