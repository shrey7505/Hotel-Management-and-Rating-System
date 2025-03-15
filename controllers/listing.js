const Listing=require("../models/listing.js")

module.exports.index=async (req,res)=>{
        const alllisting= await Listing.find({});
    //   console.log(alllisting)
        res.render("./listing/index.ejs",{alllisting});
    }

module.exports.renderNewForm=(req, res) => {
      res.render("listing/new.ejs"); // Ensure this file exists
}

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id)
    .populate({path:"reviews",populate:{path:"author"}})
    .populate("owner");
    if(!listing){
        req.flash("error"," Listing you requested for does not exist!... ")
        res.redirect("/listings")

    }
    console.log(listing)
    res.render("./listing/show.ejs",{listing});
}

module.exports.postListing=async(req,res)=>{
    let url=req.file.path;
    let filename=req.file.filename
    console.log(url,"...",filename)
    let newListing = new Listing(req.body.listing);
    newListing.image = {url,filename};
    newListing.owner = req.user._id;
    
    await newListing.save();
    req.flash("success","New listing created...")
    res.redirect("/listings"); 
}

module.exports.editListing=async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error"," Listing you requested for does not exist!... ")
        res.redirect("/listings")

    }
   let originalImgURL= listing.image.url;
   originalImgURL.replace("/upload","/upload/h_100,w_50")
    res.render("./listing/edit.ejs",{listing,originalImgURL})
}

module.exports.updateListing=async(req,res)=>{
        let {id}=req.params;
        let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

        if(typeof req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename
        listing.image={url,filename}
        await listing.save();
        } 
        req.flash("success"," listing updeted...")

        res.redirect(`/listings/${id}`);
    }

    module.exports.deletelisting=async(req,res)=>{
        let {id}=req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("success"," listing deleted...")

        res.redirect("/listings");
    }