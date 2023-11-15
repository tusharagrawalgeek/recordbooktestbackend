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
const ImportedItem=mongoose.model('IMPORTEDITEM',schema);
module.exports=ImportedItem;