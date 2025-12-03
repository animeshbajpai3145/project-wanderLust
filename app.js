const express = require("express");
const app = express();
const ejsMate= require("ejs-mate");
const mongoose  = require("mongoose");

const path = require ("path");
const methodOverride = require("method-override");
const { triggerAsyncId } = require("async_hooks");
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");
const {listingSchema, reviewSchema} = require('./schema.js');

const Listing  = require("./models/listing.js");
const Review = require("./models/reviews.js");
app.use(methodOverride("_method"));
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

const Mongo_Url = "mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
   console.log("connected to db successfully ");
}).catch((err)=>{
   console.log(err);
});
async function main(){
   await mongoose.connect(Mongo_Url);

}

const validateLisiting=(req,res,next)=>{
let {error} =listingSchema.validate(req.body);

 if(error){
   let errorMsg = error.details.map((el)=> el.message).join(",");
   throw new ExpressError(400,errorMsg);
 }else{
   next();
 }
};


const validateReview=(req,res,next)=>{
let {error} =reviewSchema.validate(req.body);

 if(error){
   let errorMsg = error.details.map((el)=> el.message).join(",");
   throw new ExpressError(400,errorMsg);
 }else{
   next();
 }
};



// edit route  -------------
app.get("/listings/:id/edit", async (req,res)=>{
   let{id}= req.params;
   let listing= await Listing.findById(id);
res.render("listings/edit.ejs",{listing});
});


//// udpate the data 
app.put("/listings/:id",validateLisiting,wrapAsync(async (req,res)=>{
   if(!req.body.listing){
    throw new ExpressError(400,"send valid data for listing ")
   }
   let{id}= req.params;
  await  Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect(`/listings/${id}`);
}));
/// delte route ------------
app.delete("/listings/:id",async (req,res)=>{
let {id}=req.params;
await Listing.findByIdAndDelete(id);
res.redirect("/listings");
});

// Reviews 
// Post Route

app.post("/listings/:id/reviews",validateReview ,wrapAsync(async(req,res)=>{
  let listing = await Listing.findById(req.params.id)
  let newReview = new Review(
     req.body.review );
     listing.reviews.push(newReview);
     await newReview.save();
     await listing.save();
     console.log("new Review saved");
     res.send("new review saved");
     res.redirect(`lisitngs/${listing._id}`);
}));
// create route ----------
app.post("/listings",validateLisiting, wrapAsync( async (req,res,next)=>{
  
console.log(req.body.listing);
const newListing = new Listing(req.body.listing);

await newListing.save();
  res.redirect("/listings");
  

}));

// index route--------------------
app.get("/listings",async (req,res)=>{
 const allListings = await Listing.find({});
 res.render("listings/index.ejs", {allListings});
});
// new route -------------------
app.get("/listings/new",(req,res)=>{
 res.render("listings/new.ejs");
});
// show route --------------------------
app.get("/listings/:id", async(req,res)=>{
   let userId = req.params.id;
   let listing =  await Listing.findById(userId).populate("reviews");
  res.render("listings/show.ejs",{listing});
});

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