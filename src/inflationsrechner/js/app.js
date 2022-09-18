// VALIDATION

var testRest;

function restValidator( 
  $el,      /* jQuery element to validate */
  required, /* is the element required according to the `[required]` attribute */
  parent    /* parent of the jQuery element `$el` */

) {

    if (testRest !== undefined) {

        if (testRest < 0) {

            return false;
        
        } else {
        
            return true;
        
        }
        // console.log('defined')
    } else {
        // console.log('undefined');
        return true;
    }
  
};

// Set default options
Foundation.Abide.defaults.validators['rest'] = restValidator;

$(document).foundation();

(function(){

    // mapping the weight of goods must be in the same order as in html

    var weightMapping = [

        ["CC13-01",96.85,"Nahrungsmittel"],
        ["CC13-021",16.96,"Alkohol"],
        ["CC13-1111",31.77,"Restaurants & Cafés"],
        ["CC13-0411",196.32,"Nettokaltmiete"],
        ["CC13-0452",24.77,"Gas"],
        ["CC13-0453",11.54,"Heizöl"],
        ["CC13-0451",25.92,"Strom"],
        ["CC13-072",70.7,"Kraftstoffe"],
        ["CC13-0711",31.56,"Autokauf"],
        ["CC13-073",23.69,"Öffentl. Verkehrsmittel"],
        ["Freizeit",27.41,"Freizeit & Kultur"],
        ["CC13-096",26.62,"Pauschalreisen"],
        ["CC13-03",45.34,"Bekleidung"],       
        ["CC13-083",22.22,"Telekommunikation"],        
        ["Elektro",24.98,"Elektrogeräte"],  
        ["CC13-121",22.88,"Körperpflege"],             
        ["CC13-06",46.13,"Gesundheit"],
        ["CC13-022",20.81,"Tabakwaren"],
        ["REST",233.53,"Rest"]

    ];

    // sets VPI start date
    var startDate = new Date(2015,0,1);

    var chart, options;
    // global variable for parsed csv
    var csvData = [];

    var tmpArr = [];
    // global variable for personal VPI series
    var userData = [];
    // global variable for goods series
    var goodsData = [];
    // global variable for 
    var personalWeight = [];
    // chart options
    options = {
        accessibility: {
            screenReaderSection: {
                beforeChartFormat: '<{headingTagName}>{chartTitle}</{h3}><div>{typeDescription}</div><div>{chartSubtitle}</div>' + 
                                    '<div>{chartLongdesc}</div><div>{playAsSoundButton}</div><div>{viewTableButton}</div>' + 
                                    '<div>{xAxisDescription}</div><div>{yAxisDescription}</div><div>{annotationsTitle}{annotationsList}</div>'
            }
        },
        caption: {
            text: 'Rundungsbedingte Abweichungen möglich.',
            margin: 5
        },
        chart: {
            renderTo: 'container',
            spacingTop: 50
        },
        exporting: {
            chartOptions: {
                title: {
                    text: 'Verbraucherpreisindex'
                },
                subtitle: {
                    text: '2015 = 100'
                }
            },
            filename: 'persoenlicher_inflationsrechner',
            csv: {
                dateFormat: '%Y-%m-%d'
            },
            buttons: {
                contextButton: {
                    y: -50
                }
            },
        },
        legend: {
            enabled: false
        },
        loading: {
            style: {
                opacity: 1
            }
        },
        plotOptions: {
            series: {
                label: {
                    enabled: true,
                    connectorAllowed: false,
                    style: {
                        fontWeight: 'bold'
                    }
                },
                pointStart: Date.UTC(2015, 0, 1), // January 1st 2015
                pointInterval: 'month'
            }
        },
        series: [{
            color: '#006298',
            name: 'amtlicher VPI',
        },{
            color: '#ec4a60',
            name: 'persönlicher VPI',
            // data: userData
        },{
            color: '#00b7eb',
            name: 'Güterart VPI',
            // data: goodsData
        }],
        subtitle: {
            text: null
        },
        title: {
            text: null
        },
        tooltip: {
            shared: true, 
            valueDecimals: 1,
            headerFormat: '{point.key: %B %Y}<br>'
        },
        xAxis: {
            type: 'datetime',
            minorTickInterval: 2629743000, 
            minorTickWidth: 1, 
            minorTickLength: 3,
            minorGridLineWidth:0,
            minPadding: 0.02,
            maxPadding: 0.02
        },
        yAxis: {
            labels: {
                align: 'right',
                reserveSpace: true
            },
            plotLines: [{
                value: 100
            }],              
            title: {
                text: 'Index',
                enabled: false
            },
            opposite: true
        },
    };

    chart = new Highcharts.Chart(options);
    // shows loading spinner while csv gets loaded
    chart.showLoading();

    // load the CSV data
    Highcharts.ajax({
        url: 'data/inflationsrechner.csv',
        dataType: 'text',
        success: function(csv) {

            // Split the lines
            csvData = CSVToArray(csv, ';');

            // console.log(csvData);

            for (var i = 0; i <= csvData.length - 1; i++) {

                if (i !== 0 && csvData[i].length > 1) {

                    var tmpLine =[];

                    tmpLine.push(csvData[i][0]);

                    for (var j = 1; j <= csvData[j].length-1; j++) {

                        var floatVal = parseFloat(csvData[i][j].replace(',', '.'));

                        if (!isNaN(floatVal)) {

                            tmpLine.push(floatVal)

                        } else {

                            tmpLine.push(null);

                        }
                    }
        
                    tmpArr.push(tmpLine);

                }

            };


            // console.log(tmpArr);


            chart.series[0].setData(arraySlicer (1, tmpArr),true);
            // removes loading spinner
            chart.hideLoading();

            // shows percentage for official VPI
            showChange( changeP1, 'amtliche Rate: ', calcChange(chart.series[0]) );
            // shows last Month of CSV data
            showMonth(change, tmpArr.length-2);

        },
        error: function(e, t) {
            console.error(e, t);
        }
    });




    // LISTEN FOR USER INPUT //

    var user_input = document.querySelectorAll('input[type="text"]');

    var labels = document.querySelectorAll('p');

    var menu = document.querySelectorAll('select'); 

    var form = document.getElementById('ausgaben'); 
    
    var resetButton = document.querySelectorAll('input[type="reset"]');

    var change = document.getElementsByClassName('js-change');

    var changeP1 = document.getElementsByClassName('js-official-change');

    var changeP2 = document.getElementsByClassName('js-personal-change');

    // console.log(change);

    // listener for inputs
    user_input.forEach(
        function(userInput) {

            userInput.addEventListener(
                'keyup', 
                function ( event ) {

                    // on every user input rest gets calculated and displayed
                    showRest(calcInputs(user_input));

                    // console.log(calcVPI(user_input));

                }
            );  
        }
    );


    // select menu for goods
    menu.forEach(
        function(userInput) {
            userInput.addEventListener(
                'change', 
                function ( event ) {

                    var clickedItem = event.srcElement;

                    var value = clickedItem.value;
                    // console.log(value);

                    if ( value === 'none') {

                        chart.series[2].setData([] ,true);

                    } else {

                        selectCSVColumn(value, csvData, weightMapping, tmpArr);

                    }

                }
            );  
        }
    );




    $(document)
      // field element is invalid
      // .on("invalid.zf.abide", function(ev,elem) {
      //   console.log("Field id "+ev.target.id+" is invalid");
      // })
      // field element is valid
      // .on("valid.zf.abide", function(ev,elem) {
      //   console.log("Field name "+elem.attr('name')+" is valid");
      // })
      // form validation failed
      // .on("forminvalid.zf.abide", function(ev,frm) {
      //   console.log("Form id "+ev.target.id+" is invalid");
      // })
      // form validation passed, form will submit if submit event not returned false
      // .on("formvalid.zf.abide", function(ev,frm) {
      //   console.log("Form id "+frm.attr('id')+" is valid");
      //   // ajax post form
      // })
      // to prevent form from submitting upon successful validation
      .on("submit", function(ev) {
        // console.log(ev.target)
        ev.preventDefault();
        // console.log("Submit for form id "+ev.target.id+" intercepted");
        // var $btn = $(document.activeElement);
        // console.log($btn);


        // if ($btn[0].value === '#result') {
            
            showRest(calcInputs(user_input));
            // personal VPI series gets calculated and displayed in chart
            calcVPI(tmpArr, personalWeight, userData);
            // missing inputs get filled with zeros
            showZero(user_input);
        
            window.location.href = '#result';
        
        // }
    });

    // as soon as user inputs his spending, averages get calculated and displayed
    $('#spending').on('valid.zf.abide', function(ev,el) {
        // console.log(ev);
        // console.log(el);
        showAverage(el[0].value);
    });


    // DISPLAY AVERAGE SPENDING //


    function showAverage (input) {
        // console.log(input);
        
        // rest value will be determined by sum of all individual averages
        var sum = 0;
        
        for (i = 0; i <= weightMapping.length-1; i++) {


            for (j = 0; j <= labels.length-1; j++) {
                
                    // console.log(user_input[j].id);

                if (labels[j].dataset.indexNumber === 'REST') {
                    
                    // console.log(sum);

                    labels[j].innerHTML = (parseInt(input) - sum) + ' €';

                }

                else if (labels[j].dataset.indexNumber === weightMapping[i][0]) {

                    if (input === '' || input === undefined) {

                        labels[j].innerHTML = '';

                    } else { 

                        sum += Math.round(calcAverage(parseInt(input),weightMapping[i][1]));

                        labels[j].innerHTML = Math.round(calcAverage(parseInt(input),weightMapping[i][1])) + ' €';


                    }

                }

            }

        }

    } 


    // DISPLAY REST //


    function showRest (result) {

        for (i = 0; i <= labels.length-1; i++) {
                // console.log(user_input[j].id);

            if (labels[i].dataset.indexNumber === 'myRest') {

                if (result === undefined) {

                    labels[i].innerHTML = '';

                } else { 

                    labels[i].innerHTML = '<b>' + result + ' €</b>';

                }

            }

        }

    } 

    // DISPLAY LAST MONTH OF CSV DATA

    function showMonth (element, arrayLength) {

        var options = { year: 'numeric', month: 'long' };

        var timestamp = startDate.setMonth( startDate.getMonth() + arrayLength + 1 );

        var date = new Date(timestamp).toLocaleDateString('de-DE', options);

        element[0].innerText = 'Stand: ' + date;

    } 

    function showChange (element, initial, result) {

        element[0].innerHTML = initial + '<b>' + round(result, 1) + ' %</b>'; 

    } 


    // show 0 string to make user realize that missing inputs result in 0 value
    function showZero (input) {

        for (i = 0; i <= input.length-1; i++) {

            if (input[i].value === '') {

                input[i].value = '0';

            }

        };

    } 



    // slicer cuts only a slice (one column of %-value and preceding column for amount) from complete CSV data
    function arraySlicer (index, array) {

        var slicedArray = [];

        for (i = 0; i <= array.length-1; i++) {


            slicedArray.push(array[i].slice(index, index+1));

            
            // var concArr = arr1.concat(arr2);
            
            // console.log(concArr);
            // goodsData.push(arr2);

        };

        // console.log(slicedArray);

        return slicedArray;
    };

    // translates csv column name to array's indexnumber
    function nameToIndex(string, array) {

        for (var i = 0; i <= array[0].length-1; i++) {

            if (string  == array[0][i]) {
                // console.log(i);
                return i;
            } 

        };

    }

    // translates csv column name to options object
    function nameToString (string, array) {

        for (var i = 0; i <= array.length-1; i++) {

            if (string  == array[i][0]) {
                // console.log(i);
                return array[i];
            } 

        };

    }

    function selectCSVColumn (indexNumber, array1 ,array2, array3) {

        var index = nameToIndex(indexNumber, array1);

        var string = nameToString(indexNumber, array2);

        tmpData = arraySlicer(index, array3);

        // console.log(tmpData);
        
        // chart.update(nameToObject(name, optionsArray));

        chart.series[2].setData(tmpData ,false);

        chart.series[2].update({
                name: string[2]
        },true);

        // chart.redraw();

    }

    // HELPER FUNCTIONS //

    function calcAverage (input,weight) {

        return (input * weight) / 1000;

    }

    function calcInputs (nodes) {
        var spending, counter = 0, sum = 0, result = [], myWeight = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

        // console.log(nodes);
        for (i = 0; i <= nodes.length-1; i++) {

            if (nodes[i].name === 'spending') {

                if (nodes[i].value == '') {

                    spending = '';
                
                } else {

                    spending = parseInt(nodes[i].value);
                    
                }
            
            } else if (parseInt(nodes[i].value) > 0 ){

                counter++;

                // console.log(nodes[i].value);
                sum += parseInt(nodes[i].value); 

                myWeight.splice(i-1, 1, (nodes[i].value * 1000 ) / spending);

            }
        
        }

        if (spending === '') {

            return;

        } else {

            myWeight.splice(18, 1, (calcRest(spending,sum) * 1000 ) / spending);
            // console.log(myWeight);
            personalWeight = myWeight;
        
            testRest = calcRest(spending,sum);
            // console.log(calcRest(spending,sum));
            return calcRest(spending,sum); 
        
        }

        // console.log(myWeight);

        // calcVPI(tmpArr, counter, myWeight, userData);

    }


    function calcVPI (array, weight, data) {
        // console.log('vpi');
        var tmpData = [];

        // console.log(data);

        // iterate over temporary array and calc median of user weighted inputs for userData array

        for (i = 0; i <= array.length-1; i++) {

            var sumIndex = 0, sumWeight = 0;

            for (j = 2; j <= array[i].length-1; j++) {


                // console.log('weight:' + weight[j]);

                if ( weight[j - 2] > 0 ) {

                    sumIndex += Math.round((weight[j - 2] * array[i][j]),3);

                    sumWeight += weight[j - 2]

                }

            }

            // console.log(sumWeight);
            tmpData.push ( ( sumIndex / sumWeight ) ); 
        }

        // console.log(tmpData);

        userData = tmpData;

        // console.log(userData);

        chart.series[1].setData(userData ,true);

        // console.log(changeP2);

        showChange( changeP2, '', calcChange(chart.series[1]) );

    }



    function calcChange (seriesArray) {

        // console.log(seriesArray);

        var data = seriesArray.data;

        var start = data[data.length-13].y;

        var end = data[data.length-1].y;

        var result = ( end * 100 ) / start - 100;

        return result;

    }


    function calcRest (spending, sumInputs) {

        // console.log(spending,sumInputs);

        return spending - sumInputs;

    }

    function round(value, precision) {
        
        var multiplier = Math.pow(10, precision || 0);

        return  (Math.round(value * multiplier) / multiplier).toString().replace('.',',');

    }



    // append current copyright to footer
    var copy = document.querySelector('.js-copyright');

    copy.innerHTML = '© ' + 
                '<svg x="0px" y="0px" width="12" height="10" viewBox="0 0 509 452">' +
                    '<g>' +
                        '<rect x="5" y="40" fill="#1D1D1B" width="107" height="298"/>' +
                        '<polygon fill="#CD1531" points="199,338 199,110 306,110 306,337.938"/>' +
                        '<rect x="397" fill="#FCC200" width="107" height="338"/>' +
                        '<rect y="376" fill="#B1B1B1" width="509" height="76"/>' +
                    '</g>' +
                '</svg> Statistisches Bundesamt (Destatis) | ' + currYear;



    // ref: http://stackoverflow.com/a/1293163/2343
    // This will parse a delimited string into an array of
    // arrays. The default delimiter is the comma, but this
    // can be overriden in the second argument.
    function CSVToArray( strData, strDelimiter ){
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = (strDelimiter || ",");

        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
            (
                // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

                // Quoted fields.
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

                // Standard fields.
                "([^\"\\" + strDelimiter + "\\r\\n]*))"
            ),
            "gi"
            );


        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [[]];

        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;


        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec( strData )){

            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[ 1 ];

            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (
                strMatchedDelimiter.length &&
                strMatchedDelimiter !== strDelimiter
                ){

                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push( [] );

            }

            var strMatchedValue;

            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[ 2 ]){

                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                strMatchedValue = arrMatches[ 2 ].replace(
                    new RegExp( "\"\"", "g" ),
                    "\""
                    );

            } else {

                // We found a non-quoted value.
                strMatchedValue = arrMatches[ 3 ];

            }


            // Now that we have our value string, let's add
            // it to the data array.
            arrData[ arrData.length - 1 ].push( strMatchedValue );
        }

        // Return the parsed data.
        return( arrData );
    };


})();