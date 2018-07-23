var express= require("express");
var app=express();
var bodyparser=require("body-parser");
var mongoose=require("mongoose");
var flash=require("connect-flash");
var User = require("./models/user");
var Item = require("./models/item");
var passport=require("passport");
var LocalStrategy=require("passport-local").Strategy;
var methodOverride = require("method-override");
var seedDB = require("./seed");

var //commentRoutes=require("./routes/comments"),
    itemRoutes=require("./routes/items"),
    userRoutes=require("./routes/users"),
    indexRoutes=require("./routes/index");
//DB
mongoose.connect(process.env.DATABASEURL);

//app settings
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));//files path
app.use(methodOverride("_method"));
app.use(flash());


//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:"secret is secret",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});


//ROUTES

app.use("/items",itemRoutes);
app.use("/user",userRoutes);
app.use(indexRoutes);

//DATABASE INITIALIZATION
seedDB();

app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Server started!") ;
});



