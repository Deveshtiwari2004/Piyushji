const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const passport = require("passport");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage});


router
.route("/")
 .get(wrapAsync(listingController.index))
 .post(
      isLoggedIn,
        validateListing,
        upload.single('listing[image]'),
        wrapAsync (listingController.createListing));

 //New Route
    router.get("/new", isLoggedIn, listingController.renderNewForm);

    //show route

    router
   .route("/:id")
  .get(
      wrapAsync(listingController.showlisting))
    .put(
            isLoggedIn,
            isOwner,
             upload.single('listing[image]'),
            validateListing, 
            wrapAsync (listingController.updateListing));
   
          //Edit Route
          router.get("/:id/edit",isLoggedIn,
             wrapAsync (listingController.renderEditForm));

        router.delete("/:id",isLoggedIn,wrapAsync (listingController.destroyListing));

        module.exports = router;