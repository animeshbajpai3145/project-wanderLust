const express = require('express');
const router = express.Router({mergeParams:true});
const Review = require("../models/reviews.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const{validateReview,isLoggedIn,isAuthor}  = require("../middleware.js");
// extra
const ejsMate= require("ejs-mate");
const mongoose  = require("mongoose");
const  reviewController = require(" ")
// remove later








// add a review
router.post("/",isLoggedIn,validateReview ,wrapAsync());


// Delete a review
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(async (req,res)=>{
let {id,reviewId}= req.params;
await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
await Review.findByIdAndDelete(reviewId);
req.flash("success" ," Review Deleted!");

res.redirect(`/listings/${id}`);
}));
















module.exports = router;