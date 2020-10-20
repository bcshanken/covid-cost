$(document).ready(function () {
  // JS Variables


    var stockLevel = "";
    var stockName = "";
    var timePeriod = "";

    var covidData = []

    var chartStockData = [];


  // event listener
  $("#stockSubmitBtn").on("click", function (event) {
    event.preventDefault();
    stockLevel = $(this).parent().find("#stockPoint").val();
    stockName = $(this).parent().find("#stockInput").val().toUpperCase();
    timePeriod = $(this).parent().find("#stockTime").val();
    stockNameUpdate();

    // Converting the user dropdown selection to the needed value for the API call requirements
    if (timePeriod === "1 Month") {
      var timeReplace = timePeriod.replace("1 Month", "1m");
    } else if (timePeriod === "3 Month") {
      timeReplace = timePeriod.replace("3 Month", "3m");
    } else if (timePeriod === "6 Month") {
      timeReplace = timePeriod.replace("6 Month", "6m");
    } else if (timePeriod === "1 Year") {
      timeReplace = timePeriod.replace("1 Year", "1y");
    }

    console.log(timeReplace);

    covidAPI();

    console.log(stockName);
    console.log(stockLevel);
    stockAPI(stockName, timeReplace);
  });

  // modal
  $("#myModal").on("shown.bs.modal", function () {
    $("#myInput").trigger("focus");
  });

  // Stock Chart comments name update

  function stockNameUpdate() {
    $("#stockChartComments").text(stockName + " Chart Metrics");
    $("#stockChartHead").text(stockName + " Prices over Time");
  }

  // iex api

  function stockAPI(userStock, userTime) {
    var stocksUrl =
      "https://sandbox.iexapis.com/stable/stock/" +
      userStock +
      "/chart/" +
      userTime +
      "/?token=Tsk_91ce3ae3fe794e6db9ebe0705266abf6";

    $.ajax({
      url: stocksUrl,
      method: "GET",
    }).then(function (response) {
      console.log(response);

      // Creating empty arrays to later push response to based on user validation
      var stockLevelArray = [];
      var stockData;


      // If stock level is open push the response into the stockLevelArray
      if (stockLevel === "Open") {
        for (var i = 0; i < response.length; i++) {
          stockData = response[i].open;
          stockLevelArray.push(stockData);

          chartStockData.push({date: moment(response[i].date).format("ll"), stockData: response[i].open})

        }
        console.log(chartStockData)
        console.log(stockLevelArray);

        // If stock level is closing push the response into the stockLevelArray
      } else if (stockLevel === "Closing") {
        for (var i = 0; i < response.length; i++) {
          stockData = response[i].close;
          stockLevelArray.push(stockData);

          chartStockData.push({date: moment(response[i].date).format("ll"), stockData: response[i].close})

        }
        console.log(chartStockData)
        console.log(stockLevelArray);

        // If stock level is high push the response into the stockLevelArray
      } else if (stockLevel === "High") {
        for (var i = 0; i < response.length; i++) {
          stockData = response[i].high;
          stockLevelArray.push(stockData);

          chartStockData.push({date: moment(response[i].date).format("ll"), stockData: response[i].high})

        }
        console.log(chartStockData)
        console.log(stockLevelArray);
      }
      // finding max Min
      $("#stockMax").text("Max Value: $"+Math.max(...stockLevelArray))
      $("#stockMin").text("Min Value: $"+Math.min(...stockLevelArray))
      // finding average
      console.log("the min is " + Math.min(...stockLevelArray));
      var total= 0;
      var avg = 0;
      var innerSumUpper =0;
      for (i=0;i<stockLevelArray.length;i++){
        total += parseInt(stockLevelArray[i]);
      }
      // finding standard Deviation
      avg = total/stockLevelArray.length;
      $("#stockAvg").text("Average Value: $"+Math.max(...stockLevelArray))
      for (i=0;i<stockLevelArray.length;i++){
        innerSumUpper+=(stockLevelArray[i]-avg)*(stockLevelArray[i]-avg);
         
      }
      
      $("#stockStd").text("Standard Deviation: $"+Math.floor(Math.sqrt(innerSumUpper/stockLevelArray.length)*100)/100)
    });
  }

  // covid API
  function covidAPI() {
    // api link, with endpoint of cases per day
    var settings = {
      url:
        "https://api.covid19api.com/total/country/united-states/status/confirmed?cases",
      method: "GET",
      timeout: 0,
    };

    $.ajax(settings).done(function (response) {
      console.log(response);
      // pulls the amount of cases everyday for the last month
      function oneMonth() {
        var month = [];
        covidData = [];
        for (i = 1; i <= 30; i++) {
          month.push(response.length - i);
        }
        for (i = 0; i < month.length; i++) {
          covidData.push({
            date: moment(response[month[i]].Date).format("ll"),
            cases: response[month[i]].Cases
          })
        }
        covidData = covidData.reverse();
        console.log(covidData);
      }

      // pulls the amount of cases everyday for the last 3 months
      function threeMonths() {
        var three = [];
        covidData = [];
        for (i = 1; i <= 90; i++) {
          three.push(response.length - i);
        }
        for (i = 0; i < three.length; i++) {
          covidData.push({
            date: moment(response[three[i]].Date).format("ll"),
            cases: response[three[i]].Cases
          })
        }
        covidData = covidData.reverse();
        console.log(covidData);
      }

      // pulls the amount of cases everyday for the last 6 months
      function sixMonths() {
        var six = [];
        covidData = [];
        for (i = 1; i <= 180; i++) {
          six.push(response.length - i);
        }
        for (i = 0; i < six.length; i++) {
          covidData.push({
            date: moment(response[six[i]].Date).format("ll"),
            cases: response[six[i]].Cases
          })
        }
        covidData = covidData.reverse();
        console.log(covidData);
      }

      // pulls data for all days of corona, starting on Jan 22, 2020 (first case)
      function oneYear() {
        covidData = [];
        for (i = 0; i < response.length; i++) {
          covidData.push({
            date: moment(response[i].Date).format("ll"),
            cases: response[i].Cases
          })
        }
        console.log(covidData);
      }

      // depending on users choice in the dropdown, a timeframe function is ran
      if (timePeriod == "1 Month") {
        oneMonth();
      } else if (timePeriod == "3 Month") {
        threeMonths();
      } else if (timePeriod == "6 Month") {
        sixMonths();
      } else {
        oneYear();
      }
    });
  }

  // stockAPI();

  // createGraph
  var ctxOne = $("#ctxOne");
  var ctxTwo = $("#ctxTwo");

  displayGraph([{ t: new Date("2020-01-20") , y: 9}, { t: new Date("2020-02-10") , y: 3}, { t: new Date("2020-03-10") , y: 3}, { t: new Date("2020-04-5") , y: 5}], ctxOne);
  //displayGraph([12, 19, 3, 5, 2, 3, 20, 33, 9, 10, 11, 12], ctxTwo);

  function displayGraph(data, chartNumber) {
    var myChart = new Chart(chartNumber, {
      type: "line", 
      data: {
        datasets: [
          {
            data: data,
            backgroundColor: "#69ea85",
            borderColor: "#1abe3e",
            borderWidth: 5,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              gridLines: {
                color: "gray",
              },
              ticks: {
                fontColor: "whitesmoke",
              },
            },
          ],
          xAxes: [
            {
              type: "time",
              time: {
                unit: "day",
                displayFormats: {
                  month: "MMM YYYY"
                  }
                },
              gridLines: {
                display: false,
              },
              ticks: {
                fontColor: "whitesmoke",
              },
            },
          ],
        },
      },
    });
  }
});
