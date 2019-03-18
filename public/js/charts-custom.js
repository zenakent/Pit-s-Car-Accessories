/*global $, document*/
$(document).ready(function() {

    'use strict';

    Chart.defaults.global.defaultFontColor = '#75787c';

    $.getJSON("/admin/product/api")
        .then(rankChart);

    $.getJSON("/sales/day/api/lastDayDocument")
        .then(dayChart);

    $.getJSON("/sales/day/api/weekLastDocument")
        .then(weeklyChart);

    $.getJSON("/sales/day/api/monthLatestDocument")
        .then(monthlyChart);
});

function rankChart(items) {
    var arr = items.sort(function(a, b) { return b.totalSold - a.totalSold; });
    var ranking = [];

    for (var x = 0; x <= 4; x++) {
        ranking.push(arr[x]);
    }


    var BARCHARTEXMPLE = $('#rankingChart');
    var barChartExample = new Chart(BARCHARTEXMPLE, {
        type: 'bar',
        options: {
            scales: {
                xAxes: [{
                    display: true,
                    gridLines: {
                        color: 'transparent'
                    }
                }],
                yAxes: [{
                    display: true,
                    gridLines: {
                        color: 'transparent'
                    }
                }]
            },
        },
        data: {
            labels: ["Rank 1", "Rank 2", "Rank 3", "Rank 4", "Rank 5", ],
            datasets: [{
                    label: "Data Set 1",
                    backgroundColor: [
                        "#864DD9",
                        "#864DD9",
                        "#864DD9",
                        "#864DD9",
                        "#864DD9",
                        "#864DD9",
                        "#864DD9"
                    ],
                    hoverBackgroundColor: [
                        "#864DD9",
                        "#864DD9",
                        "#864DD9",
                        "#864DD9",
                        "#864DD9",
                        "#864DD9",
                        "#864DD9"
                    ],
                    borderColor: [
                        "#864DD9",
                        "#864DD9",
                        "#864DD9",
                        "#864DD9",
                        "#864DD9",
                        "#864DD9",
                        "#864DD9"
                    ],
                    borderWidth: 0.5,
                    data: [ranking[0].totalSold, ranking[1].totalSold, ranking[2].totalSold, ranking[3].totalSold, ranking[4].totalSold, ],
                },

            ]
        }
    });
}

function dayChart(daySale) {
    var date = new Date(daySale[0].date);

    var BARCHARTEXMPLE = $('#daySale');
    var barChartExample = new Chart(BARCHARTEXMPLE, {
        type: 'bar',
        options: {
            scales: {
                xAxes: [{
                    display: true,
                    gridLines: {
                        color: 'transparent'
                    }
                }],
                yAxes: [{
                    display: true,
                    gridLines: {
                        color: 'transparent'
                    }
                }]
            },
        },
        data: {
            labels: ["Day Sales"],
            datasets: [{
                    label: "Data Set 1",
                    backgroundColor: [
                        "#864DD9",
                    ],
                    hoverBackgroundColor: [
                        "#864DD9",
                    ],
                    borderColor: [
                        "#864DD9",
                    ],
                    borderWidth: 0.5,
                    data: [daySale[0].dailySales],
                },

            ]
        }
    });
}

function weeklyChart(weeklySales) {
    console.log(typeof weeklySales);
    var weekDate = new Date(weeklySales[0].weekOf);
    var dd = weekDate.getDate();
    var mm = weekDate.getMonth() + 1;
    var y = weekDate.getFullYear();

    $('#weekOfDate').text(mm + '/' + dd + '/' + y);
    var BARCHARTEXMPLE = $('#weeklyChart');
    var barChartExample = new Chart(BARCHARTEXMPLE, {
        type: 'bar',
        options: {
            scales: {
                xAxes: [{
                    display: true,
                    gridLines: {
                        color: 'transparent'
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Days'
                    }
                }],
                yAxes: [{
                    display: true,
                    gridLines: {
                        color: 'transparent'
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Total Sales'
                    }
                }]
            },
        },
        data: {
            labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", ],
            datasets: [{
                    label: "Data Set 1",
                    backgroundColor: [
                        "#864DD9",
                        "#864DD9",
                        "#864DD9",
                        "#864DD9",
                        "#864DD9",
                        "#864DD9",
                        "#864DD9"
                    ],
                    hoverBackgroundColor: [
                        "#864DD9",
                        "#864DD9",
                        "#864DD9",
                        "#864DD9",
                        "#864DD9",
                        "#864DD9",
                        "#864DD9"
                    ],
                    borderColor: [
                        "#864DD9",
                        "#864DD9",
                        "#864DD9",
                        "#864DD9",
                        "#864DD9",
                        "#864DD9",
                        "#864DD9"
                    ],
                    borderWidth: 0.5,
                    data: [weeklySales[0].sunday.totalSales, weeklySales[0].monday.totalSales, weeklySales[0].tuesday.totalSales, weeklySales[0].wednesday.totalSales, weeklySales[0].thursday.totalSales, weeklySales[0].friday.totalSales, weeklySales[0].saturday.totalSales, ], //gettoday days 0-6 sun-sat
                },

            ]
        }
    });
}


//monthlychart
function monthlyChart(month) {

    $('#yearMonthlyChart').text(month[0].year);
    var BARCHARTEXMPLE = $('#monthlyChart');
    var barChartExample = new Chart(BARCHARTEXMPLE, {
        type: 'bar',
        options: {
            scales: {
                xAxes: [{
                    display: true,
                    gridLines: {
                        color: 'transparent'
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Months'
                    }
                }],
                yAxes: [{
                    display: true,
                    gridLines: {
                        color: 'transparent'
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Total Sales'
                    }
                }]
            },
        },
        data: {
            labels: ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [{
                    label: "Data Set 1",
                    backgroundColor: [
                        "#CF53F9",
                        "#CF53F9",
                        "#CF53F9",
                        "#CF53F9",
                        "#CF53F9",
                        "#CF53F9",
                        "#CF53F9",
                        "#CF53F9",
                        "#CF53F9",
                        "#CF53F9",
                        "#CF53F9",
                        "#CF53F9",
                    ],
                    hoverBackgroundColor: [
                        "#CF53F9",
                        "#CF53F9",
                        "#CF53F9",
                        "#CF53F9",
                        "#CF53F9",
                        "#CF53F9",
                        "#CF53F9",
                        "#CF53F9",
                        "#CF53F9",
                        "#CF53F9",
                        "#CF53F9",
                        "#CF53F9",
                    ],
                    borderColor: [
                        "#CF53F9",
                        "#CF53F9",
                        "#CF53F9",
                        "#CF53F9",
                        "#CF53F9",
                        "#CF53F9",
                        "#CF53F9",
                        "#CF53F9",
                        "#CF53F9",
                        "#CF53F9",
                        "#CF53F9",
                        "#CF53F9",
                    ],
                    borderWidth: 0.5,
                    data: [month[0].january.totalSales, month[0].february.totalSales, month[0].march.totalSales, month[0].april.totalSales, month[0].may.totalSales, month[0].june.totalSales, month[0].july.totalSales, month[0].august.totalSales, month[0].september.totalSales, month[0].october.totalSales, month[0].november.totalSales, month[0].december.totalSales, ]
                },

            ]
        }
    });
}
