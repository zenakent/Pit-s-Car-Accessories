let express = require("express");
let router = express.Router();
let passport = require("passport");
let Product = require("../models/product");
var User = require("../models/user");
var Cart = require("../models/cart");
var Order = require("../models/order");
var Review = require("../models/review");
var middleware = require("../middleware/index.js");
var momentTimezone = require('moment-timezone');
// let csrf = require("csurf");
// {csrfToken: req.csrfToken()}
// let csrfProtection = csrf();
// router.use(csrfProtection);



//home route
router.get("/", function(req, res) {
     Product.find({}, function(err, prods) {
        if (err) {
            res.render("shop/shop-index-header-fix");
        } else {
            // var cart = new Cart(req.session.cart);
            res.render("shop/shop-index-header-fix", {prods: prods });
        }
    }); 
    
});


//show register form
router.get("/register", function(req, res) {
    res.render("shop/register");
});

//hande signup logic
router.post("/register", function(req, res) {
    var newUser = new User({
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        contactNumber: req.body.contactNumber,
        address: req.body.address
    });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("shop/register");
        }
        passport.authenticate("local")(req,res, function() {
            res.redirect("/");
        });
    });
});



//show login form
router.get("/login", function(req, res) {
    res.render("shop/login");
});

//handle sign in logic
router.post("/login", middleware.sessionMW, passport.authenticate("local", 
{
    successRedirect: "/",
    failureRedirect: "/login",
}),function(req, res) {
    // req.session.reload(function(err) { 
    //     res.redirect("/");
    // });
});

//logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.session.save();
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});

router.get("/profile/:id", middleware.isLoggedIn, middleware.checkProfileOwnership, function(req, res) {
    User.findById(req.params.id, function(err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            // console.log(foundUser);
            res.render('shop/shop-account', {foundUser: foundUser});
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

// router.get("/profile/orders", function(req, res) {
//     Order.find({user: req.user}, function(err, orders) {
//         if (err) {
//             return res.write('Error!');
//         }
        
//         var cart;
//         orders.forEach(function(order) {
//             cart = new Cart(order.cart);
//             order.items = cart.generateArray();
//         });
       
//         res.render('shop/shop-account-orders', {orders: orders});
//     });
// });


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
       
        res.render('shop/shop-account-orders', {orders: orders});
    });
});

//show page for individual item
router.get("/shop-item/:id", function(req, res) {
    Product.findById(req.params.id).populate("reviews").exec(function(err, foundItem) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("shop/shop-item", {foundItem: foundItem, momentTimezone: momentTimezone});
        }
    });
});

/* original show page for items
//show page for individual item
router.get("/shop-item/:id", function(req, res) {
    Product.findById(req.params.id, function(err, foundItem) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("shop/shop-item", {foundItem: foundItem});
        }
    });
});
*/

router.get("/product-list", function(req, res) {
    Product.find({}, function(err, prods) {
        if (err) {
            res.render("shop/shop-product-list");
        } else {
            // var cart = new Cart(req.session.cart);
            res.render("shop/shop-product-list", {prods: prods });
        }
    }); 
});

router.get("/product-list-steeringWheel", function(req, res) {
    Product.find({"type": "Steering Wheel"}, function(err, prods) {
        if (err) {
            res.render("shop/shop-product-list");
        } else {
            // var cart = new Cart(req.session.cart);
            res.render("shop/shop-product-list", {prods: prods });
        }
    }); 
});

router.get("/product-list-alarm", function(req, res) {
    Product.find({"type": "Alarm"}, function(err, prods) {
        if (err) {
            res.render("shop/shop-product-list");
        } else {
            // var cart = new Cart(req.session.cart);
            res.render("shop/shop-product-list", {prods: prods });
        }
    }); 
});

router.get("/product-list-strutBar", function(req, res) {
    Product.find({"type": "Strut Bar"}, function(err, prods) {
        if (err) {
            res.render("shop/shop-product-list");
        } else {
            // var cart = new Cart(req.session.cart);
            res.render("shop/shop-product-list", {prods: prods });
        }
    }); 
});

router.get("/product-list-airIntake", function(req, res) {
    Product.find({"type": "Air Intake"}, function(err, prods) {
        if (err) {
            res.render("shop/shop-product-list");
        } else {
            // var cart = new Cart(req.session.cart);
            res.render("shop/shop-product-list", {prods: prods });
        }
    }); 
});

router.get("/product-list-plateAccessories", function(req, res) {
    Product.find({"type": "Plate Accessories"}, function(err, prods) {
        if (err) {
            res.render("shop/shop-product-list");
        } else {
            // var cart = new Cart(req.session.cart);
            res.render("shop/shop-product-list", {prods: prods });
        }
    }); 
});


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
                //   console.log(product);
                  product.reviews.push(review);
                  product.save();
                  res.redirect("/shop-item/"  + product._id);
              }
          });
      }
    });
});

//review update route
router.put("/shop-item/:id/reviews/:review_id", function(req, res) {
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
router.delete("/shop-item/:id/reviews/:review_id", function(req, res) {
    Review.findByIdAndRemove(req.params.review_id, function(err) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("back");
        }
    })
});



module.exports = router;