let express = require("express");
let router = express.Router();
let Product = require("../models/product");
let Notification = require("../models/notification");
var Order = require("../models/order");
var User = require("../models/user");
var middleware = require("../middleware/index.js");




//================================================
//multer and cloudinary start 
//================================================
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'pitscaraccessories', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

let csrf = require("csurf");
// {csrfToken: req.csrfToken()}
let csrfProtection = csrf();
router.use(csrfProtection);



//=============================
//Admin CRUD START
//=============================

//admin home page route
router.get("/", middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
    var perPage = 100;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    var noMatch = null;
    
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Product.find().or([{name: regex}, {brand: regex}, {type: regex}]).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, prods) {
            console.log(prods)
            
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
router.post("/", middleware.isLoggedIn, middleware.isAdmin, upload.single('image'), function(req, res) {
    cloudinary.uploader.upload(req.file.path, function(result) {
        // add cloudinary url for the image to the campground object under image property
        
        console.log(result.secure_url);
        req.body.prod.image = result.secure_url;
        // add cloudinary ID for the image to the campground object under image property
        req.body.prod.imageId = result.public_id;
       
        Product.create(req.body.prod, function(err, newProd) {
            
            if (err) {
                req.flash("error", "Something went wrong!");
                console.log(err);
                res.redirect("/admin/addItem");
            } else {
                req.flash("success", "You've added a new product!");
                res.redirect("/admin/addItem");
            }
        }); 
    });
});

// //admin edit route
// router.get("/:id/edit", middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
//     Product.findById(req.params.id, function(err, foundProduct) {
//         if (err) {
//             req.flash("error", "couldn't find that product");
//             res.redirect("/admin");
//         } else {
//             res.render("admin/editItem", {prod: foundProduct, csrfToken: req.csrfToken()});
//         }
//     });
// });

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



// //admin update route
// router.put("/:id", middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
//     Product.findByIdAndUpdate(req.params.id, req.body.prod, function(err, updatedProduct) {
//         if (err) {
//             req.flash("error", "Something went wrong");
//             res.redirect("/admin");
//         } else {
//             res.redirect("/admin");
//         }
//     });
// });

//admin update route
router.post("/:id", middleware.isLoggedIn, middleware.isAdmin, upload.single('image'), function(req, res) {
    Product.findById(req.params.id, async function(err, prod) {
        if (err) {
            req.flash("error", err.message);
        } else {
            if (req.file) {
                try {
                    await cloudinary.v2.uploader.destroy(prod.imageId);
                    var result = await cloudinary.v2.uploader.upload(req.file.path);
                    prod.image = result.secure_url;
                    prod.imageId = result.public_id;
                } catch (err) {
                    req.flash("error", err.message);
                    return res.redirect("back");
                }
            }
            
            prod.name = req.body.name;
            prod.price = req.body.price;
            prod.quantity = req.body.quantity;
            prod.brand = req.body.brand;
            prod.type = req.body.type;
            prod.description = req.body.description;
            
            prod.save();
            
            req.flash("success", "Updated Successfully");
            res.redirect("/admin");
        }
    });
});

// //admin destroy route
// router.delete("/:id", middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
//     Product.findByIdAndRemove(req.params.id, function (err) {
//         if (err) {
//             res.redirect("/admin");
//         } else {
//             res.redirect("/admin");
//         }
//     });
// });

//admin destroy route
router.delete("/:id", middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
   Product.findById(req.params.id, async function(err, prod) {
       if (err) {
           req.flash("error", err.message);
           res.redirect("/admin");
       }
       
       try {
           await cloudinary.v2.uploader.destroy(prod.imageId);
           prod.remove()
           req.flash("success", "Product deleted successfully!");
           res.redirect("/admin");
       } catch (err) {
           if (err) {
               req.flash("error", err.message);
               res.redirect("/admin");
           }
       }
   });
});

//=============================
//Admin CRUD END
//=============================

//=============================
//Admin ORDER START
//=============================

router.get("/orders/newOrders", middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
    var perPage = 100;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    var noMatch = null;
    
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Order.find({"orderFulfilled": false}).or([{firstName: regex}, {lastName: regex}]).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, orders) {
            console.log(orders)
           Order.countDocuments({name: regex}).exec(function(err, count) {
               console.log(count)
              if (err) {
                  console.log(err);
                  res.redirect("back");
              } else {
                  if (orders.length < 1) {
                      noMatch = "No product could match that query, please try again";
                      req.flash("error", noMatch);
                  }
                  
                  res.render("admin/orders", {orders: orders, current: pageNumber, pages: Math.ceil(count / perPage), noMatch: noMatch, search: req.query.search, csrfToken: req.csrfToken()});
              }
           });
        });
    } else {
        Order.find({"orderFulfilled": false}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function(err, orders) {
           Order.countDocuments().exec(function(err, count) {
               if (err) {
                   console.log(err);
               } else {
                   req.flash("error", noMatch);
                   res.render("admin/orders", {orders: orders, current: pageNumber, pages: Math.ceil(count / perPage), noMatch: noMatch, search: false, csrfToken: req.csrfToken()});
               }
           }) ;
        });
    }
});



