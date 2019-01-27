let express = require("express");
let router = express.Router();
let Product = require("../models/product");
let Notification = require("../models/notification");
var Order = require("../models/order");
var middleware = require("../middleware/index.js");



//=============================
//Admin CRUD START
//=============================

//admin home page route
router.get("/", middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
    Product.find({}, function(err, prods) {
        if (err) {
            res.render("admin/index");
        } else {
            res.render("admin/index", {prods: prods });
        }
    }); 
});


//admin addItem new route
router.get("/addItem", middleware.isLoggedIn, middleware.isAdmin, function (req, res) {
    res.render("admin/addItem");
});

//admin create route
router.post("/", middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
   Product.create(req.body.prod, function(err, newProd) {
       if (err) {
           console.log("Something went wrong");
           console.log(err);
           res.redirect("/admin/addItem");
       } else {
           res.redirect("/admin/addItem");
       }
   }); 
});

//admin edit route
router.get("/:id/edit", middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
    Product.findById(req.params.id, function(err, foundProduct) {
        if (err) {
            console.log("couldn't find that product");
            res.redirect("/admin");
        } else {
            res.render("admin/editItem", {prod: foundProduct});
        }
    });
});

//admin update route
router.put("/:id", middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
    Product.findByIdAndUpdate(req.params.id, req.body.prod, function(err, updatedProduct) {
        if (err) {
            console.log("Something went wrong");
            res.redirect("/admin");
        } else {
            res.redirect("/admin");
        }
    });
});

//admin destroy route
router.delete("/:id", middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
    Product.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/admin");
        } else {
            res.redirect("/admin");
        }
    });
});

//=============================
//Admin CRUD END
//=============================

//=============================
//Admin ORDER START
//=============================
//orders new page
router.get("/orders/newOrders", middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
    Order.find({"orderFulfilled": false}, function(err, orders) {
        if (err) {
            console.log(err);
            res.redirect("/admin");
        } else {
            res.render("admin/orders", {orders: orders});
        }
    });
});

//fulfilled orders page
router.get("/orders/oldOrders", middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
    Order.find({"orderFulfilled": true}, function(err, orders) {
        if (err) {
            console.log(err);
            res.redirect("/admin");
        } else {
            res.render("admin/ordersOld", {orders: orders});
        }
    });
});


//individual order page
router.get("/orders/:id", middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
    Order.findById(req.params.id, function(err, foundOrder) {
        if (err) {
            console.log(err);
        } else {
            // console.log(foundOrder);
            res.render("admin/orderPage", {foundOrder: foundOrder});
        }
    });
});

// router.put("/orders/:id", async  function(req, res) {
//     try {
//         let order = await Order.findById(req.params.id);
//         order.orderFulfilled = true;
//         order.save();
//         res.redirect("/admin/orders");
//     } 
//     catch(err) {
//         res.redirect("back");
//     }
// });

router.get("/orders/update/:id", middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
  Order.findById(req.params.id, function(err, foundOrder) {
      if (err) {
          console.log(err);
          res.redirect("back");
      } else {
         //find the notification partnered with the order and set the isRead to true !?!?!?
        
        foundOrder.orderFulfilled = true;
        foundOrder.save();
        //   console.log(foundOrder);
          res.redirect("/admin/orders")
      }
  }) 
});

//=============================
//Admin NOTIFICATION START
//=============================

router.get("/notifications/:id", middleware.isLoggedIn, middleware.isAdmin, async function(req, res) {
    try {
        let notification = await Notification.findById(req.params.id);
        notification.isRead = true;
        notification.save();
        res.redirect("/admin/orders/" + notification.orderId);
    } catch(err) {
        console.log(err);
        res.redirect("back");
    }
});


//=============================
//Admin ORDER END
//=============================

//customer page
router.get("/customerList", middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
    res.render("admin/customerList")
})

module.exports = router;