let express = require("express");
let router = express.Router();
let Cart = require("../models/cart");
let Order = require("../models/order");
let User = require("../models/user");
let Product = require("../models/product");
let Notification = require("../models/notification");
var middleware = require("../middleware/index.js");

let csrf = require("csurf");
// {csrfToken: req.csrfToken()}
let csrfProtection = csrf();
router.use(csrfProtection);


router.get("/", middleware.isLoggedIn, function(req, res) {
    if (!req.session.cart) {
        return res.redirect("/cart");
    }
    var cart = new Cart(req.session.cart);
    res.render("shop/shop-checkout", {products: cart.generateArray(), total: cart.totalPrice, csrfToken: req.csrfToken()});
});


router.post("/", middleware.isLoggedIn, async function(req, res) {
    
    try {
            if (!req.session.cart) {
            return res.redirect("/cart");
        }
        
        let cart = new Cart(req.session.cart);
        let user = await User.find({"isAdmin": true}).exec();
        let newOrder = ({
            user: req.user,
            cart: cart,
            address: req.body.address,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            city: req.body.city,
            contactNumber: req.body.contactNumber,
            paymentMethod: req.body.paymentMethod
        });
        
        let order = await Order.create(newOrder);
        
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
        
        let newNotification = {
            name: req.user.firstName,
            orderId: order._id,
        };
        
        let notification = await Notification.create(newNotification);
        
        user.forEach(function(admin) {
            admin.notifications.push(notification);
            admin.save();
        });
        
        
        //pusher talk
        let Pusher = require('pusher');
        let pusher = new Pusher({
            appId: process.env.PUSHER_APP_ID,
            key: process.env.PUSHER_APP_KEY,
            secret: process.env.PUSHER_APP_SECRET,
            cluster: process.env.PUSHER_APP_CLUSTER
        });

        pusher.trigger('notifications', 'post_updated', notification, req.headers['x-socket-id']);
        
        
        
        req.session.cart = null;
        req.flash('success', 'Your Cart has been succesfully ORDERED');
        res.redirect("/profile/" + req.user._id + "/orders");
        
    } catch(err) {
        console.log(err);
        req.flash("error", "Something went Wrong!");
        res.redirect('back');
    }
});


/*
router.post("/", middleware.isLoggedIn, function(req, res) {
    if (!req.session.cart) {
        return res.redirect("/cart");
    }
    var cart = new Cart(req.session.cart);
    var user = User.find({"isAdmin": true}).exec();
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
    // console.log("=================================================================");
    // console.log(order);
    //  console.log("=================================================================");
    // let newNotification = {
    //     name: req.user.firstName,
    //     orderId: order._id,
    // };
    
    var notification = new Notification({
        name: req.user.firstName,
        orderId: order._id,
    });
     notification.save();
     console.log(user.notifications);
    // user.notifications.push(notification);
    // console.log(notification);
    console.log(user);
    
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