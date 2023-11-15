const mongoose=require('mongoose');
const schema=new mongoose.Schema({
    username:String,
    email:String,
    phone:Number,
    age:Number, 
    password:String
})
const User=mongoose.model('USERS',schema);
module.exports=User;