//orders new page
// router.get("/orders/newOrders", middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
//     Order.find({"orderFulfilled": false}, function(err, orders) {
//         if (err) {
//             console.log(err);
//             res.redirect("/admin");
//         } else {
//             res.render("admin/orders", {orders: orders});
//         }
//     });
// });

//fulfilled/old orders page
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
        req.flash("success", "Order has been completed");
        res.redirect("/admin/orders/newOrders");
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


router.get("/customerList", middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
    var perPage = 100;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    var noMatch = null;
    
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        User.find({"isAdmin": false}).or([{firstName: regex}, {lastName: regex}]).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, foundUsers) {
            
           User.countDocuments({name: regex}).exec(function(err, count) {
               console.log(count)
              if (err) {
                  console.log(err);
                  res.redirect("back");
              } else {
                  if (foundUsers.length < 1) {
                      noMatch = "No product could match that query, please try again";
                      req.flash("error", noMatch);
                  }
                  
                  res.render("admin/customerList", {foundUsers: foundUsers, current: pageNumber, pages: Math.ceil(count / perPage), noMatch: noMatch, search: req.query.search, csrfToken: req.csrfToken()});
              }
           });
        });
    } else {
        User.find({isAdmin: false}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function(err, foundUsers) {
           User.countDocuments().exec(function(err, count) {
               if (err) {
                   console.log(err);
               } else {
                   req.flash("error", noMatch);
                   res.render("admin/customerList", {foundUsers: foundUsers, current: pageNumber, pages: Math.ceil(count / perPage), noMatch: noMatch, search: false, csrfToken: req.csrfToken()});
               }
           }) ;
        });
    }
});


// //customer list page
// router.get("/customerList", middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
//     User.find({"isAdmin": false}, function(err, foundUsers) {
//         if (err) {
//             console.log(err);
//             res.redirect("back");
//         } else {
//             res.render("admin/customerList", {foundUsers: foundUsers});
//         }
//     });
// });

//customer page
router.get("/customerList/:id", middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
    User.findById(req.params.id, function(err, foundUser) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("admin/customerPage", {foundUser: foundUser, csrfToken: req.csrfToken()});
        }
    });
});


router.get("/customerList/:id/orders", middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
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
router.delete("/customerList/:id", middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
    User.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
        } else {
            req.flash("Success", "You have deleted the customer's account");
            res.redirect("/admin/customerList");
        }
    });
});



//add admin route view
router.get("/addAdmin", middleware.isLoggedIn, middleware.isSuperAdmin, function(req, res) {
    //$or: [{$and: [{"isSuperAdmin": false}, {"isAdmin": true}]}, {$and: [{"isSuperAdmin": false}, {"isAdmin": false}]} ]
    User.find({}, function(err, foundUsers) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("admin/userList", {foundUsers: foundUsers, csrfToken: req.csrfToken()});
        }
    });
});

//remove admin route view
router.get("/removeAdmin/:id", middleware.isLoggedIn, middleware.isSuperAdmin, function(req, res) {
    User.findById(req.params.id, function(err, user) {
       if (err) {
           req.flash("error", err.message);
       } else {
           user.isAdmin = false;
           user.save();
           req.flash("success", "Updated Successfully");
           res.redirect("/admin/addAdmin");
       }
   }); 
});



//add an admin
router.post("/addAdmin/:id", middleware.isLoggedIn, middleware.isSuperAdmin, function(req, res) {
   User.findById(req.params.id, function(err, user) {
       if (err) {
           req.flash("error", err.message);
       } else {
           user.isAdmin = true;
           user.save();
           req.flash("success", "Updated Successfully");
           res.redirect("/admin/addAdmin");
       }
   }); 
});


//remove an admin
router.post("/removeAdmin/:id", middleware.isLoggedIn, middleware.isSuperAdmin, function(req, res) {
   User.findById(req.params.id, function(err, user) {
       if (err) {
           req.flash("error", err.message);
       } else {
           user.isAdmin = true;
           user.save();
           req.flash("success", "Updated Successfully");
           res.redirect("/admin/addAdmin");
       }
   }); 
});

//function for protection from regex attacks
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;