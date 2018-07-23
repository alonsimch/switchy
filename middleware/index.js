var Item = require("../models/item");

var middlewareObj={};

//MIDDLE-WARE
middlewareObj.checkItemOwnership =function(req,res,next){
      if(req.isAuthenticated()){
        Item.findById(req.params.id,function(err,foundItem){
        if(err){
            // req.flash("error","Campground not found");
             console.log("Error:Something went wrong!");
             console.log(err);
             res.redirect("back");
          } else {
              if(foundItem.owner.id.equals(req.user._id)){
                  next();
              }else{
                  req.flash("error","You don't have permission to do that : user ID missmach");
                  res.redirect("back");
              }
             
          }; 
        });
    }else{
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.escapeRegex = function(text) {
     return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

middlewareObj.isLoggedIn=function (req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to do that");
    res.redirect("/login");
}


module.exports=middlewareObj;