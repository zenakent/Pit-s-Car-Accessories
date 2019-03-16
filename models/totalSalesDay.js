var mongoose = require("mongoose");

var totalSalesDaySchema = ({
    dailySales: {
        type: Number,
        default: 0,
    },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DaySales", totalSalesDaySchema);