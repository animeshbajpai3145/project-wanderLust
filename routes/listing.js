const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner, validateListing } = require("../middleware.js");






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
router.post("/",isLoggedIn,validateListing, wrapAsync( async (req,res,next)=>{
  
console.log(req.body.listing);
const newListing = new Listing(req.body.listing);
newListing.owner  = req.user;

await newListing.save();
 req.flash("success","New Listing Created");
  res.redirect("/listings");
  

}));
// show route 
router.get("/:id", async(req,res)=>{
   let userId = req.params.id;
   let listing =  await Listing.findById(userId).populate({path:"reviews",populate:{
      path:"author"},
   }).populate("owner");
   if(!listing){
    req.flash("error","Listing you requested for does not exist!");
     return res.redirect("/listings");
   }
   console.log(listing);
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
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(async (req,res)=>{
   if(!req.body.listing){
    throw new ExpressError(400,"send valid data for listing ")
   }
   let{id} = req.params;
  await  Listing.findByIdAndUpdate(id,{...req.body.listing});
       req.flash("success" ,"Listing updated!");

   res.redirect(`/listings/${id}`);
}));

// delete route 
router.delete("/:id",isLoggedIn,isOwner,async (req,res)=>{
let {id}=req.params;
await Listing.findByIdAndDelete(id);
req.flash("success" ,"Listing Deleted");
res.redirect("/listings");
});


module.exports = router;