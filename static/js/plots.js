var apiKey = "ac6hLgVewCjgjJezdjUR";

/**
 * Helper function to select stock data
 * Returns an array of values
 * @param {array} rows
 * @param {integer} index
 * index 0 - Date
 * index 1 - Open
 * index 2 - High
 * index 3 - Low
 * index 4 - Close
 * index 5 - Volume
 */
function unpack(rows, index) {
  return rows.map(function(row) {
    return row[index];
  });
}

function getMonthlData() {

  var queryUrl = `https://www.quandl.com/api/v3/datasets/WIKI/AMZN.json?start_date=2016-10-01&end_date=2017-10-01&collapse=monthly&api_key=${apiKey}`;
    Plotly.d3.json(queryUrl, function(error, response) {
      var dates = unpack(response.dataset.data, 0);
      var openPrices = unpack(response.dataset.data, 1);
      var highPrices = unpack(response.dataset.data, 2);
      var lowPrices = unpack(response.dataset.data, 3);
      var closingPrices = unpack(response.dataset.data, 4);
      var volume = unpack(response.dataset.data, 5);
    });
}


var austin_weather = [
    { date: "2018-02-01", low: 51, high: 76},
    { date: "2018-02-02", low: 47, high: 59},
    { date: "2018-02-03", low: 44, high: 59},
    { date: "2018-02-04", low: 52, high: 73},
    { date: "2018-02-05", low: 47, high: 71},
]
// YOUR CODE HERE



function buildPlot() {
  var url = `https://www.quandl.com/api/v3/datasets/WIKI/AMZN.json?start_date=2016-10-01&end_date=2017-10-01&api_key=${apiKey}`;

  Plotly.d3.json(url, function(error, response) {

    if (error) return console.warn(error);

    // Grab values from the response json object to build the plots
    var name = response.dataset.name;
    var stock = response.dataset.dataset_code;
    var startDate = response.dataset.start_date;
    var endDate = response.dataset.end_date;
    var dates = unpack(response.dataset.data, 0);
    var openingPrices = unpack(response.dataset.data, 1);
    var highPrices = unpack(response.dataset.data, 2);
    var lowPrices = unpack(response.dataset.data, 3);
    var closingPrices = unpack(response.dataset.data, 4);

    getMonthlData();

    var trace1 = {
      type: "scatter",
      mode: "lines",
      name: name,
      x: dates,
      y: closingPrices,
      line: {
        color: "#17BECF"
      }
    };

    // Candlestick Trace
    var trace2 = {
      type: "candlestick",
      x: dates,
      high: highPrices,
      low: lowPrices,
      open: openingPrices,
      close: closingPrices
    };

    var data = [trace1, trace2];

    var layout = {
      title: `${stock} closing prices`,
      xaxis: {
        range: [startDate, endDate],
        type: "date"
      },
      yaxis: {
        autorange: true,
        type: "linear"
      },
      showlegend: false
    };

    Plotly.newPlot("pie-chart", data, layout);

  });
}

buildPlot();

// BONUS - Dynamically add the current date to the report header
// YOUR CODE HERE

/* data route */
function washFreqGauge(sampleID) {

  // Wash Freq Gauge
  var washFreqURL = `/wfreq/${sampleID}`;
  console.log(washFreqURL);
  Plotly.d3.json(washFreqURL, function (error, wfreqData) {
      var wfreq = wfreqData.WFREQ;
      console.log(wfreq);
      plotWashFreq(wfreq);
  });
  // end Guage plot Data


}
washFreqGauge("940")
function plotWashFreq(wfreq) {

    // Enter a speed between 0 and 180
    var level0 = wfreq;
    var level = level0 * 18

    // Trig to calc meter point
    var degrees = 180 - level,
        radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX, space, pathY, pathEnd);

    var data = [{
        type: 'scatter',
        x: [0], y: [0],
        marker: { size: 14, color: '850000' },
        showlegend: false,
        name: 'Washing Frequency',
        text: level0,
        hoverinfo: 'text+name'
    },
    {
        values: [50 / 5, 50 / 5, 50 / 5, 50 / 5, 50 / 5, 50],
        rotation: 90,
        text: ['VERY HIGH!', 'High', 'Average', 'Low',
            'VERY LOW!'],
        textinfo: 'text',
        textposition: 'inside',
        marker: {
            colors: ['rgba(rgba(0, 255, 0, .75)',
                'rgba(200, 255, 150, .75)', 'rgba(255, 255, 42, .75)',
                'rgba(255, 140, 0, .75)', 'rgba(255, 0, 0, .75)',
                'rgba(255, 255, 255, 0)']
        },
        labels: ['more than 9', 'more than 6 to 8', 'more than 4 to 6', 'more than 2 to 4', '0 to 2', ''],
        hoverinfo: 'label',
        hole: .5,
        type: 'pie',
        showlegend: false
    }];

    var layout = {
        shapes: [{
            type: 'path',
            path: path,
            fillcolor: '850000',
            line: {
                color: '850000'
            }
        }],
        title: '<b>Belly Button Washing Frequency</b> <br> Frequency 0-10 times/week ',
        height: 400,
        width: 400,
        xaxis: {
            zeroline: false, showticklabels: false,
            showgrid: false, range: [-1, 1]
        },
        yaxis: {
            zeroline: false, showticklabels: false,
            showgrid: false, range: [-1, 1]
        }
    };

    Plotly.newPlot('wash-gauge', data, layout);



};
