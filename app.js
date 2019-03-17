require('dotenv').config();

let express = require("express");
let app = express();
let session = require('express-session');
let bodyParser = require("body-parser");
let passport = require("passport");
let LocalStrategy = require("passport-local");
let mongoose = require("mongoose");
let flash = require("connect-flash");
let methodOverride = require("method-override");
// let cookieParser = require('cookie-parser');
let MongoStore = require("connect-mongo")(session);
var device = require('express-device');

var User = require("./models/user");
let Cart = require("./models/cart");
let Order = require("./models/order");


//Facebook Strategy
var FacebookStrategy = require('passport-facebook').Strategy;
var facebookAuth = require("./config/facebook.js")

//routes example var reviewRoutes = require("./routes/reviews");
let salesRoutes = require("./routes/sales");
let indexRoutes = require("./routes/index");
let shopRoutes = require("./routes/shop");
let cartRoutes = require("./routes/cart");
let checkoutRoutes = require("./routes/checkout");

// let reviewRoutes = require("./routes/review");

//========================================
mongoose.set("useFindAndModify", false);
// mongoose.connect("mongodb://localhost:27017/ecommerce", { useNewUrlParser: true }); //use for local mongodb
// require('./config/passport');
// mongodb://maui:a12345@ds123783.mlab.com:23783/library //used to connect to onlineDB
// mongoose.connect("mongodb://maui:a12345@ds123783.mlab.com:23783/library", { useNewUrlParser: true });
mongoose.connect('mongodb+srv://pit:pit1@cluster0-hrlea.mongodb.net/test?retryWrites=true', {dbName: 'ecommerce', useNewUrlParser: true}); // this is how you connect to mongodb atlas
// mongodb+srv://pit:<PASSWORD>@cluster0-hrlea.mongodb.net/test?retryWrites=true
app.use(bodyParser.urlencoded({extended: true}));
// app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');

app.use(device.capture());

device.enableDeviceHelpers(app);
device.enableViewRouting(app);

//====================================================
// Passport Config
//====================================================
app.use(require("express-session")({
    secret: "Hello There",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore(
        { 
            mongooseConnection: mongoose.connection, 
            touchAfter: 24 * 3600, //24 hours
        }
    ), // stores session in db,
    cookie: {
        maxAge: 180 * 60 * 1000,
        cookieconsent_status: {type: Boolean, default: false}
        } //maxAge sets cookie/session expires in 3 hours (mins * hours * milliseconds)
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new FacebookStrategy({
    clientID: facebookAuth.facebookAuth.clientID,
    clientSecret: facebookAuth.facebookAuth.clientSecret,
    callbackURL: facebookAuth.facebookAuth.callbackURL,
    // passReqToCallback : true,
    profileFields: ['emails', 'address', 'displayName', 'name'] //This
  },
  function(accessToken, refreshToken, profile, done) {
    // User.findOrCreate(..., function(err, user) {
    //   if (err) { return done(err); }
    //   done(null, user);
    // });
    process.nextTick(function() {
        User.findOne({'facebook.id': profile.id}, function(err, user) {
            // console.log(user);
            if (err) {
                return done(err);
            }
            if (user) {
                return done(null, user);
            } else {
               
                var newUser = new User();
                
                // console.log(newUser);
                newUser.email = profile.emails[0].value;
                newUser.firstName = profile.name.givenName;
                newUser.lastName = profile.name.familyName;
                newUser.facebook.id = profile.id;
                newUser.facebook.token = accessToken;
                newUser.facebook.firstName = profile.name.givenName;
                newUser.facebook.lastName = profile.name.familyName;
                newUser.facebook.email = profile.emails[0].value;
                
                newUser.save(function(err) {
                    if(err) {
                        console.log(err);
                    }
                    done(null, newUser);
                });
            }
        });
    });
  }
));

passport.use(User.createStrategy());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
    
app.use(async function(req, res, next) {
    res.locals.session = req.session;
    res.locals.currentUser = req.user;
    
    
    if (req.user) {
        if (req.user.isAdmin == true) {
            try {
                let user = await User.find({"isAdmin": true}).populate('notifications', null, {isRead: false}).exec();
                // console.log(user);
                
                user.forEach(function(admin) {
                    res.locals.notifications = admin.notifications;
                });
                
                let order = await Order.find({"orderFulfilled": false});
                res.locals.ordersAll = order;
                
            } catch(err) {
                console.log(err);
            }
        }
    }
    
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
    
    next();
});


/*===================== 
ROUTES 
=====================*/

app.use("/", shopRoutes);
app.use("/sales", salesRoutes);
app.use("/admin", indexRoutes);
app.use("/cart", cartRoutes);
app.use("/checkout", checkoutRoutes);

//====================================================
//Ecommerce Server Start
//====================================================

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("E-Commerce App server has started");
})

