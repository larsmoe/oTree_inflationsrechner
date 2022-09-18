// append current copyright to footer
var currYear = new Date().getFullYear();

// Override autoIncrement to allow pointInterval: 'month' and 'year'
(function (H) {
    var pick = H.pick,
        useUTC = H.getOptions().global.useUTC,
        setMonth = useUTC ? 'setUTCMonth' : 'setMonth',
        getMonth = useUTC ? 'getUTCMonth' : 'getMonth',
        setFullYear = useUTC ? 'setUTCFullYear' : 'setFullYear',
        getFullYear = useUTC ? 'getUTCFullYear' : 'getFullYear';
    
    H.Series.prototype.autoIncrement = function () {
        
        var options = this.options,
            xIncrement = this.xIncrement,
            date,
            pointInterval;
        
        xIncrement = pick(xIncrement, options.pointStart, 0);
        
        this.pointInterval = pointInterval = pick(this.pointInterval, options.pointInterval, 1);
        
        // Added code for pointInterval strings
        if (pointInterval === 'month' || pointInterval === 'year') {
            date = new Date(xIncrement);
            date = (pointInterval === 'month') ?
                +date[setMonth](date[getMonth]() + 1) :
                +date[setFullYear](date[getFullYear]() + 1);
            pointInterval = date - xIncrement;
        }
        
        this.xIncrement = xIncrement + pointInterval;
        return xIncrement;
    };
}(Highcharts));

Highcharts.setOptions({

    global: {
        Date: undefined,
        useUTC: false
    },
    lang: {
        thousandsSep: ','        
    }
});

// custom format for quarters

Highcharts.dateFormats = {
    Q: function(timestamp) {
        var date = new Date(timestamp);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        if (m <= 3) str = "1. Vierteljahr " + y;
        else if (m <= 6) str = "2. Vierteljahr " + y;
        else if (m <= 9) str = "3. Vierteljahr " + y;
        else str = "4. Vierteljahr " + y;
        return str;
    },

    q: function(timestamp) {
        var date = new Date(timestamp);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        if (m <= 3) str = "1. Vj. " + y;
        else if (m <= 6) str = "2. Vj. " + y;
        else if (m <= 9) str = "3. Vj. " + y;
        else str = "4. Vj. " + y;
        return str;
    },

    V: function(timestamp) {
        var date = new Date(timestamp);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        if (m <= 3) str = "1. Quartal " + y;
        else if (m <= 6) str = "2. Quartal " + y;
        else if (m <= 9) str = "3. Quartal " + y;
        else str = "4. Quartal " + y;
        return str;
    },

    v: function(timestamp) {
        var date = new Date(timestamp);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        if (m <= 3) str = "1. Qt. " + y;
        else if (m <= 6) str = "2. Qt. " + y;
        else if (m <= 9) str = "3. Qt. " + y;
        else str = "4. Qt. " + y;
        return str;
    },
    H: function(timestamp) {
        var date = new Date(timestamp);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        if (m <= 6) str = "1. Halbjahr " + y;
        else str = "2. Halbjahr " + y;
        return str;
    },

    h: function(timestamp) {
        var date = new Date(timestamp);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        if (m <= 6) str = "1. Hj. " + y;
        else str = "2. Hj. " + y;
        return str;
    }
};

