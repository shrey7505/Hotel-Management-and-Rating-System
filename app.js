if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const mongoose_url="mongodb://127.0.0.1:27017/wanderlust";
// const dbUrl=process.env.ATLAS_URL;


// const Listing=require("./models/listing");
const path=require("path");
const methodoverride=require("method-override");
ejsMate = require("ejs-mate");
// const wrapAsycn=require("./utili/wrapAsync.js");
const expressError=require("./utili/expresserror.js")
// const {listingSchema,reviewschema}=require("./schema.js");
// const Review=require("./models/review");
const listingRouter=require("./routes/listing.js")
const reviewRouter=require("./routes/review.js")
const userRouter=require("./routes/user.js")

const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");

const passport=require("passport")
const localStatargy=require("passport-local")
const User=require("./models/user.js")








app.use(express.json()); 
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}))
app.use(methodoverride("_method"))
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"public")));



// db connection
main().then(()=>{
    console.log("database is connected...");
}).catch(err=>{
    console.log(err);
})
async function main() {
    await mongoose.connect(mongoose_url);
}

const store=MongoStore.create({
    mongoUrl:mongoose_url,
    crypto: {
        secret: process.env.SECRET
      },
      touchAfter:24*3600,
});
store.on("error", (err) => {
    console.log("error in mongo session store", err);
});

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 1*24*60*60*1000,
        maxAge:1*24*60*60*1000,
        httpOnly:true,
    },
};



//network connection
app.listen(3000,()=>{
    console.log("conection sucsessfull on port number 3000...");
});

// //frist routs
// app.get("/",(req,res)=>{
//     res.send("connection is start properly...");
// })

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStatargy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next(); 
})


app.use("/listings",listingRouter)
app.use("/listings", listingRouter); // Ensure this line exists in app.js

app.use("/listings/:id/reviews",reviewRouter)
app.use("/",userRouter)






app.all("*", (req, res, next) => {
    next(new expressError(404, "Page not found!"));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    const { statuscode = 500, message = "Something went wrong!" } = err;
    // res.status(statuscode).send(message);
    res.render("error.ejs",{err});
});