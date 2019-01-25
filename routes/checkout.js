let express = require("express");
let router = express.Router();
let Cart = require("../models/cart");
let Order = require("../models/order");
let Product = require("../models/product");
var middleware = require("../middleware/index.js");


router.get("/", middleware.isLoggedIn, function(req, res) {
    if (!req.session.cart) {
        return res.redirect("/cart");
    }
    var cart = new Cart(req.session.cart);
    res.render("shop/shop-checkout", {products: cart.generateArray(), total: cart.totalPrice});
});


router.post("/", middleware.isLoggedIn, function(req, res) {
    if (!req.session.cart) {
        return res.redirect("/cart");
    }
    var cart = new Cart(req.session.cart);
    
    var order = new Order({
        user: req.user,
        cart: cart,
        address: req.body.address,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        city: req.body.city,
        contactNumber: req.body.contactNumber,
        paymentMethod: req.body.paymentMethod
    });
    
    var arr = [];
    for (var id in cart.items) {
        arr.push(cart.items[id]);
    }
    
    arr.forEach(function(quant) {
        Product.findById(quant.item._id, function(err, prod) {
            if (err) {
                console.log(err);
            } else {
                if (prod.quantity < 1) {
                    res.redirect("back");
                } else {
                    prod.quantity = prod.quantity - quant.qty;
                    prod.save();
                }
            }
        });
    });
    
    order.save(function(err, result) {
        if (err) {
            console.log(err);
        } else {
            
            req.session.cart = null;
            res.redirect("/");
        }
    });
});

/*
router.post("/", function(req, res) {
    if (!req.session.cart) {
        return res.redirect("/cart");
    }
    var cart = new Cart(req.session.cart);
    
    var order = new Order({
        user: req.user,
        cart: cart,
        address: req.body.address,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        city: req.body.city,
        contactNumber: req.body.contactNumber,
        paymentMethod: req.body.paymentMethod
    });
    
    var arr = [];
    for (var id in cart.items) {
        arr.push(cart.items[id]);
    }
    
    arr.forEach(function(quant) {
        // console.log(quant.item.name);
        quant.item.quantity = quant.item.quantity - quant.qty;
        // console.log(quant.item.quantity);
    });
    // console.log(arr.qty);
    
    // arr.item.quantity = arr.item.quantity - arr.qty;
    // console.log(arr.item.quantity)
    order.save(function(err, result) {
        if (err) {
            console.log(err);
        } else {
            
            req.session.cart = null;
            res.redirect("/");
        }
    });
});
*/


module.exports = router;