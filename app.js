let express = require("express");
let app = express();
let session = require('express-session');
let bodyParser = require("body-parser");
let passport = require("passport");
let LocalStrategy = require("passport-local");
let mongoose = require("mongoose");
let flash = require("connect-flash");
let methodOverride = require("method-override");
let cookieParser = require('cookie-parser');
let MongoStore = require("connect-mongo")(session);

var User = require("./models/user");
let Cart = require("./models/cart");

//routes example var reviewRoutes = require("./routes/reviews");
let indexRoutes = require("./routes/index");
let shopRoutes = require("./routes/shop");
let cartRoutes = require("./routes/cart");
let checkoutRoutes = require("./routes/checkout");
let reviewRoutes = require("./routes/review");

//========================================
mongoose.set("useFindAndModify", false);
mongoose.connect("mongodb://localhost:27017/ecommerce", { useNewUrlParser: true });
// require('./config/passport');
// mongodb://maui:a12345@ds123783.mlab.com:23783/library //used to connect to onlineDB
// mongoose.connect("mongodb://maui:a12345@ds123783.mlab.com:23783/library", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
// app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');

//====================================================
// Passport Config
//====================================================
app.use(require("express-session")({
    secret: "Hello There",
    resave: false,
    saveUninitialized: false,
    // store: new MongoStore(
    //     { 
    //         mongooseConnection: mongoose.connection, 
    //         touchAfter: 24 * 3600, //24 hours
    //     }
    // ), // stores session in db,
    // cookie: {maxAge: 180 * 60 * 1000} //maxAge sets cookie/session expires in 3 hours (mins * hours * milliseconds)
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.session = req.session;
    res.locals.currentUser = req.user;
    next();
});


/*===================== 
ROUTES 
=====================*/

// app.get("/admin", function(req, res) {
//     res.render("admin/admin");
// });




app.use("/", shopRoutes);
app.use("/admin", indexRoutes);
app.use("/cart", cartRoutes);
app.use("/checkout", checkoutRoutes);
// app.use("/shop-item/:id/reviews", reviewRoutes);
//====================================================
//Ecommerce Server Start
//====================================================

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("E-Commerce App server has started");
})