const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");
module.exports.createReview = async(req,res)=>{
  let listing = await Listing.findById(req.params.id)
  let newReview = new Review(
     req.body.review );
     newReview.author= req.user._id;
     listing.reviews.push(newReview);
     await newReview.save();
     await listing.save();
     console.log("new Review saved");
     req.flash("success" ,"New Review Created!");

     
     res.redirect(`/listings/${listing._id}`);
};