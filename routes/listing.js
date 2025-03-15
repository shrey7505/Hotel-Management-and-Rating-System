const express = require("express");
const router = express.Router();
const wrapAsycn = require("../utili/wrapAsync.js");
const { islogin, isOwner, validateLIsting } = require("../midelware.js");

const {storage}=require("../cloudConfig.js")
const multer  = require('multer')

const upload = multer({ storage })

const {
  index,
  renderNewForm,
  showListing,
  postListing,
  editListing,
  updateListing,
  deletelisting,
} = require("../controllers/listing.js");

router
  .route("/")
  .get(wrapAsycn(index)) 
  .post(islogin
    // ,validateLIsting
    ,upload.single("listing[image]"), wrapAsycn(postListing));
 

  
//new rout
router.get("/new", islogin, renderNewForm);

router
  .route("/:id")
  .get(wrapAsycn(showListing))
  .put(islogin, isOwner,upload.single("listing[image]"), validateLIsting, wrapAsycn(updateListing))
  .delete(islogin, isOwner, wrapAsycn(deletelisting));

//edit route
router.get("/:id/edit", islogin, isOwner, wrapAsycn(editListing));

module.exports = router;
