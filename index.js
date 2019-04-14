var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Comment = require("./models/comment");
var Mountain = require("./models/mountains");
var flash = require("connect-flash");
var methodoverride = require("method-override");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var seedDB = require("./seeds");

// Requiring all routes
var commentRoutes = require("./routes/comments"),
    mountainRoutes = require("./routes/mountains"),
    authRoutes = require("./routes/auth");


// seedDB(); // seed the database

// transfer to MongoDB Atlas
mongoose.connect("mongodb+srv://argirowski:xy-hW6NdAN9KAx3@cluser1-6fuoe.mongodb.net/mountain_app?retryWrites=true");

// mlab database
// mongoose.connect("mongodb://argirowski:123456bz@ds149885.mlab.com:49885/mountain-app", { useNewUrlParser: true });

// local database
// mongoose.connect("mongodb://localhost/mountain_app", { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodoverride("_method"));
app.use(flash());

// Passport Configuration

app.use(
  require("express-session")({
    secret: "Scaramouch, Scaramouch will you do the Fandango",
    resave: false,
    saveUnitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware for passing currentUser to all routes
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  // for the pop up messages
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// Mountain.create(
//     {
//         name: "Big Mountain",
//         image:
//             "https://www.touropia.com/gfx/d/mountains-of-the-world/monte_fitz_roy.jpg?v=1",
//             description: "That's one big mountain. Meadows, snow and everything you need."
//     },
//     function (err, mountain) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log("Newly Created Mountain");
//             console.log(mountain);
//         }
//     }
// );

// Tells the app to use the route files that are set up above
app.use(authRoutes);

// The same case with "/mountains", we are shortening the routes in the comments.js file
app.use("/mountains/:id/comments", commentRoutes);

// By adding "/mountains" we are shortening the routes in the campgrounds.js file 
// ex. from "/mountains" to "/"
app.use("/mountains", mountainRoutes);

app.listen(process.env.PORT || 1122, process.env.IP, function() {
  console.log("Server Started");
});
