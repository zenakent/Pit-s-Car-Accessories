var mongoose = require("mongoose");

var weeklySalesDaySchema = ({
    sunday: {
        totalSales: {type: Number, default: 0},
        date: {
            type: Date,
            default: addDaystoDate(0),
        }
    },
    monday: {
        totalSales: {type: Number, default: 0},
        date: {
            type: Date,
            default: addDaystoDate(1),
        }
    },
    tuesday: {
        totalSales: {type: Number, default: 0},
        date: {
            type: Date,
            default: addDaystoDate(2),
        }
    },
    wednesday: {
        totalSales: {type: Number, default: 0},
        date: {
            type: Date,
            default: addDaystoDate(3),
        }
    },
    thursday: {
        totalSales: {type: Number, default: 0},
        date: {
            type: Date,
            default: addDaystoDate(4),
        }
    },
    friday: {
        totalSales: {type: Number, default: 0},
        date: {
            type: Date,
            default: addDaystoDate(5),
        }
    },
    saturday: {
        totalSales: {type: Number, default: 0},
        date: {
            type: Date,
            default: addDaystoDate(6),
        }
    },
    weekOf: {
        type: Date,
        default: addDaystoDate(0),
    },
});

//or save them as numbers? 0 - 6

function addDaystoDate(num) {
    var todayDate = new Date();
    var numberOfDaysToAdd = num;
    
    todayDate.setDate(todayDate.getDate() + numberOfDaysToAdd);
    
    var dd = todayDate.getDate();
    var mm = todayDate.getMonth() + 1;
    var y = todayDate.getFullYear();
    
    return mm + '/'+ dd + '/'+ y
}


// console.log(addDaystoDate(0))
module.exports = mongoose.model("WeekSales", weeklySalesDaySchema);