Highcharts.theme = {
    caption: {
        style: {
            color: "#3c3c3c"
        }, 
        margin: 0 
    },
    colors: ["#143250", "#235587", "#2c74b5", "#5a91c8", "#82afd2", "#afc8e1", '#d7e1f0',
        "#5a1919", "#96282d", "#d23c41", "#fd484e", "#ff7d82", "#ffaaaa", '#ffd2d7',
        "#c3c3c3"
    ],
    chart: {
        backgroundColor: 'white',
        events: {
            afterPrint: function() {

                this.exportSVGElements[0].show();
            },
            beforePrint: function() {

                this.exportSVGElements[0].hide();
            },
            load: function() {
                // if ( !$($(this)[0].renderTo).data('chart-show-responsive') ) {
                    var chart = this,

                        y = chart.chartHeight - 20;

                    var copyright = this.renderer.g().add()
                        .attr({
                            transform: 'translate(0,' + y + ')'
                        })
                        .attr("class", "js-destatis-copyright");

                    var logo = this.renderer.g().add()
                        .attr({
                            transform: 'translate(12,0)'
                        })
                        .add(copyright);

                    this.renderer.text('©', 0, 11)
                        .attr({
                            fill: '#333333',
                            'font-size': '13px',
                            'font-family': '"Statis Sans"'
                        })
                        .add(copyright);
                    this.renderer.rect(1, 1, 2, 6, 0)
                        .attr({
                            fill: '#1D1D1B'
                        })
                        .add(logo);
                    this.renderer.rect(5, 3, 2, 4, 0)
                        .attr({
                            fill: '#CD1531'
                        })
                        .add(logo);
                    this.renderer.rect(9, 0, 2, 7, 0)
                        .attr({
                            fill: '#FCC200'
                        })
                        .add(logo);
                    this.renderer.rect(1, 8, 10, 2, 0)
                        .attr({
                            fill: '#B1B1B1'
                        })
                        .add(logo);
                    this.renderer.text('Statistisches Bundesamt (Destatis), ' + currYear, 27, 9)
                        .attr({
                            fill: '#333333',
                            'font-size': '13px',
                            'font-family': '"Statis Sans"'
                        })
                        .add(copyright);
                // }
            }
        },
        spacing: [0, 0, 35, 0],
        ignoreHiddenSeries: false,
        style: {
            fontFamily: '"Statis Sans", sans-serif',
            fontSize: '13px',
            color: '#333333'
        }
    },
    title: {
        margin: 25,
        style: {
            fontFamily: '"Statis Sans", sans-serif',
            fontWeight: 'bold',
            fontSize: '15px',
            color: '#333333'
        },
        align: 'left'
    },
    subtitle: {
        align: 'left',
        style: {
            fontFamily: '"Statis Sans", sans-serif',
            fontSize: '13px',
            color: '#333333'
        },
    },
    tooltip: {
        shadow: false,
        borderColor: '#333333',
        headerFormat: '<span style="font-size: 13px">{point.key}</span><br/>',
        valueDecimals: 1,
        style: {
            fontFamily: '"Statis Sans", sans-serif',
            fontSize: '13px',
            color: '#333333',
            lineHeight: 20
        },
    },
    legend: {
        align: 'left',
        itemMarginTop: 2,
        itemMarginBottom: 2,
        itemStyle: {
            fontFamily: '"Statis Sans", sans-serif',
            fontSize: '13px',
            fontWeight: 'regular',
            color: '#333333'
        },
        itemHiddenStyle: {
            fontFamily: '"Statis Sans", sans-serif',
            fontWeight: 'regular',
        },
        symbolHeight: 13,
        symbolRadius: 1,
        title: {
            text: 'Dies ist eine Legende'
        },
        maxHeight: 85,
        margin: 0,
        padding: 15,
        x: -15
    },
    xAxis: {
        gridLineColor: '#333333',
        lineColor: '#333333',
        tickColor: '#333333',
        tickLength: 6,
        labels: {
            style: {
                fontFamily: '"Statis Sans", sans-serif',
                fontSize: '13px',
                color: '#333333'
            },
            autoRotation: false
        },

        maxPadding: 0.05,
        minPadding: 0.05
    },
    yAxis: {
        allowDecimals: false,
        gridLineColor: '#333333',
        gridLineWidth: 0.1,
        lineColor: '#333333',
        tickColor: '#333333',
        tickLength: 6,
        labels: {
            // format: '{value: ,.0f}',
            style: {
                fontFamily: '"Statis Sans", sans-serif',
                fontSize: '13px',
                color: '#333333'
            },
            autoRotation: false
        },
        title: {
            text: null
        },
        maxPadding: 0.05,
        minPadding: 0.05
    },
    plotOptions: {
        series: {
            borderWidth: 0,
            lineWidth: 2,
            dataLabels: {
                enabled: false,
                // format: '{y:,.1f}'
                style: {
                    fontFamily: '"Statis Sans", sans-serif',
                    fontSize: '13px',
                    fontWeight: 'regular',
                    color: '#333333'
                }
            },
            label: {
                style: {
                    fontWeight: 'normal'
                },
                enabled: false
            },
            marker: {
                enabled: false,
                radius: 3,
                symbol: 'circle'
            }
        },
        column: {
            maxPointWidth: 30
        },
        bar: {
            maxPointWidth: 15
        }
    },
    credits: {
        enabled: false,
        position: {
            align: 'left',
            x: 0,
            y: -35
        },
        style: {
            fontFamily: '"Statis Sans", sans-serif',
            fontSize: '13px',
            color: '#333333'
        }
    },
    // responsive: {
    //     rules: [{
    //         condition: {
    //             callback: m_responsiveCallBack
    //         },
    //         chartOptions: {
    //             exporting: {
    //                 enabled: false
    //             },
    //             plotOptions: {
    //                 series: {
    //                     enableMouseTracking: false,
    //                     lineWidth: 1,
    //                     marker: {
    //                         enabled: false
    //                     }
    //                 }
    //             },
    //             chart: {
    //                 height: '75%',
    //                 spacing: [48,24,48,24]
    //             },
    //             legend: {
    //                 enabled: false
    //             },
    //             xAxis: {
    //                 labels: {
    //                     enabled: false
    //                 }
    //             },
    //             yAxis: {
    //                 title: {
    //                     text: null
    //                 },
    //                 labels: {
    //                     enabled: false
    //                 }
    //             },
    //             title: {
    //                 text: null
    //             },
    //             subtitle: {
    //                 text: null
    //             },
    //             credits: {
    //                 enabled: false
    //             }
    //         }
    //     }]
    // },
    exporting: {
        buttons: {
            contextButton: {
                menuItems: [
                    'printChart',
                    'separator',
                    'downloadPNG',
                    'downloadSVG',
                    'separator',
                    'downloadCSV'
                ]
            }
        },
        chartOptions: {
            chart: {
                events: {
                    load: function() {

                        var chart = this,

                            y = chart.chartHeight - 25;

                        var copyright = this.renderer.g().add()
                            .attr({
                                transform: 'translate(40,' + y + ')'
                            })
                            .attr("class", "js-destatis-copyright");

                        var logo = this.renderer.g().add()
                            .attr({
                                transform: 'translate(12,0)'
                            })
                            .add(copyright);

                        this.renderer.text('©', 0, 11)
                            .attr({
                                fill: '#333333',
                                'font-size': '13px',
                                'font-family': '"Statis Sans"'
                            })
                            .add(copyright);
                        this.renderer.rect(1, 1, 2, 6, 0)
                            .attr({
                                fill: '#1D1D1B'
                            })
                            .add(logo);
                        this.renderer.rect(5, 3, 2, 4, 0)
                            .attr({
                                fill: '#CD1531'
                            })
                            .add(logo);
                        this.renderer.rect(9, 0, 2, 7, 0)
                            .attr({
                                fill: '#FCC200'
                            })
                            .add(logo);
                        this.renderer.rect(1, 8, 10, 2, 0)
                            .attr({
                                fill: '#B1B1B1'
                            })
                            .add(logo);
                        this.renderer.text('Statistisches Bundesamt (Destatis), ' + currYear, 27, 9)
                            .attr({
                                fill: '#333333',
                                'font-size': '13px',
                                'font-family': '"Statis Sans"'
                            })
                            .add(copyright);
                    }
                },
                width: 768,
                height: 432,
                spacing: [40, 40, 50, 40],
                style: {
                    fontFamily: '"Statis Sans", sans-serif'
                }
            },
            credits: {
                position: {
                    // align: 'left',
                    x: 40,
                }
            }
        },
        csv: {
            itemDelimiter: ';'
        },
        fallbackToExportServer: false,
        scale: 2.667,
        libURL: 'js/lib/'
    }
};

Highcharts.setOptions(Highcharts.theme);