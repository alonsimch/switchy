var mongoose=require("mongoose");

var ItemSchema=new mongoose.Schema({
   name:String,
   image:String,
   image_id:String,
   category:String,
   brand:String,
   type:String,
   size:String,
   status:String,
   price:Number,
   description:String,
   buyRequests:[
            {type:mongoose.Schema.Types.ObjectId,
            ref:"User"}
        ],
        
    buyer:{type:mongoose.Schema.Types.ObjectId,
            ref:"User"}
    ,  
   owner: {
        id: {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    }
});

module.exports=mongoose.model("Item",ItemSchema);