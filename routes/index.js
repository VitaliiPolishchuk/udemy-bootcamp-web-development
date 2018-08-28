var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = express("../models/user");

//root route
router.get("/", function(req, res){
    res.render("landing");
});

//show sign up form
router.get("/register", function(req, res){
    res.render("register");
});

//submit sign up

//show login form
router.get("/login", function(req, res){
    res.render("login");
});

//submit login
router.post("/login",passport.authenticate("local", 
{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res) {
});

//Logout route
router.get("/logout", function(req, res){
    req.logout(); 
    req.flash("success", "Logged you out");
    res.redirect("/campgrounds");
});

module.exports = router;