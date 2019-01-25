let express = require("express");
let router = express.Router();
let Product = require("../models/product");




//=============================
//Admin CRUD START
//=============================

//admin home page route
router.get("/", function(req, res) {
    Product.find({}, function(err, prods) {
        if (err) {
            res.render("admin/index");
        } else {
            res.render("admin/index", {prods: prods });
        }
    }); 
});


//admin addItem new route
router.get("/addItem", function (req, res) {
    res.render("admin/addItem");
});

//admin create route
router.post("/", function(req, res) {
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
router.get("/:id/edit", function(req, res) {
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
router.put("/:id", function(req, res) {
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
router.delete("/:id", function(req, res) {
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


//orders page
router.get("/orders", function(req, res) {
    res.render("admin/orders");
});

//customer page
router.get("/customerList", function(req, res) {
    res.render("admin/customerList")
})

module.exports = router;