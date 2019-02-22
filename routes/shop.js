let express = require("express");
let router = express.Router();
let passport = require("passport");
let Product = require("../models/product");
var User = require("../models/user");
var Cart = require("../models/cart");
var Order = require("../models/order");
var Review = require("../models/review");
var middleware = require("../middleware/index.js");

var async =require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
let csrf = require("csurf");
// {csrfToken: req.csrfToken()}
let csrfProtection = csrf();
router.use(csrfProtection);

var sr = require('screenres');



//home route
router.get("/", function(req, res) {
    
     Product.find({}, function(err, prods) {
         
         
        if (err) {
            res.render("shop/shop-index-header-fix");
        } else {
            // var cart = new Cart(req.session.cart);
            res.render("shop/shop-index-header-fix", {prods: prods});
        }
    }); 
    
});


//show register form
router.get("/register", function(req, res) {
    res.render("shop/register", {csrfToken: req.csrfToken()});
});

//hande signup logic
router.post("/register", function(req, res, next) {
    async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
        var newUser = new User({
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        contactNumber: req.body.contactNumber,
        address: req.body.address,
        emailToken: token
        });
        
        User.register(newUser, req.body.password, function(err, user) {
            if (err) {
                console.log(err);
                req.flash('error', 'A user with the given username is already registered');
                return res.render("shop/register", {'error': 'A user with the given username is already registered'});
            }
            done(err, token, user);
        });
    },
    
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'pitsCarAccessories@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'pitsCarAccessories@gmail.com',
        subject: 'Pit\'s Car Accessories Email Validation',
        text: 'Your registration at pitscaraccessories.com requires you to validate your email address\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/register/' + token + '\n\n' 
          
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail to validate your account has been sent to ' + user.email + ' \n\n with further instructions. Be sure to check your Spam Folder');
        done(err, 'done');
      });
    },
    function() {
        res.redirect("/");
    }
    
  ], function(err) {
    if (err) return next(err);
    res.redirect('/shop/register', {csrfToken: req.csrfToken()});
  });
});

//email validate form
router.get('/register/:token', function(req, res) {
    User.findOne({ emailToken: req.params.token}, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('/forgot');
        }
        res.render('shop/emailValidate', {token: req.params.token, csrfToken: req.csrfToken()});
    });
});

//email validate sets account to active
router.post('/register/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ emailToken: req.params.token }, function(err, user) {
        
        user.isActivated = true;
        user.save();
        req.flash('success', 'Your Email has been validated. Please log in');
        res.redirect('/login');
      });
    },
  ], function(err) {
    res.redirect('/');
  });
});

// //hande signup logic original
// router.post("/register", function(req, res) {
//     var newUser = new User({
//         email: req.body.email,
//         password: req.body.password,
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         contactNumber: req.body.contactNumber,
//         address: req.body.address
//     });
//     User.register(newUser, req.body.password, function(err, user) {
//         if (err) {
//             console.log(err);
//             req.flash('error', 'A user with the given username is already registered');
//             return res.render("shop/register");
//         }
//         passport.authenticate("local")(req,res, function() {
//             req.flash('success', 'Successfully made an account');
//             res.redirect("/");
//         });
//     });
// });



//show login form
router.get("/login", function(req, res) {
    res.render("shop/login", {csrfToken: req.csrfToken()});
});


router.post("/login/login", middleware.sessionMW, function(req, res, next) {
    User.findOne({email: req.body.email}, function(err, user) {
        if (err) {
            console.log(err);
        }
        
        if (!user) {
            req.flash("error", "That account does not exist");
            res.redirect("/login");
        } else {
            passport.authenticate("local", function(err, user, info) {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    res.redirect("/login");
                }
                
                req.logIn(user, function(err) {
                    if (err) {
                        req.flash("error", err.message);
                        return next(err);
                    } else if (user.isAdmin === true) {
                        res.redirect("/admin");
                    } else if (user.isAdmin === false && user.isActivated === true) {
                        res.redirect("/product-list");
                    } else {
                        if (user.isAdmin === false && user.isActivated === false) {
                            req.flash("error", "Your Email has not been validated. Please check your Email");
                            res.redirect("/login");
                        } else {
                            req.flash("error", "Wrong Email or Password. Try again");
                            res.redirect("/login");
                        }
                    }
                });
            })(req, res, next);
        }
    });
    
});

// //handle sign in logic original
// router.post("/login/login", middleware.sessionMW, passport.authenticate("local", 
// {
//     failureFlash: 'Invalid username or password.',
//     failureRedirect: "/login",
    
// }),function(req, res) {
//     if (req.user.isAdmin === true) {
//         res.redirect("/admin");
//     }
//     if (req.user.isAdmin === false && req.user.isActivated === true) {
//         res.redirect("/product-list");
//     }
//     if (req.user.isAdmin === false && req.user.isActivated === false) {
//         req.flash("error", "Your Email has not been validated. Please check your Email");
//         req.logout();
//         res.redirect("/login");
//     } 
// });

//logout route
router.get("/logout", function(req, res) {
    req.session.save();
    req.logout();
    req.session.cart = null
    res.redirect("/");
    // req.session.save();
    // req.session.cart = null
    
});


//route for user profile
router.get("/profile/:id", middleware.isLoggedIn, middleware.checkProfileOwnership, function(req, res) {
    User.findById(req.params.id, function(err, foundUser) {
        if (err) {
            console.log(err);
        } else {
             res.render('shop/shop-account', {foundUser: foundUser, message: req.flash("error")});
        }
    });
    // res.render('shop/shop-account');
});

