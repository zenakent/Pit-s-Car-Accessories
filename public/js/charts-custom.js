/*global $, document*/
$(document).ready(function () {

    'use strict';

    Chart.defaults.global.defaultFontColor = '#75787c';

    $.getJSON("/admin/product/api")
    .then(charts);
});

function charts(items) {
    var arr = items.sort(function(a,b) { return b.totalSold - a.totalSold; });
    var ranking = [];
    
    for (var x = 0; x <= 4; x++) {
        ranking.push(arr[x]);
    }
    
    console.log(ranking)
    var BARCHARTEXMPLE    = $('#barChartCustom3');
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
            datasets: [
                {
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