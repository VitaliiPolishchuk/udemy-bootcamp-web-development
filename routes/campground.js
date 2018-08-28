var express = require("express");

var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//index
router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

//create
router.post("/",middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var description = req.body.description;
    var author = {
        id: req.user.id,
        username:req.user.username
    }
    var newCampground = {name: name, price: price, image: image, description: description, author: author};
    
    Campground.create(newCampground,function(err,campground){
            if(err){
                console.log(err);
            } else{
                console.log(campground);
                res.redirect("/campgrounds");
            }
        });
});

//new
router.get("/new", middleware.isLoggedIn ,function(req, res){
   res.render("campgrounds/new"); 
});

//Show mo info about campground

//show
router.get("/:id", function(req, res){
    console.log(req.params.id);
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err){
           console.log(err);
       } else {
           res.render("campgrounds/show", {campground: foundCampground});
       }
    });
});

//edit
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
           Campground.findById(req.params.id, function(err, foundCampground){
               if(err){
                   req.flash("error", "Campground doesn`t exist");
               }
               res.render("campgrounds/edit", { campground: foundCampground});
           });
});

router.put("/:id", function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, foundedCampground){
        if(err){
           req.flash("error", "Campground doesn`t update");
        }
        res.redirect("/campgrounds/" + req.params.id);
    });
});

//destroy

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
           req.flash("error", "Campground doesn`t remove");
        }
            res.redirect("/campgrounds");
    });
});

module.exports = router;
