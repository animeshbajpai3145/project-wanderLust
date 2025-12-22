const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema } = require('../schema.js');
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");


const validateLisiting=(req,res,next)=>{
let {error} =listingSchema.validate(req.body);

 if(error){
   let errorMsg = error.details.map((el)=> el.message).join(",");
   throw new ExpressError(400,errorMsg);
 }else{
   next();
 }
};




//  all Listings
router.get("/",async (req,res)=>{
 const allListings = await Listing.find({});
 res.render("listings/index.ejs", {allListings});
});
// new route: form to create
router.get("/new",isLoggedIn,(req,res)=>{
  
 res.render("listings/new.ejs");
});
//  new route: Adding listings
router.post("/",isLoggedIn,validateLisiting, wrapAsync( async (req,res,next)=>{
  
console.log(req.body.listing);
const newListing = new Listing(req.body.listing);

await newListing.save();
 req.flash("success","New Listing Created");
  res.redirect("/listings");
  

}));
// show route 
router.get("/:id", async(req,res)=>{
   let userId = req.params.id;
   let listing =  await Listing.findById(userId).populate("reviews");
   if(!listing){
    req.flash("error","Listing you requested for does not exist!");
     return res.redirect("/listings");
   }
           res.render("listings/show.ejs",{listing});
   

});

// edit route: form to edit  -------------
router.get("/:id/edit",isLoggedIn, async (req,res)=>{
   let{id}= req.params;
   let listing= await Listing.findById(id);
    if(!listing){
    req.flash("error","Listing you requested for does not exist!");
     return res.redirect("/listings");
   }
res.render("listings/edit.ejs",{listing});
});

// edit route : udpate the data 
router.put("/:id",validateLisiting,wrapAsync(async (req,res)=>{
   if(!req.body.listing){
    throw new ExpressError(400,"send valid data for listing ")
   }
   let{id}= req.params;
  await  Listing.findByIdAndUpdate(id,{...req.body.listing});
       req.flash("success" ,"Listing updated!");

   res.redirect(`/listings/${id}`);
}));

// delete route 
router.delete("/:id",isLoggedIn,async (req,res)=>{
let {id}=req.params;
await Listing.findByIdAndDelete(id);
req.flash("success" ,"Listing Deleted");
res.redirect("/listings");
});


module.exports = router;