var express = require("express");
var router=express.Router();
var User = require("../models/user");
var passport=require("passport");

//Routes
//default
router.get("/",function(req,res){
    res.render("landing");
});

//=============
//AUTH ROUTES
//=============
//signup form
router.get("/register",function(req,res){
    res.render("register");
});

//handle registration
router.post("/register",function(req,res){
    
    var newUser = new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
      if(err){
          console.log(err);
          console.log(err.message);
          req.flash("error",err.message);
          return res.redirect("/register");
      }
    user.coins=100;
    user.save(function(err,user){
      if(err){
          console.log(err);
      }});
      
          passport.authenticate("local")(req,res,function(){
              req.flash("success","Welcome to Switchy "+user.username);
              res.redirect("/items/index");
          });
    });
    
});

router.get("/login",function(req,res){
    res.render("login"); 
});

//login
router.post("/login",passport.authenticate("local",{
    successRedirect: "/items/index",
    failureRedirect: "/login",
    failureFlash:true,
    successFlash:"Logged In successfully!"
}),function(req,res){
});

//LOGOUT 
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged you out!");
    res.redirect("/items/index");
});

module.exports=router;