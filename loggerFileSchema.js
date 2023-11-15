const mongoose = require('mongoose');
const schema=new mongoose.Schema({
    timestamp:Date,
    type:String,
    data:String
})
const Logger=mongoose.model('LOGGER',schema);
module.exports=Logger;