

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/itemDB");
const itemSchema={
  item:String
};
const item= new mongoose.model("item",itemSchema);
const item1= new item({
  item:"Welcome to my to-do list"
});
const item2= new item({
  item:"press the + button to add events"
});
const item3 = new item({
  item: "press the checkbox to delete the event"
});
const itemArray=[item1,item2,item3];
const listSchema={
  name:String,
  items:[itemSchema]
}
const list= new mongoose.model("list",listSchema);



app.get("/", function (req, res) {
  res.sendFile(__dirname + "/home.html");
});

app.get("/todo", function(req, res) {
  item.find({},function(err,foundItems){
      if(foundItems.length===0){
        item.insertMany(itemArray, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("success");
          }
        });
 res.redirect("/todo"); 
      }
     
    else {
   res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  })
});

app.post("/",function(req,res){
  res.redirect("/todo")
})
 


app.post("/todo", function(req, res){
  const ddd=req.body.list;
  const updateItem = req.body.newItem;
  const abc= new item({
    item:updateItem
  });
  if(ddd==="Today"){
  abc.save();
  res.redirect("/todo");
  }
  else{
    list.findOne({name:ddd},function(err,newPush){

  newPush.items.push(abc);
  newPush.save();
  res.redirect("/todo"+ddd);}
  
    )}

 
});
app.post("/todo/delete",function(req,res){
  const idValue=req.body.cb;
  const listName=req.body.listName;
  if(listName==="Today"){
item.findByIdAndRemove(idValue,function(err){
    if(!err){
    console.log("success");
  res.redirect("/todo");
    }
  });
}
  else{
        list.findOneAndUpdate({name:listName},{$pull:{items:{_id:idValue}}},function(err,found){
      if(!err){
        res.redirect("/todo" + listName);
      }


  })}
});



app.get("/todo/:randomRoute", function(req,res){
  const customRoute=req.params.randomRoute;
  list.findOne({name:customRoute},function(err,found){
    if(!err){
      if(!found){
         const newList = new list({
           name: customRoute,
           items: itemArray, 
         });
         newList.save();
  res.redirect("/todo/"+ customRoute);
      }
    
      else{
       res.render("list", { listTitle: found.name, newListItems:found.items  });
      }
    }
  })
 

  
});
app.post("/todo/customRoute",function(req,res){
    const updateNew = req.body.newItem;
    const abcd = new item({
      item: updateItem,
    });
    abcd.save();
    res.redirect("/todo/"+ customRoute);
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
