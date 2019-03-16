var mongoose = require("mongoose");

var monthlySalesDaySchema = ({
    year: {
        type: String,
        default: getYear(),
    },
    january: {
        totalSales: {type: Number, default: 0},
        date: {
            type: Date,
            default: addMonthstoDate(0),
        }
    },
    february: {
        totalSales: {type: Number, default: 0},
        date: {
            type: Date,
            default: addMonthstoDate(1),
        }
    },
    march: {
        totalSales: {type: Number, default: 0},
        date: {
            type: Date,
            default: addMonthstoDate(2),
        }
    },
    april: {
        totalSales: {type: Number, default: 0},
        date: {
            type: Date,
            default: addMonthstoDate(3),
        }
    },
    may: {
        totalSales: {type: Number, default: 0},
        date: {
            type: Date,
            default: addMonthstoDate(4),
        }
    },
    june: {
        totalSales: {type: Number, default: 0},
        date: {
            type: Date,
            default: addMonthstoDate(5),
        }
    },
    july: {
        totalSales: {type: Number, default: 0},
        date: {
            type: Date,
            default: addMonthstoDate(6),
        }
    },
    august: {
        totalSales: {type: Number, default: 0},
        date: {
            type: Date,
            default: addMonthstoDate(7),
        }
    },
    september: {
        totalSales: {type: Number, default: 0},
        date: {
            type: Date,
            default: addMonthstoDate(8),
        }
    },
    october: {
        totalSales: {type: Number, default: 0},
        date: {
            type: Date,
            default: addMonthstoDate(9),
        }
    },
    november: {
        totalSales: {type: Number, default: 0},
        date: {
            type: Date,
            default: addMonthstoDate(10),
        }
    },
    december: {
        totalSales: {type: Number, default: 0},
        date: {
            type: Date,
            default: addMonthstoDate(11),
        }
    },
    
});

//or save them as numbers? 0 - 6

function addMonthstoDate(num) {
    var todayDate = new Date();
    var numberOfMonthsToAdd = num;
    
    todayDate.setMonth(todayDate.getMonth() + numberOfMonthsToAdd);
    
    var dd = todayDate.getDate();
    var mm = todayDate.getMonth() + 1;
    var y = todayDate.getFullYear();
    
    return mm + '/'+ dd + '/'+ y
}

function getYear() {
    var todayDate = new Date;
    
    return todayDate.getFullYear();
}

console.log(getYear())


module.exports = mongoose.model("MonthSales", monthlySalesDaySchema);