let express = require("express");
let router = express.Router();
let Cart = require("../models/cart");
let Order = require("../models/order");
let User = require("../models/user");
let DaySales = require("../models/totalSalesDay");
let WeekSales = require("../models/weeklySales");
let MonthSales = require("../models/monthlySales");
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
        
        // console.log( typeof req.body.chooseAddress);
        
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
        
        // let order = await Order.create(newOrder);
        
        
        var arr = [];
        for (var id in cart.items) {
            arr.push(cart.items[id]);
        }
        
        arr.forEach(function(quant) {
            Product.findById(quant.item._id, async function(err, prod) {
                if (err) {
                    console.log(err);
                } else {
                    if (prod.quantity < 1) {
                        res.redirect("back");
                    } else {
                        
                        // prod.quantity = prod.quantity - quant.qty;
                        // prod.totalSold = prod.totalSold + 1;
                        // prod.save();
                        
                        // let addSales = ({
                        //     dailySales: prod.price,
                        // })
                        
                        DaySales.findOne().sort({_id: -1}).limit(1).exec(function(err, day) {
                            if (err) {
                                console.log(err);
                            } else {
                                // console.log(day);
                                day.dailySales = day.dailySales + prod.price
                                day.save()
                                
                                WeekSales.find().sort({_id: -1}).limit(1).exec(function (err, foundWeek) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        var today = new Date()
                                        console.log(foundWeek);
                                        console.log(foundWeek[0])
                                       
                                        //switch case for sales week
                                        
                                        switch(today.getDay()) {
                                            case 0:
                                                foundWeek[0].sunday.totalSales = foundWeek[0].sunday.totalSales + prod.price;
                                                break;
                                            case 1:
                                                foundWeek[0].monday.totalSales = foundWeek[0].monday.totalSales + prod.price;
                                                break;
                                            case 2:
                                                foundWeek[0].tuesday.totalSales = foundWeek[0].tuesday.totalSales + prod.price;
                                                break;
                                            case 3:
                                                foundWeek[0].wednesday.totalSales = foundWeek[0].wednesday.totalSales + prod.price;
                                                break;
                                            case 4:
                                                foundWeek[0].thursday.totalSales = foundWeek[0].thursday.totalSales + prod.price;
                                                break;
                                            case 5:
                                                foundWeek[0].friday.totalSales = foundWeek[0].friday.totalSales + prod.price;
                                                break;
                                            case 6:
                                                foundWeek[0].saturday.totalSales = foundWeek[0].saturday.totalSales + prod.price;
                                                break;
                                        }
                                        foundWeek[0].save()
                                    }
                                });
                                
                                MonthSales.find().sort({_id: -1}).limit(1).exec(function (err, foundMonth) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        var thisMonth = new Date();
                                        switch (thisMonth.getMonth()) {
                                            case 0:
                                                foundMonth[0].january.totalSales = foundMonth[0].january.totalSales + prod.price;
                                                break;
                                            case 1:
                                                foundMonth[0].february.totalSales = foundMonth[0].february.totalSales + prod.price;
                                                break;
                                            case 2:
                                                foundMonth[0].march.totalSales = foundMonth[0].march.totalSales + prod.price;
                                                console.log(foundMonth[0])
                                                break;
                                            case 3:
                                                foundMonth[0].april.totalSales = foundMonth[0].april.totalSales + prod.price;
                                                break;
                                            case 4:
                                                foundMonth[0].may.totalSales = foundMonth[0].may.totalSales + prod.price;
                                                break;
                                            case 5:
                                                foundMonth[0].june.totalSales = foundMonth[0].june.totalSales + prod.price;
                                                break;
                                            case 6:
                                                foundMonth[0].july.totalSales = foundMonth[0].july.totalSales + prod.price;
                                                break;
                                            case 7:
                                                foundMonth[0].august.totalSales = foundMonth[0].august.totalSales + prod.price;
                                                break;
                                            case 8:
                                                foundMonth[0].september.totalSales = foundMonth[0].september.totalSales + prod.price;
                                                break;
                                            case 9:
                                                foundMonth[0].october.totalSales = foundMonth[0].october.totalSales + prod.price;
                                                break;
                                            case 10:
                                                foundMonth[0].november.totalSales = foundMonth[0].november.totalSales + prod.price;
                                                break;
                                            case 11:
                                                foundMonth[0].december.totalSales = foundMonth[0].december.totalSales + prod.price;
                                                break;
                                            default:
                                                // code
                                        }
                                        foundMonth[0].save()
                                    }
                                })
                            }
                        });
                        
                        if (prod.quantity <= 10) {
                            let newNotification = {
                                prodQuantity: prod.quantity,
                                prodName: prod.name,
                                prodId: prod._id,
                                prodImage: prod.image,
                            };
                            
                            console.log(newNotification);
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
                        }
                    }
                }
            });
        });
        
        // req.session.cart = null;
        // req.user.cart = {};
        req.flash('success', 'Your Cart has been succesfully ORDERED');
        res.redirect("/profile/" + req.user._id + "/orders");
        
    } catch(err) {
        console.log(err);
        req.flash("error", "Something went Wrong!");
        res.redirect('back');
    }
});

module.exports = router;