var express = require("express");
var router=express.Router();
var passport=require("passport");
var Item = require("../models/item");
var User = require("../models/user");
var middleware = require("../middleware/index");
var multer = require('multer');
// eval(require("locus"));

var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'switchy', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});


//item routes
//index
router.get("/index",function(req,res){
    if(req.query.search){
            const regex = new RegExp(middleware.escapeRegex(req.query.search), 'gi');
             Item.find({name:regex},function(err,allItems){
                if(err){
                  console.log("Error:Something went wrong!");
                  console.log(err);
               } else {
                  res.render("items/index",{items:allItems});
               }
            });
        }else{
            console.log(req.user);
            Item.find({},function(err,allItems){
                if(err){
                  console.log("Error:Something went wrong!");
                  console.log(err);
               } else {
                  res.render("items/index",{items:allItems});
               }
            });
        }
});

//filter
router.get("/index/filter",function(req,res){
   
             for (var i in req.query.filter){
                if (req.query.filter[i]==="-"){req.query.filter[i]=null;}
               
            }
            Item.find(req.query.filter,function(err,allItems){
                if(err){
                  console.log("Error:Something went wrong!");
                  console.log(err);
              } else {
                  res.render("items/index",{items:allItems});
              }
            });
        
});

//new
router.get("/new",middleware.isLoggedIn,function(req,res){
res.render("items/new");
});
//create
router.post("/",middleware.isLoggedIn, upload.single('image'),function(req,res){//need to add ,middleware.isLoggedIn
cloudinary.v2.uploader.upload(req.file.path, function(err,result) {
    if (err){
            console.log("upload error");
            console.log(err);
            return res.redirect('back');
        }
   User.findById(req.user._id,function(err,foundUser){
        if(err){
         console.log("Error:Something went wrong!");
         console.log(err);
         return res.redirect('back');
         }
        req.body.item.image = result.secure_url;
        req.body.item.image_id=result.public_id;
        
        req.body.item.owner={
            id:req.user._id,
            username:req.user.username};
        
        Item.create(req.body.item,function(err,item){
            if(err){
             console.log("Error:Something went wrong!");
             console.log(err);
             return res.redirect('back');
            } 
        
            foundUser.items.push(item._id);
            foundUser.save();
            console.log("item created successfully");
            console.log(item);
            console.log(foundUser);
            res.redirect("/items/"+ item.id);
             });
    });
});
});



//show
router.get("/:id",function(req, res) {
    User.findById(req.params.id)
    .populate({ path: 'items.forSale' })
    .populate({ path: 'items.sold' })
    .populate({ path: 'items.bought' })
    .exec(function(err,foundUser){
        if(err){
         console.log("Error:Something went wrong!");
         console.log(err);
      } else {
         console.log("camp shown successfully!");
         console.log(foundUser);
          res.render("users/show",{user:foundUser});
      };
        
    });
   
});
//edit
//EDIT FORM
router.get("/:id/edit",middleware.checkItemOwnership,function(req, res) {
        Item.findById(req.params.id,function(err,foundItem){
        if(err){
             console.log("Error:Something went wrong!");
             console.log(err);
             return res.redirect('back');
          } else {
                  res.render("items/edit",{item:foundItem});
             
          }; 
        });
    
});
//update
router.put("/:id",middleware.checkItemOwnership,upload.single('image'),function(req, res) {
    //if a new file has been uploaded
    if (req.file){
        Item.findById(req.params.id,function(err,item){
               if(err){
                     console.log("Error:Something went wrong!");
                     console.log(err);
                    //  req.flash('error', err.message);
                     return res.redirect('back');
                } 
               //delete old file from cloudinary 
                cloudinary.v2.uploader.destroy(item.image_id,function(err,result){
                if (err){
                          return res.redirect('back');
                }
                //upload the new image
                cloudinary.v2.uploader.upload(req.file.path,function(err,result){
                if (err){
                          return res.redirect('back');
                }
                //add coudinary url 
                req.body.item.image=result.secure_url;
                //add image's public id 
                req.body.item.image_id=result.public_id;
                Item.findByIdAndUpdate(req.params.id,req.body.item,function(err,updatedItem){
                    if(err){
                        console.log("Error:Something went wrong!");
                        console.log(err);
                        return res.redirect('back');
                     }
                    res.redirect('/items/'+item._id);
                });
                });
                });
        });
    }else{
        Item.findByIdAndUpdate(req.params.id,req.body.item,function(err,updatedItem){
            if(err){
                    console.log("Error:Something went wrong!");
                    console.log(err);
                    return res.redirect('back');
                     }
            res.redirect('/items/'+updatedItem._id);
            });
    }
});

//destroy
router.delete("/:id",middleware.checkItemOwnership,function(req, res) {
    Item.findById(req.params.id,function(err,item){
      if(err){
         console.log("Error:Something went wrong!");
         console.log(err);
          return res.redirect("/items/index");
      };
     //delete old file from cloudinary 
     if (item.image_id){
         cloudinary.v2.uploader.destroy(item.image_id,function(err,result){
        if (err){
                req.flash('error',err.message);
                return res.redirect('back');
                }
         });
     }
    
        item.remove();
        req.flash('success',"Item removed successfully!");
        res.redirect("/items/index");
        
    });
});


module.exports=router;