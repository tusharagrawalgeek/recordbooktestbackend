const mongoose=require('mongoose');
const schema=new mongoose.Schema({
    name:String,
    quantity:Number,
    date:String,
    expiry:String,
    description:String,
    receivedBy:String,
    receivedFrom:String,
    exportedTo:String,
    purpose:String
})
const ExportedItem=mongoose.model('EXPORTEDITEMS',schema);
module.exports=ExportedItem;