//profile edit page
router.get("/profile/:id/edit", middleware.isLoggedIn,  middleware.checkProfileOwnership, function(req, res) {
    User.findById(req.params.id, function(err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            // console.log(foundUser)
            res.render('shop/user-update', {foundUser: foundUser});
        }
    });
});

//profile update page
router.put("/profile/:id", middleware.isLoggedIn,  middleware.checkProfileOwnership, function(req, res) {
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updatedUser) {
        if (err) {
            console.log(err);
        } else {
           res.redirect("/profile/" + req.params.id);
        }
    });
});

//profile orders page
router.get("/profile/:id/orders", middleware.isLoggedIn, function(req, res) {
    Order.find({user: req.user}, function(err, orders) {
        if (err) {
            return res.write('Error!');
        }
        
        var cart;
        orders.forEach(function(order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
       
        res.render('shop/shop-account-orders', {orders: orders.reverse()});
    });
});

//show page for individual item
router.get("/shop-item/:id", function(req, res) {
    Product.findById(req.params.id).populate("reviews").exec(function(err, foundItem) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("shop/shop-item", {foundItem: foundItem, message: req.flash("error"), csrfToken: req.csrfToken()});
        }
    });
});


// for searching for more than one parameter = Campground.find({$or: [{name: regex,}, {location: regex}, {"author.username":regex}]}, function(err, allCampgrounds){
router.get("/product-list", function(req, res) {
    var perPage = 100;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    var noMatch = null;
    
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Product.find().or([{name: regex}, {brand: regex}, {type: regex}]).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, prods) {
           Product.countDocuments({name: regex}).exec(function(err, count) {
              if (err) {
                  console.log(err);
                  res.redirect("back");
              } else {
                  if (prods.length < 1) {
                      noMatch = "No product could match that query, please try again";
                      req.flash("error", noMatch);
                  }
                  res.render("shop/shop-product-list", {prods: prods, current: pageNumber, pages: Math.ceil(count / perPage), noMatch: noMatch, search: req.query.search});
              }
           });
        });
    } else {
        Product.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function(err, prods) {
           Product.countDocuments().exec(function(err, count) {
               if (err) {
                   console.log(err);
               } else {
                   res.render("shop/shop-product-list", {prods: prods, current: pageNumber, pages: Math.ceil(count / perPage), noMatch: noMatch, search: false, sr: sr});
               }
           }) ;
        });
    }
});




//
//product type list
// router.get("/product-list-steeringWheel", function(req, res) {
//     Product.find({"type": "Steering Wheel"}, function(err, prods) {
//         if (err) {
//             res.render("shop/shop-product-list", {message: req.flash("error")});
//         } else {
            
//             // var cart = new Cart(req.session.cart);
//             res.render("shop/shop-product-list", {prods: prods, message: req.flash("success") });
//         }
//     }); 
// });

router.get("/product-list-:type", function(req, res) {
    Product.find({"type": req.params.type}, function(err, prods) {
        if (err) {
            res.render("shop/shop-product-list", {message: req.flash("error")});
        } else {
            // var cart = new Cart(req.session.cart);
            res.render("shop/shop-product-list", {prods: prods, message: req.flash("error") });
        }
    }); 
});

//===============================================
//review routes
//================================================


//review create route
router.post("/shop-item/:id/reviews" , middleware.isLoggedIn, function(req, res) {
     //look up product
    //create new review
    //connect new review to product
    //redirect back to product show page

    Product.findById(req.params.id, function(err, product) {
      if (err) {
          console.log(err);
          res.redirect("back");
      } else {
          Review.create(req.body.review, function(err, review) {
              if (err) {
                  console.log(err);
              } else {
                  
                  //add user and user Id to review
                  review.author.id = req.user._id;
                  review.author.name = req.user.firstName + " " + req.user.lastName;
                  review.save();
                  product.reviews.push(review);
                  product.save();
                  res.redirect("/shop-item/"  + product._id);
              }
          });
      }
    });
});

//review update route
router.put("/shop-item/:id/reviews/:review_id", middleware.checkReviewOwnership, function(req, res) {
    Review.findById(req.params.review_id, req.body.review, function(err, updatedReview) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("back");
        }
    });
});

//review destroy route
router.delete("/shop-item/:id/reviews/:review_id", middleware.checkReviewOwnership, function(req, res) {
    Review.findByIdAndRemove(req.params.review_id, function(err) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("back");
        }
    });
});


//===============================================
//forgot password routes
//================================================

router.get("/forgot", function(req, res) {
    res.render("shop/forgotPS", {message: req.flash("error"), csrfToken: req.csrfToken()});
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    //don't need this for signing up logic start don't need an expiring token as well
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
     //don't need this for signing up logic end
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'pitsCarAccessories@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'pitsCarAccessories@gmail.com',
        subject: 'Pit\'s Car Accessories Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions. Be sure to check your Spam Folder');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

// might not need this one too start
router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('shop/resetPS', {token: req.params.token, csrfToken: req.csrfToken()});
  });
});
// might not need this one too start

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          });
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'pitsCarAccessories@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'pitsCarAccessories@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' at Pit\' Car Accessories\' website has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });
});


//function for protection from regex attacks
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
module.exports = router;