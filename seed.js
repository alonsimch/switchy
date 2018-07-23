var mongoose = require("mongoose");
var User = require("./models/user");
var Item   = require("./models/item");

var data1 = [
    {name : "Buttoned shirt", image : "http://brandstore.vistaprint.in/render/undecorated/product/PVAG-8421419Q0717/RS-2YQYW70KK367/jpeg?compression=95&width=700", status:"forSale", description : "brand new shirt..",price:"20",type:"Shirt" },
{  name : "colorful shirt", image : "https://gloimg.samcdn.com/S/pdm-product-pic/Clothing/2016/11/10/source-img/20161110102826_76040.JPG", status:"forSale", description : "Amazing etc.",price:"5",type:"Shirt" }];
var data2= [
{  name : "long pants", image : "https://cdn.shopify.com/s/files/1/2445/4975/products/1610039_outerknown_veranobeachpant_alo_f_600x.jpg?v=1525473918", status:"forSale", description : "pants..." ,price:"5",type:"Pants"},
{ name : "shoes", image:"https://pbs.twimg.com/media/DdUEW3bWAAEhj6l.jpg", status:"forSale", description : "sporty shoes",price:"111",type:"Shoes" }
]

function seedDB(){
   //Remove users and items
    User.remove({}, function(err){
        if(err){console.log(err);}
        console.log("removed users!");
    Item.remove({}, function(err) {
            if(err){console.log(err);}
        console.log("removed items!");
            
             //add a few users
             User.register({username:"q"},"q",function(err,user1){
              if(err){
                  console.log(err);
                  console.log(err.message);
                }
                
                     Item.create(data1[0],function(err, item1){
                        if(err){
                            console.log(err)
                        }
                        item1.owner=({id:user1.id,username:user1.username});
                        item1.save();
                        user1.items.forSale.push(item1.id);
                        user1.save();
                    Item.create(data1[1],function(err, item2){
                        if(err){
                            console.log(err)
                        }
                        item2.owner=({id:user1.id,username:user1.username});
                        item2.save();
                        user1.items.forSale.push(item2.id);
                        user1.save();
                        //add a few users
             User.register({username:"w"},"w",function(err,user2){
              if(err){
                  console.log(err);
                  console.log(err.message);
                }
                
                    Item.create(data2[0],function(err, item21){
                        if(err){
                            console.log(err)
                        }
                        item21.owner=({id:user2.id,username:user2.username});
                        item21.save();
                        user2.items.forSale.push(item21.id);
                        user2.save();
                    
                        });
                        
                 user2.coins=100;
                 user2.save();
        
                 });
                        });
                        });
                         
                 user1.coins=100;
                 user1.save();
                 
                 });
             
            
    }); 
    });
    // //add a few comments
          User.register({username:"e"},"e",function(err,user3){
              Item.create(data2[1],function(err, item21){
                        if(err){
                            console.log(err)
                        }
                        item21.owner=({id:user3.id,username:user3.username});
                        item21.save();
                        user3.items.forSale.push(item21.id);
                        user3.save();
                    
                        });
                 user3.coins=100;
                 user3.save();
             });
}

module.exports = seedDB;