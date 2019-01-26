var mongoose = require("mongoose");
var momentTimezone = require('moment-timezone');

// var reviewSchema = mongoose.Schema({
//     text: String,
//     author: String,
//     createdAt: { type: Date, default: Date.now },
//     // createdAt: { type: Date, default: momentTimezone.tz(Date.now, "Asia/Manila") },
    
// });

var reviewSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: String
    },
    createdAt: { type: Date, default: Date.now },
    
});



module.exports = mongoose.model("Review", reviewSchema);