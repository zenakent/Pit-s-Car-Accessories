let express = require("express");
let router = express.Router();
let Product = require("../models/product");
let Notification = require("../models/notification");
var Order = require("../models/order");
var User = require("../models/user");
var middleware = require("../middleware/index.js");

let csrf = require("csurf");
// {csrfToken: req.csrfToken()}
let csrfProtection = csrf();
router.use(csrfProtection);




//=============================
//Admin CRUD START
//=============================

//admin home page route
router.get("/", middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
    var perPage = 8;
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
                  
                  res.render("admin/index", {prods: prods, current: pageNumber, pages: Math.ceil(count / perPage), noMatch: noMatch, search: req.query.search, csrfToken: req.csrfToken()});
              }
           });
        });
    } else {
        Product.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function(err, prods) {
           Product.countDocuments().exec(function(err, count) {
               if (err) {
                   console.log(err);
               } else {
                   req.flash("error", noMatch);
                   res.render("admin/index", {prods: prods, current: pageNumber, pages: Math.ceil(count / perPage), noMatch: noMatch, search: false, csrfToken: req.csrfToken()});
               }
           }) ;
        });
    }
});

//admin home page route original
// router.get("/", middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
//     Product.find({}, function(err, prods) {
//         if (err) {
//             res.render("admin/index");
//         } else {
//             res.render("admin/index", {prods: prods });
//         }
//     }); 
// });


//admin addItem new route
router.get("/addItem", middleware.isLoggedIn, middleware.isAdmin, function (req, res) {
    res.render("admin/addItem", {csrfToken: req.csrfToken()});
});

//admin create route
router.post("/", middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
   Product.create(req.body.prod, function(err, newProd) {
       if (err) {
           req.flash("error", "Something went wrong!");
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
            req.flash("error", "couldn't find that product");
            res.redirect("/admin");
        } else {
            res.render("admin/editItem", {prod: foundProduct, csrfToken: req.csrfToken()});
        }
    });
});

//admin update route
router.put("/:id", middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
    Product.findByIdAndUpdate(req.params.id, req.body.prod, function(err, updatedProduct) {
        if (err) {
            req.flash("error", "Something went wrong");
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
          res.redirect("/admin/orders/oldOrders");
      }
  }); 
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


//add a mark all as read

//=============================
//Admin ORDER END
//=============================

//customer list page
router.get("/customerList", middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
    User.find({"isAdmin": true}, function(err, foundUsers) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("admin/customerList", {foundUsers: foundUsers});
        }
    });
});

//customer page
router.get("/customerList/:id", function(req, res) {
    User.findById(req.params.id, function(err, foundUser) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("admin/customerPage", {foundUser: foundUser, csrfToken: req.csrfToken()});
        }
    });
});


router.get("/customerList/:id/orders", function(req, res) {
    User.findById(req.params.id, function(err, foundUser) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            Order.find().where("user").equals(foundUser.id).exec(function(err, foundOrders) {
                if (err) {
                    console.log(err);
                    res.redirect("back");
                } else {
                    res.render("admin/customerOrders", {user: foundUser, orders: foundOrders});
                }
            });
        }
    });
});


//customer destroy route
router.delete("/customerList/:id", function(req, res) {
    User.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
        } else {
            req.flash("Success", "You have deleted the customer's account");
            res.redirect("/admin/customerList");
        }
    });
});

//function for protection from regex attacks
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;