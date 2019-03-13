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
    if (req.user.shippingAddress.length <= 0) {
        req.flash("error", "need to add a shipping address");
        res.redirect("/profile/"+req.user._id+"/addressBook");
    } else if (!req.session.cart) {
            res.redirect("/cart");
    } else {
        var cart = new Cart(req.session.cart);
        res.render("shop/shop-checkout", {products: cart.generateArray(), total: cart.totalPrice, csrfToken: req.csrfToken()});
    }
});


// router.get("/", middleware.isLoggedIn, function(req, res) {
//     if (!req.session.cart) {
//         return res.redirect("/cart");
//     }
//     var cart = new Cart(req.session.cart);
//     res.render("shop/shop-checkout", {products: cart.generateArray(), total: cart.totalPrice, csrfToken: req.csrfToken()});
// });


router.post("/", middleware.isLoggedIn, async function(req, res) {
    
    try {
            if (!req.session.cart) {
            return res.redirect("/cart");
        }
        
        let cart = new Cart(req.session.cart);
        let user = await User.find({"isAdmin": true}).exec();
        
        console.log( typeof req.body.chooseAddress);
        
        var jsonStr = req.body.chooseAddress.replace(/(\w+:)|(\w+ :)/g, function(matchedStr, value, string) {
            return '"' + matchedStr.substring(0, matchedStr.length - 1) + '":';
        });
        var shippidingAddress = JSON.parse(jsonStr);
        
        // console.log(shippidingAddress)
        
        let newOrder = ({
            user: req.user,
            cart: cart,
            address: shippidingAddress.address,
            fullName: shippidingAddress.fullName,
            contactNumber: shippidingAddress.contactNumber,
            paymentMethod: req.body.paymentMethod,
            remitMethod: req.body.remitMethod,
        });
        
        let order = await Order.create(newOrder);
        
        console.log(order);
        // var arr = [];
        // for (var id in cart.items) {
        //     arr.push(cart.items[id]);
        // }
        
        // arr.forEach(function(quant) {
        //     Product.findById(quant.item._id, function(err, prod) {
        //         if (err) {
        //             console.log(err);
        //         } else {
        //             if (prod.quantity < 1) {
        //                 res.redirect("back");
        //             } else {
        //                 prod.quantity = prod.quantity - quant.qty;
        //                 prod.save();
        //             }
        //         }
        //     });
        // });
        
        // let newNotification = {
        //     name: req.user.firstName,
        //     orderId: order._id,
        // };
        
        // let notification = await Notification.create(newNotification);
        
        // user.forEach(function(admin) {
        //     admin.notifications.push(notification);
        //     admin.save();
        // });
        
        
        // //pusher talk
        // let Pusher = require('pusher');
        // let pusher = new Pusher({
        //     appId: process.env.PUSHER_APP_ID,
        //     key: process.env.PUSHER_APP_KEY,
        //     secret: process.env.PUSHER_APP_SECRET,
        //     cluster: process.env.PUSHER_APP_CLUSTER
        // });

        // pusher.trigger('notifications', 'post_updated', notification, req.headers['x-socket-id']);
        
        
        
        req.session.cart = null;
        req.user.cart = {};
        req.flash('success', 'Your Cart has been succesfully ORDERED');
        res.redirect("/profile/" + req.user._id + "/orders");
        
    } catch(err) {
        console.log(err);
        req.flash("error", "Something went Wrong!");
        res.redirect('back');
    }
});

module.exports = router;