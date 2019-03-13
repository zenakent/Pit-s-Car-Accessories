let mongoose = require("mongoose");

//====================================================
// Schema 
//====================================================

let orderSchema = new mongoose.Schema({
   user: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "User", //model name
   },
   cart: {
       type: Object,
       required: true,
   },
   address: {
       type: String,
      //  required: true,
   },
   firstName: {
       type: String,
      //  required: true,
   },
   lastName: {
       type: String,
      //  required: true,
   },
   contactNumber: {
       type: Number,
       required: true,
   },
   city: {
       type: String,
       
   },
   fullName: String,
   remitMethod: String,
   paymentMethod: {
       type: String,
   },
   createdAt: { 
      type: Date, 
      default: Date.now 
   },
   orderFulfilled: {
      type: Boolean,
      default: false,
   },
});



module.exports = mongoose.model("Order", orderSchema);


// user: {
//        type: mongoose.Schema.Types.ObjectId,
//        ref: "User" //model name
//    },