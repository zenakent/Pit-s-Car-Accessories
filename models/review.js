var mongoose = require("mongoose");
var momentTimezone = require('moment-timezone');

var reviewSchema = mongoose.Schema({
    text: String,
    author: String,
    createdAt: { type: Date, default: Date.now },
    // createdAt: { type: Date, default: momentTimezone.tz(Date.now, "Asia/Manila") },
    
});

module.exports = mongoose.model("Review", reviewSchema);