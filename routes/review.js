let express = require("express");
let router = express.Router();
let Product = require("../models/product");
let Review = require("../models/review");

//create a review
router.post("/", function(req, res) {
    //look up product
    //create new review
    //connect new review to product
    //redirect back to product show page
    console.log(req.params.id);
    Product.findById(req.params.id, function(err, product) {
       if (err) {
           console.log(err);
           res.redirect("back");
       } else {
           Review.create(req.body.review, function(err, review) {
               if (err) {
                   console.log(err);
               } else {
                   console.log(product);
                  product.reviews.push(review);
                  product.save();
                  res.redirect("/shop-item/ + product._id");
               }
           });
       }
    });
});


module.exports = router;