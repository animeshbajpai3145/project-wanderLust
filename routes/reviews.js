const express = require('express');
const router = express.Router({mergeParams:true});
const Review = require("../models/reviews.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const{validateReview,isLoggedIn,isAuthor}  = require("../middleware.js");
const ejsMate= require("ejs-mate");
const mongoose  = require("mongoose");
const  reviewController = require("../controllers/review.js");


// add a review
router.route("/").post(isLoggedIn,validateReview ,wrapAsync(reviewController.createReview));


// Delete a review
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.destroyReview));
















module.exports = router;