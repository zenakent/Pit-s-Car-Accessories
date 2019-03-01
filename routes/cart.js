let express = require("express");
let router = express.Router();
let Product = require("../models/product");
let Cart = require("../models/cart");


//show cart page
router.get("/", function(req, res) {
    if (!req.session.cart) {
        return res.render('shop/shop-shopping-cart-null')
    }
    var cart = new Cart(req.session.cart);
    res.render('shop/shop-shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

//route to add item to cart
router.get('/add-to-cart/:id', function(req, res) {
   let productId = req.params.id;
   let cart = new Cart(req.session.cart ? req.session.cart : {});
   
   Product.findById(productId, function(err, product) {
       if (err) {
           res.redirect("/");
       } else {
            if (product.quantity <= 0) {
                req.flash("error", "Sorry, This product is not available");
                res.redirect("back");
            } else {
               cart.add(product, product._id);
               req.session.cart = cart;

              res.redirect("back");
            }
        }
   });
});

router.get('/raise/:id', function(req, res) {
   let productId = req.params.id;
   let cart = new Cart(req.session.cart ? req.session.cart : {});
   
   cart.raiseByOne(productId);
   req.session.cart = cart;
   res.redirect("back");
});

router.get('/reduce/:id', function(req, res) {
   let productId = req.params.id;
   let cart = new Cart(req.session.cart ? req.session.cart : {});
   
   cart.reduceByOne(productId);
   req.session.cart = cart;
   res.redirect("back");
});

router.get('/remove/:id', function(req, res) {
   let productId = req.params.id;
   let cart = new Cart(req.session.cart ? req.session.cart : {});
   
   cart.removeItem(productId);
   req.session.cart = cart;
   res.redirect("back");
});

router.delete("/add-to-cart/:id", function(req, res) {
    Product.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/");
        }
    })
});

router.get("/api", function(req, res) {
    let cart = new Cart(req.session.cart ? req.session.cart : {});
    
    res.json(req.session.cart.items);
});

module.exports = router;