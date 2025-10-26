if (process.env.NODE_ENV != "production"){
require('dotenv').config();
}
const express = require("express");
const app = express();                                                                                                                                                                                                                             
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const user = require("./routes/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/Wonderlust";
const dbUrl = process.env.ATLASDB_URL;



async function main() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(dbUrl, { serverSelectionTimeoutMS: 10000 }); // 10 sec timeout
  console.log("✅ MongoDB connected successfully!");
}

main().catch(err => console.error("❌ MongoDB connection failed:", err));


app.set("view engine", "ejs");
app.set("views", path.join (__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get ("/", (req, res) => {
   res.send("hi, i am root");


});

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret:  process.env.SECRET,
  },
  touchAfter: 24*3600,
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now()+ 7 *24*60*60*1000,
    maxAge: 7 * 24 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=> {
  res.locals.success =req.flash("success");
  res.locals.error= req.flash("error");
  res.locals.curUser = req.user;
  next();
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", user);

// app.get( "/demouser", async(req,res) => {
//   let fakeuser = new User({
//     email:"studend@gmail.com",
//     username: "delta-student"
//   });

//   let registeredUser = await User.register(fakeuser,"helloworld");
//   res.send(registeredUser);
// })







 
// app.get("/testListing", async(req,res) => {
//     let sampleListing = new Listing ({
    
//     title: "My new villa",
//     description:"By the beach",
//     price: 1200,
//     location: "Calamgute, Goa",
//     country: "India",
//  });

//  await sampleListing.save();
//  console.log("sample was saved");
//  res.send("successful testing");

// });


app.use((err,req,res,next) => {
    let {statusCode=500, message="something went wrong"} = err;
    res.status(statusCode).send(message);

});
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});
// Central error handler
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong!" } = err;
res.render("error.ejs",{message});
  //   res.status(status).send(message);
});


app.listen(8080, () => {
    console.log("server is listening to port 8080");
});
