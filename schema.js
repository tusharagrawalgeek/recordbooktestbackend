const mongoose=require('mongoose');
const schema=new mongoose.Schema({
    name:String,
    quantity:Number,
    date:String,
    expiry:String,
    description:String,
    receivedBy:String,
    receivedFrom:String
})
const Item=mongoose.model('ITEMS',schema);
module.exports=Item;