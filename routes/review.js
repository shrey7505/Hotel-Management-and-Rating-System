const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsycn=require("../utili/wrapAsync.js");
const {validateReview, islogin,isAuthor}=require("../midelware.js");
const { reviewAdd, reviewDelete } = require("../controllers/review.js");


//review route
router.post("/",islogin,validateReview,wrapAsycn(reviewAdd));

//delete review route
router.delete("/:reviewId",islogin,isAuthor, wrapAsycn(reviewDelete));

module.exports=router;