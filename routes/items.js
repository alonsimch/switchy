var express = require("express");
var router=express.Router();
var passport=require("passport");
var Item = require("../models/item");
var User = require("../models/user");
var middleware = require("../middleware/index");
var multer = require('multer');

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
                  // send back the data we found as JSON
                    res.json(allItems);
               }
            });
        }else{
            console.log(req.user);
            Item.find({},function(err,allItems){
                if(err){
                  console.log("Error:Something went wrong!");
                  console.log(err);
               } else {
                   if(req.xhr) { // if request was made with AJAX then ..
                   res.json(allItems); // send back all data as JSON
                 } else {
                  res.render("items/index",{items:allItems});
               }
                   
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
router.post("/",middleware.isLoggedIn, upload.single('image'),function(req,res){
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
        
            foundUser.items.forSale.push(item._id);
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
    Item.findById(req.params.id).populate("buyRequests").exec(function(err,foundItem){
        if(err){
         console.log("Error:Something went wrong!");
         console.log(err);
      } else {
         console.log("item shown successfully!");
         console.log(foundItem);
          res.render("items/show",{item:foundItem});
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
                     return res.redirect('back');
                } 
               //delete old file from cloudinary using the id we kept inside the object
                cloudinary.v2.uploader.destroy(item.image_id,function(err,result){
                if (err){
                          return res.redirect('back');
                }
                //upload the new image
                cloudinary.v2.uploader.upload(req.file.path,function(err,result){
                if (err){
                          return res.redirect('back');
                }
                //add coudinary url for the image to the object under image property
                req.body.item.image=result.secure_url;
                //add image's public id to the itemground object
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

//BUY REQUEST
router.get("/:id/buy",middleware.isLoggedIn,function(req,res){
    console.log("BUY route");
    if(req.xhr){
    Item.findById(req.params.id,function(err,item){
      if(err){
         console.log("Error:Something went wrong!");
         console.log(err);
          return res.redirect("/:id");
      };
      User.findById(req.user.id,function(err, buyerUser) {
          if(err){
         console.log("Error:Something went wrong!");
         console.log(err);
          return res.redirect("/:id");
         };
         if ((buyerUser.coins>=item.price)&&(item.owner.id != req.user.id)&&(item.status=="forSale" || item.status=="requested")){
             
                 item.status="requested";
                 item.buyRequests.push(buyerUser.id);
                 item.save();
                 console.log("item");
                 console.log(item);
                 
             res.json(true);
         }else{
             res.json(false);
         };
         
      });
    });
    }else{
        res.redirect("/items/"+req.params.id);
    }
});

// cancel buy request route
router.get("/:id/buycancel",middleware.isLoggedIn,function(req,res){
    console.log("Buycancel route");
    if(req.xhr){
    Item.findById(req.params.id,function(err,item){
      if(err){
         console.log("Error:Something went wrong!");
         console.log(err);
          return res.redirect("/:id");
      };
      User.findById(req.user.id,function(err, buyerUser) {
          if(err){
         console.log("Error:Something went wrong!");
         console.log(err);
          return res.redirect("/:id");
         };
         if (item.buyRequests.toString().indexOf(buyerUser.id)>-1 && item.status=="requested"){
             
            item.buyRequests.pull(buyerUser.id);
                 console.log(item.buyRequests.toString());
                 if (item.buyRequests.toString()==""){
                     item.status="forSale";
                 }
                 item.save();
                 console.log("item");
                 console.log(item);
                 
             res.json(true);
         }else{
             res.json(false);
         };
         
      });
    });
    }else{
        res.redirect("/items/"+req.params.id);
    }
});

//ApproveRequest route
router.get("/:id/approveRequest/:buyerId",middleware.isLoggedIn,function(req,res){
    console.log("ApproveRequest route");
    if(req.xhr){
    Item.findById(req.params.id,function(err,item){
      if(err){
         console.log("Error:Something went wrong!");
         console.log(err);
          return res.redirect("/:id");
      };
      User.findById(req.params.buyerId,function(err, buyerUser) {
          if(err){
         console.log("Error:Something went wrong!");
         console.log(err);
          return res.redirect("/:id");
         };
         if (item.buyRequests.toString().indexOf(buyerUser.id)>-1 && item.owner.id.equals(req.user.id) && buyerUser.coins>=item.price && item.status=="requested"){
             
             //find seller user for Notification (in future version)
             User.findById(item.owner.id,function(err, sellerUser){
                 if(err){console.log(err);};
                 item.status="approved"
                 sellerUser.items.forSale.pull(item.id);
                 sellerUser.items.sold.push(item.id);
                 sellerUser.save();
                 item.buyer=buyerUser.id;
                 item.save();
                 console.log("item");
                 console.log(item);
                 buyerUser.coins-=item.price;
                 buyerUser.items.bought.push(item.id);
                 buyerUser.save();
                 
             });
             res.json(true);
         }else{
             res.json(false);
         };
         
      });
    });
    }else{
        res.redirect("/items/"+req.params.id);
    }
});

//cancel ApprovalRequest route
router.get("/:id/cancelApproval",middleware.isLoggedIn,function(req,res){
    console.log("cancel ApprovalRequest route");
    if(req.xhr){
    Item.findById(req.params.id,function(err,item){
      if(err){
         console.log("Error:Something went wrong!");
         console.log(err);
          return res.redirect("/:id");
      };
      if (req.user.id!=item.buyer && req.user.id!=item.owner.id){
          console.log("unauthorized user");
          return res.redirect("/items/"+req.params.id);
      }else{
          if (item.status=="approved"){
      User.findById(item.buyer,function(err, buyerUser) {
          if(err){
         console.log("Error:Something went wrong!");
         console.log(err);
          return res.redirect("/:id");
         };
             
             //find seller user for Notification (in future version)
             User.findById(item.owner.id,function(err, sellerUser){
                 if(err){console.log(err);};
                
                 buyerUser.coins+=item.price;
                 item.status="requested"
                 sellerUser.items.forSale.push(item.id);
                 sellerUser.items.sold.pull(item.id);
                 sellerUser.save();
                 item.buyer=null;
                 item.save();
                 console.log("item");
                 console.log(item);
                 
                 buyerUser.items.bought.pull(item.id);
                 buyerUser.save();
                 res.json(true);
             });
             
         });
          }else{
              res.json(false);
          }
      };
      
    });
    }else{
        res.redirect("/items/"+req.params.id);
    }
});

//drop-off route
router.get("/:id/dropOff",middleware.isLoggedIn,function(req,res){
    console.log("dropOff route");
    if(req.xhr){
    Item.findById(req.params.id,function(err,item){
      if(err){
         console.log("Error:Something went wrong!");
         console.log(err);
          return res.redirect("/:id");
      };
         if (item.owner.id.equals(req.user.id) && item.status=="approved"){
             
                 if(err){console.log(err);};
                 item.status="droppedOff"
                 item.save();
                 console.log("item");
                 console.log(item);
                 
             res.json(true);
         }else{
             res.json(false);
         };
         
    });
    }else{
        res.redirect("/items/"+req.params.id);
    }
});

//cancel drop-off route
router.get("/:id/cancelDropOff",middleware.isLoggedIn,function(req,res){
    console.log("cancel dropOff route");
    if(req.xhr){
    Item.findById(req.params.id,function(err,item){
      if(err){
         console.log("Error:Something went wrong!");
         console.log(err);
          return res.redirect("/:id");
      };
         if (item.owner.id.equals(req.user.id) && item.status=="droppedOff"){
             
                 if(err){console.log(err);};
                 item.status="approved"
                 item.save();
                 console.log("item");
                 console.log(item);
             res.json(true);
         }else{
             res.json(false);
         };
         
    });
    }else{
        res.redirect("/items/"+req.params.id);
    }
});

//received route
router.get("/:id/received",middleware.isLoggedIn,function(req,res){
    console.log("received route");
    if(req.xhr){
    Item.findById(req.params.id,function(err,item){
      if(err){
         console.log("Error:Something went wrong!");
         console.log(err);
          return res.redirect("/:id");
      };
      User.findById(item.buyer,function(err, buyerUser) {
          if(err){
         console.log("Error:Something went wrong!");
         console.log(err);
          return res.redirect("/:id");
         };
         if (item.buyer.equals(req.user.id) && item.status=="droppedOff"){
             
             //find seller user 
             User.findById(item.owner.id,function(err, sellerUser){
                 if(err){console.log(err);};
                 item.status="sold";
                item.buyRequests=[];
                item.buyer=null;
               item.owner=({id:buyerUser.id,username:buyerUser.username});
                 item.save();
                 sellerUser.coins+=item.price;
                 sellerUser.save();
                 console.log("item");
                 console.log(item);
                 
             });
             res.json(true);
         }else{
             res.json(false);
         };
         
      });
    });
    }else{
        res.redirect("/items/"+req.params.id);
    }
});

//Resell route
router.get("/:id/resell",middleware.isLoggedIn,function(req,res){
    console.log("BUY route");
    if(req.xhr){
    Item.findById(req.params.id,function(err,item){
      if(err){
         console.log("Error:Something went wrong!");
         console.log(err);
          return res.redirect("/:id");
      };
      User.findById(req.user.id,function(err, user) {
          if(err){
         console.log("Error:Something went wrong!");
         console.log(err);
          return res.redirect("/:id");
         };
         if ((item.owner.id == user.id)&&(item.status=="sold")){
             
                user.items.forSale.push(item.id);
                user.items.bought.pull(item.id);
                 user.save();
                 item.status="forSale";
                 item.save();
                 console.log("user");
                 console.log(user);
                 console.log("item");
                 console.log(item);
                 
             res.json(true);
         }else{
             res.json(false);
         };
         
      });
    });
    }else{
        res.redirect("/items/"+req.params.id);
    }
});

module.exports=router;