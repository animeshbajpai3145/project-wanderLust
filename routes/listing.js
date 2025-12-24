const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");





//  all Listings
router.get("/", wrapAsync(listingController.index));

// new route: form to create
router.get("/new", isLoggedIn, listingController.renderNewForm);
//  new route: Adding listings
router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createNewListing));
// show route 
router.get("/:id", wrapAsync(listingController.showListing));

// edit route: form to edit  
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.renderEditForm));

// edit route : udpate the data 
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

// delete route 
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


module.exports = router;