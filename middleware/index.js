let session = require('express-session');
let mongoose = require("mongoose");
let MongoStore = require("connect-mongo")(session);
var User = require("../models/user");
var Review = require("../models/review");


//all the midleware goes here
var middlewareObj = {};

middlewareObj.sessionMW = session({
    secret: "Kenobi: Hello There! General Grievous: General Kenobi! ",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore(
        { 
            mongooseConnection: mongoose.connection, 
            //  url: 'mongodb+srv://pit:pit1@cluster0-hrlea.mongodb.net/test?retryWrites=true'
            // touchAfter: 24 * 3600, //24 hours
        }
    ), // stores session in db,
    cookie: {maxAge: 180 * 60 * 1000} //maxAge sets cookie/session expires in 3 hours (mins * hours * milliseconds)
});

//middleware to see if logged in
middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash("error", "Please Login First!");
        res.redirect("/login");
    }
};

middlewareObj.isAdmin = function(req, res, next) {
    if (req.user.isAdmin) {
        return next();
    } else {
        req.flash("error", "You are not Admin!");
        res.redirect("/");
    }
};

middlewareObj.isSuperAdmin = function(req, res, next) {
    if (req.user.isSuperAdmin) {
        return next();
    } else {
        req.flash("error", "You are not SuperAdmin!");
        res.redirect("/");
    }
};

middlewareObj.isActivated = function(req, res, next) {
    if (req.user.isActivated) {
        return next();
    } else {
        req.flash("error", "Please Validate Your Email");
        res.redirect("/login");
    }
};

middlewareObj.checkProfileOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        
        User.findById(req.params.id, function (err, foundUser) {
            
            if (err || !foundUser) {
                req.flash("error", "That user does not exit!");
            } else if (foundUser._id.equals(req.params.id) || req.user.isAdmin) {
                // req.user = foundUser;
                next();
            } else {
                req.flash("error", "You do not have permission to do that");
                res.redirect("back");
            }
        });
    }
};

middlewareObj.checkReviewOwnership = function (req, res, next) {
    if (req.isAuthenticated()){
        Review.findById(req.params.review_id, function(err, foundReview){
            if(err || !foundReview){
                req.flash('error', 'Sorry, that review does not exist!');
                res.redirect("back");
            }  else {
                if(foundReview.author.id.equals(req.user._id) || req.user.isAdmin ) {
                    req.review = foundReview; //this line
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

module.exports = middlewareObj;