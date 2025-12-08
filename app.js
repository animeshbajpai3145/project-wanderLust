const express = require("express");
const app = express();
const ejsMate= require("ejs-mate");
const mongoose  = require("mongoose");
const path = require ("path");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const listings= require("./routes/listing.js");
const reviews = require("./routes/reviews.js");
const Mongo_Url = "mongodb://127.0.0.1:27017/wanderlust";

app.use(methodOverride("_method"));
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));



main().then(()=>{
   console.log("connected to db successfully ");
}).catch((err)=>{
   console.log(err);
});
async function main(){
   await mongoose.connect(Mongo_Url);

}

// routes
app.use("/listings", listings);
app.use('/listings/:id/reviews',reviews);

app.get("/",(req,res)=>{
  res.render("listings/home.ejs")
});
app.all("/*path",(req,res,next)=>{
   next(new ExpressError(404,"Page not found"));
});

app.use((err,req,res,next)=>{
   let{statusCode=500,message="Something went wrong!"}= err;
   res.status(statusCode).render("Error.ejs",{err});
  
});


app.listen(8080,()=>{
   console.log("server is listening to port 8080");
});