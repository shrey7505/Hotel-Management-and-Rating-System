const User=require("../models/user.js")

module.exports.userSignup=(req,res)=>{
    res.render("user/signup.ejs")
}

module.exports.userSignupPost=async(req,res)=>{
   try {
    let {username,email,password}=req.body;
    const newUser=new User({email,username})
    const registeredUser=await User.register(newUser,password)
    console.log(registeredUser)
    req.login(registeredUser,(err)=>{                   
        if(err){
            next(err);
        }
        else{
            req.flash("success","welcome to my website...")
            res.redirect("/listings")
        }
    })
    
   } catch (error) {
    req.flash("error",error.message)
    res.redirect("/signup")
   }
}

module.exports.userLogin=(req,res)=>{
    res.render("user/login.ejs")
}

module.exports.userLoginPost=(req,res)=>{
    req.flash("success","welcome back in Wonderlust!...")
    let RedirectUrl=res.locals.RedirectUrl || "/listings"
    res.redirect(RedirectUrl)
    }

module.exports.userLogout=(req,res,next)=>{
    req.logOut((err)=>{
       if(err)
        {
            next(err)
        } 
        else{
            req.flash("success","you are logged out!...")
            res.redirect("/listings")
        }
    })
}