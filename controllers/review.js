const Listing=require("../models/listing.js")
const Review=require("../models/review.js")

module.exports.reviewAdd=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newreview= new Review(req.body.review);
    listing.reviews.push(newreview);
    newreview.author=req.user._id;
    
    await newreview.save();
    await listing.save();
    req.flash("success","New review created...")
    res.redirect(`/listings/${listing._id}`);
    

    console.log("Received Data:", req.body); // Debugging
}

module.exports.reviewDelete=async (req, res) => {
    let { id, reviewId } = req.params;
    
    // Remove the review reference from Listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the actual review from the database
    await Review.findByIdAndDelete(reviewId);
    req.flash("success"," review deleted...")

    res.redirect(`/listings/${id}`);
}