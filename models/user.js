var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

var UserSchema=new mongoose.Schema({
   username:String,
   password:String,
   coins:Number,
   items:{forSale:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Item"
    }],
    sold:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Item"
    }],
    bought:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Item"
    }]
    
    }
});
var options = {
 errorMessages: {
  IncorrectPasswordError: 'Password is incorrect',
  IncorrectUsernameError: 'Username does not exist'
 }
};
UserSchema.plugin(passportLocalMongoose, options);
// UserSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",UserSchema);