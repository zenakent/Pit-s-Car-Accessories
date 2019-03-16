let express = require("express");
let router = express.Router();
var CronJob = require('cron').CronJob;

const Json2csvParser = require('json2csv').Parser;

let DaySales = require("../models/totalSalesDay");
let WeekSales = require("../models/weeklySales");
let MonthlySales = require("../models/monthlySales");



//create new dailysales at every midnight 00:00
new CronJob('00 00 00 * * *', function() {
    var newdaySales = new DaySales();
  
    newdaySales.save()
    console.log('created new date');
}, null, true, 'Asia/Manila');

//create new weekly sales at every sunday midnight 00 00 00 * * 0
new CronJob('00 00 00 * * 0', function() {
    var newWeekSales = new WeekSales();
  
    newWeekSales.save()
    console.log('created new weekly');
}, null, true, 'Asia/Manila');


//create new monthly total sales at every 1st day of month at midnight 0 0 1 * *
new CronJob('0 0 0 1 * *', function() {
    var newMonthSales = new MonthlySales();
  
    newMonthSales.save()
    console.log('created new monthly');
}, null, true, 'Asia/Manila');







// router.get("/day/something", function(req, res) {
//     DaySales.find({}, function(err, sales) {
//         if (err) {
//             console.log(err);
//         } else {
//             res.send(sales)
//         }
//     })
// })



// console.log('Before job instantiation');
// const job = new CronJob('00 00 00 * * *', function() {
// 	const d = new Date();
// 	console.log('Midnight:', d);
// });
// console.log('After job instantiation');
// job.start();




//===================================
// API's
//===================================

//SALES API. all days
router.get("/day/api", function(req, res) {
    DaySales.find({}, function(err, sales) {
        if (err) {
            console.log(err);
        } else {
            res.json(sales);
        }
    })
});


//product API. just the latest day
router.get("/day/api/lastDayDocument", function(req, res) {
    DaySales.find().sort({_id: -1}).limit(1).exec(function(err, sales) {
        if (err) {
            console.log(err);
        } else {
            res.json(sales);
        }
    })
});



//sales API. latest week
router.get("/day/api/weekLastDocument", function(req, res) {
    WeekSales.find().sort({_id: -1}).limit(1).exec(function(err, sales) {
        if (err) {
            console.log(err);
        } else {
            res.json(sales);
        }
    })
});

//sales API. latest Month or year?
router.get("/day/api/monthLatestDocument", function(req, res) {
    MonthlySales.find().sort({_id: -1}).limit(1).exec(function(err, sales) {
        if (err) {
            console.log(err);
        } else {
            res.json(sales);
        }
    })
});

router.get("/day/api/lastDayDocument1", function(req, res) {
    DaySales.find().sort({_id: -1}).limit(1).exec(function(err, sales) {
        if (err) {
            console.log(err);
        } else {
            const fields = ['dailySales', 'id', 'date'];
            const sales1 = sales;
            console.log(sales1)
            
            const json2csvParser = new Json2csvParser({ fields });
            const csv = json2csvParser.parse(sales1);
            
            res.send(csv)
        }
    });
});



//===================================
// downloadable CSV's
//===================================

//download for monthly/yearly
router.get("/monthDocument/download", function(req, res) {
    MonthlySales.find().exec(function(err, sales) {
        if (err) {
            console.log(err);
        } else {
            // const fields = ['year','january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
            const fields = ['year','january.totalSales', 'february.totalSales', 'march.totalSales', 'april.totalSales', 'may.totalSales', 'june.totalSales', 'july.totalSales', 'august.totalSales', 'september.totalSales', 'october.totalSales', 'november.totalSales', 'december.totalSales'];
            
            const json2csvParser = new Json2csvParser({ fields });
            const csv = json2csvParser.parse(sales);
            
            res.header("Content-Disposition", "attachment;filename=monthly.csv"); 
            res.type("text/csv");
            res.send(csv);
        }
    });
});

//download for weekly
router.get("/weekDocument/download", function(req, res) {
    WeekSales.find({}, function(err, sales) {
        if (err) {
            console.log(err);
        } else {
            const fields = ['weekOf', 'sunday.totalSales', 'monday.totalSales', 'tuesday.totalSales', 'wednesday.totalSales', 'thursday.totalSales', 'friday.totalSales', 'saturday.totalSales',];
            
            const json2csvParser = new Json2csvParser({ fields });
            const csv = json2csvParser.parse(sales);
            
            res.header("Content-Disposition", "attachment;filename=weekly.csv"); 
            res.type("text/csv");
            res.send(csv);
        }
    });
});



module.exports = router;