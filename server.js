const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt=require('jsonwebtoken');
const bc=require('bcrypt');
const app = express();
const Logger=require("./loggerFileSchema");
const Item = require("./schema");
const User = require("./userSchema");
const ExportedItem = require("./exported");
const ImportedItem = require("./importedItem");
// const db='mongodb+srv://tushar:tushar432@cluster0.pvtih2d.mongodb.net/db2?retryWrites=true&w=majority';
const db =
    'mongodb+srv://tushar:tushar123@cluster0.bnlzgl7.mongodb.net/testing?retryWrites=true&w=majority';
  // "mongodb+srv://tushar:tushar123@cluster0.bnlzgl7.mongodb.net/rishi?retryWrites=true&w=majority";
mongoose
  .connect(db, {
    // useNewUrlParser:true,
    // useCreateIndex: true,
    // useUnifiedTopology:true,
    // useFindAndModify:false
  })
  .then(() => {
    console.log("Connection established");
  })
  .catch((err) => {
    console.log(err);
    console.log("Couldn't connect to database");
  });

const bp = require("body-parser");
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

app.use(express.json());
app.use(cors());

//adds and item to both curent inventory and imported item if id is null and if id is given then the item with the given id is updated and also added in the imported items
app.post("/setitem", async (req, res) => {
    var result = 200;
    // if(req.params.id===-1){
      const p = new Item(req.body);
  
      const newLog= new Logger({timestamp:new Date(), type:"import 1", data:JSON.stringify(req.body)});
      // console.log(newLog);
      
      await p.save()
    .then(async () => {
      // console.log("added to current inventory");
      await newLog.save()
      .then(res=>console.log("Logged 1"))
      .catch(console.log)
    })
    .catch((err) => {
      console.log("Could not add");
      res.status(500).json({ error: "server error" });
    });
    // }else{
      // const result = Item.findByIdAndUpdate(req.params.id, req.body);
      // console.log(result);
    // }
  console.log(result);
  res.send(result);
});

app.post("/setimporteditem", (req, res) => {
  const q = new ImportedItem(req.body);
  var result = 200;
  q.save()
    .then(async () => {
      console.log("added to importeditems");
      const newlog=new Logger({timestamp:new Date().toLocaleString("en-US", {timeZone: 'Asia/Kolkata'}),type:"import 2",data:JSON.stringify(req.body)});
      newlog.save()
      .then(console.log("Logged 2"))
      .catch()
    })
    .catch((err) => {
      res.status(500).json({ error: "server error" });
    });
    res.send(result);
}
)
app.get("/getimporteditems", async (req, res) => {
  try {
    const data = await ImportedItem.find();
    return res.status(200).json({
      success: true,
      count: data.length,
      data: data,
    });
  } catch {
    // console.log(err);
    res.status(500).json({ error: "server error" });
  }
});
app.get("/getitem", async (req, res, next) => {
  try {
    const data = await Item.find();
    return res.status(200).json({
      success: true,
      count: data.length,
      data: data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});
app.delete("/deleteitem/:id", async (req, res) => {
  // const obj=await Item.findById(req.params.id);
  const result = await Item.findByIdAndDelete(req.params.id);
  const newLog=await new Logger({timestamp:new Date(),type:"delete inventory",data:JSON.stringify(result)})
  newLog.save()
  .then(res.send("Deleted"))
  .catch(console.log)
  // console.log(result);
  // res.send("Deleted");
});
app.delete("/deleteimporteditem/:id", async (req, res) => {
  const result = await ImportedItem.findByIdAndDelete(req.params.id);
  const newLog=new Logger({timestamp:new Date(),type:"delete imported",data:JSON.stringify(result)})
  newLog.save()
  .then(res.send("Deleted"))
  .catch(console.log)
});
app.delete("/deleteexporteditem/:id", async (req, res) => {
  const result = await ExportedItem.findByIdAndDelete(req.params.id);
  const newLog=new Logger({timestamp:new Date(),type:"delete exported",data:JSON.stringify(result)})
  newLog.save()
  .then(res.send("Deleted"))
  .catch(console.log)
});
app.post("/getuser", async (req, res, next) => {
  try {
    console.log(req.body.username,req.body.password);
    const data = await User.find({username:req.body.username, password:req.body.password});
    return res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});
app.get("/getusers",async(req,res)=>{
  try {
    // console.log(req.body.username,req.body.password);
    const data = await User.find();
    return res.status(200).send(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
})
app.post("/findusername",async (req,res)=>{
  const data=await User.find({username:req.body.username});
  console.log(data);
  res.send({length:data.length});
})
app.put("/update/:id", async (req, res) => {
  console.log(req.params.id, req.body);
  const result = await Item.findByIdAndUpdate(req.params.id, req.body);
  res.send("Updated data" + result);
});
app.post("/exportitem", (req, res) => {
  const q = new ExportedItem(req.body);
  var result = 200;
  q.save()
    .then(async () => {
      console.log("added to exported items");
      const newlog=new Logger({timestamp:new Date(),type:"export",data:JSON.stringify(req.body)});
      newlog.save()
      .then(console.log("Logged"))
      .catch()
    })
    .catch((err) => {
      res.status(500).json({ error: "server error" });
    });
  console.log(result);
  res.send(result);
});
app.get("/getexported", async (req, res, next) => {
  try {
    const data = await ExportedItem.find();
    return res.status(200).json({
      success: true,
      count: data.length,
      data: data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
});
app.post("/setuser", async (req, res) => {
  try{
    console.log("here");
    const salt=await bc.genSalt();
    // const hashedPwd=await bc.hash(req.body.password,0);
    // console.log(salt);
    // console.log(hashedPwd);
    const p = new User({
      ...req.body,
      // password:hashedPwd
    });
  // console.log(req.body);
  p.save()
    .then((resp) => {
      console.log(resp,"sbcajk");
      res.send({result:"true"});
    })
    .catch((err) => {
      console.log(err);
    });
  }catch{
    res.status(500).send();
  }
  
});
app.post("/undoExport/:id",async (req,res)=>{
  console.log(req.params.id);
  const exportedItem=await ExportedItem.findById(req.params.id);
  console.log(exportedItem);
  const inventoryItem=await Item.find({name:exportedItem.name});
  console.log(inventoryItem);
  var result=false;
  if(inventoryItem[0]){
    console.log(inventoryItem[0]);
    const updateRes=await Item.findByIdAndUpdate(inventoryItem[0]._id, {quantity:exportedItem.quantity+inventoryItem[0].quantity});
  console.log(updateRes);
  // if(updateRes){
    result=true;
  // }else{
  //   result=false;
  // }
  }else{
    result=false;
    // console.log("nort exist");
    // const item=await Item({
    //   name:exportedItem.name,
    //   quantity:exportedItem.quantity,
    //   date:exportedItem.date,
    //   expiry:exportedItem.expiry,
    //   description:exportedItem.description,
    //   receivedBy:exportedItem.receivedBy,
    //   receivedFrom:exportedItem.receivedFrom
    // });
    // item.save()
    // .then((res) => {
    // })  
    // .catch((err) => {
    // });
    // result=true;
  }
  if(result===true){
    const deleteRes=await ExportedItem.deleteOne({_id:req.params.id});
    console.log(deleteRes);
    console.log("done success");
    res.status(200).send({res:true,message:"Operation undone"});
  }else{
    res.status(500).send({res:false,message:"Could not undo"});
  }
  // res.send(true);
})
app.listen(3001, () => {
  console.log("Server is listening at port 3001");
});
