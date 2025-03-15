const Listing=require("./models/listing.js")
const expressError=require("./utili/expresserror.js")
    const {listingSchema,reviewschema}=require("./schema.js");
const Review = require("./models/review.js");

module.exports.islogin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.RedirectUrl=req.originalUrl;
        req.flash("error","you must be login in website for perform this task...")
        res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.RedirectUrl){
        res.locals.RedirectUrl=req.session.RedirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you does not have permission to perform this task")
        return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports.validateLIsting=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
    throw new expressError(400,errmsg);
    }else{
        next();
    }
};

module.exports.validateReview=(req,res,next)=>{
    let{error}=reviewschema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
    throw new expressError(400,errmsg);
    }else{
        next();
    }
};

module.exports.isAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You do not have permission to perform this task.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}