var mongoose = require("mongoose");

var notificationSchema = ({
    name: String,
    orderId : String,
    prodQuantity: Number,
    prodName: String,
    prodId: String,
    prodImage: String,
    isRead: { type: Boolean, default: false },
});

module.exports = mongoose.model("Notification", notificationSchema);