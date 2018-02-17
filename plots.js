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
      buildTable(dates, openPrices, highPrices, lowPrices, closingPrices, volume);
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

function buildTable(dates, openPrices, highPrices, lowPrices, closingPrices, volume) {

  d3.select("tbody")
      .selectAll("li") // dont know if this is necesssary
      .enter()
      .append("tr")
      .html(function(d) {
        return `<td> ${dates} </td>
          <td> ${openPrices} </td>
          <td> ${highPrices} </td>
          <td> ${lowPrices} </td>
          <td> ${closingPrices} </td>
          <td> ${volume} </td>`;
      });
}

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

    Plotly.newPlot("plot", data, layout);

  });
}

buildPlot();

// BONUS - Dynamically add the current date to the report header
// YOUR CODE HERE
