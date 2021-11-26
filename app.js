const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const _ = require("lodash")



const app = express()
app.set("view engine", "ejs")

app.use(express.static("public"))

app.use(bodyParser.urlencoded({extended: true}))

mongoose.connect("mongodb+srv://kidagi:superdev11900@cluster0.u4wbu.mongodb.net/todolistDB", {useNewUrlParser: true})


const itemsSchema = new mongoose.Schema ({
    name: {
        type: String
    }
})

const Item = mongoose.model("Item", itemsSchema)

const item1 = new Item ({
    name: "reading books"
})
const item2 = new Item ({
    name: "solving algorithms"
})
const item3 = new Item ({
    name: "write some javascript"
})

const defaultItems = [item1, item2, item3]

const listSchema = new mongoose.Schema ({
    name: String,
    items: [itemsSchema]
})

const List = mongoose.model("List", listSchema)


app.get("/", function(req, res){
    Item.find({}, function(err, items){
        if(items.length === 0){
            Item.insertMany(defaultItems, function(err){
            if(err){
                console.log(err)
            }else{
                console.log("successfully saved items to the database")
            }
        })
        res.redirect("/")
    }else {
        res.render("list", {listTitle: "Today", newItems: items})
    }

    })
   
})
app.post("/", function(req, res){
    let itemName = req.body.item
    const listName = req.body.list

   
    const item = new Item ({
        name: itemName
    })

    if(listName === "Today"){
        item.save()
        res.redirect("/")
    }else {
        List.findOne({name: listName}, function(err, foundList){
            foundList.items.push(item)
            foundList.save()
            res.redirect("/" + listName)
        })
    }
   
})
app.post("/delete", function(req, res){
    const item = req.body.checkbox
    const listName = req.body.listName

    if(listName === "Today"){
        Item.findByIdAndRemove(item, function(err){
            if(err){
                console.log(err)
            }else{
                console.log("successfully deleted")
                res.redirect("/")
            }
        })
    }else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: item}}}, function(err, foundList){
            if(!err){
                res.redirect("/" + listName)
            }
        })
    }
  
   
    
})
app.get("/:route", function(req, res){
    const routeName = _.capitalize(req.params.route)
  
    List.findOne({name: routeName}, function(err, foundList){
        if(!err){
            if(!foundList){
                const list = new List ({
                    name: routeName,
                    items: [itemsSchema]
                })
                list.save()
                res.redirect("/" + routeName)
            }else {
                res.render("list", {listTitle: foundList.name, newItems: foundList.items})
            }
        }
    })
   
})

app.listen(3000, function(){
    console.log("server lisstening on port 3000");
})