import settings from "./stackedAreaSettings.js";

const data = {};
let selected = "ATR";
let selected_comm = "meat";
let comm_reg = "meat_for_QC";

const regions = ["ATR", "QC", "ON", "MB", "SK", "AB", "BC"];

// ---------------------------------------------------------------------
// const map = d3.select(".dashboard .map")
//     .append("svg");

// getCanadaMap(map).on("loaded", function() {
//   // highlight Atlantic region when landing on page
//   d3.select(".dashboard .map").select(".NB").style("fill", "#33850a");
//   d3.select(".dashboard .map").select(".NS").style("fill", "#33850a");
//   d3.select(".dashboard .map").select(".NL").style("fill", "#33850a");
//   d3.select(".dashboard .map").select(".PE").style("fill", "#33850a");
// });

// ---------------------------------------------------------------------
// radarChart legend
var margin = {top: 0, right: 0, bottom: 0, left: 0};
var w = 380 - margin.left - margin.right,
    h = 40 - margin.top - margin.bottom;

var rlegendSVG = d3.select("#rLegend")
            .append('svg:svg')
            .attr('width', w)
            .attr('height', h)
            .style("vertical-align", "middle");
// Draw destination legend line
var lineOrig = rlegendSVG.append('g');
lineOrig
      .append("line")
      .attr("class", "orig")
      .attr("x1", 5)
      .attr("y1", 7)
      .attr("x2", 50)
      .attr("y2", 7);
      
lineOrig
      .append("text")
      .attr("class", "legendText")
      // .style("fill","#565656")
      .attr("x", 60)
      .attr("y", 11)
      .text("origin");

var lineDest = rlegendSVG.append('g');
lineDest
      .append("line")
      .attr("class", "dest")
      .attr("x1", 150) //5
      .attr("y1", 7)
      .attr("x2", 195) //50
      .attr("y2", 7);
lineDest
      .append("text")
      .attr("class", "legendText")
      // .style("fill","#565656")
      .attr("x", 210)
      .attr("y", 10)
      .text("destination");

// ---------------------------------------------------------------------
// areaChart legend
var margin_area = {top: 0, right: 0, bottom: 0, left: 0};
var w_area = 750 - margin_area.left - margin_area.right,
    h_area = 40 - margin_area.top - margin_area.bottom;

var arealegendSVG = d3.select("#areaLegend")
            .append('svg:svg')
            .attr('width', w_area)
            .attr('height', h_area)
            .style("vertical-align", "middle");

var rects = arealegendSVG.selectAll('rect')
          .data(regions)
          .enter()
          .append('g');

var rect_dim = 15;
var appendedRects = rects.append("rect")
      .attr("class", function(d) {
        return d;
      })
      .attr("width", rect_dim)
      .attr("height", rect_dim)
       .attr("y", 5)
      .attr("x", function (d, i) {
        return i * 100;
      });

rects
  .append("text")
  // .attr("class", "legendText")
  .attr("class", function(d) {
    return "legendText rect-" + d;
  })
  .attr("x", function (d, i) {
    return 20 + i * 100;
  })
  .attr("y", 15)
  .text(function(d) {
    return d;
  });

// ---------------------------------------------------------------------
/* globals areaChart */
const origChart = d3.select("#destTimeseries")
    .append("svg");

// ---------------------------------------------------------------------
// global variables for drawBubbles fn
const rankedCommData = [];
let count = 0;
let years;
let maxVal;
let rankedCommNames; // temp

// ---------------------------------------------------------------------
function uiHandler(event) {
  console.log("event: ", event.target.id)
  if (event.target.id === "commodity") {
    selected_comm = document.getElementById("commodity").value;
  }
  if (event.target.id === "region") {
    selected = document.getElementById("region").value;
  }
  comm_reg = selected_comm + "_for_" + selected;

    if (!data[comm_reg]) {
      // d3.json("data/rail/rail_meat_origATR_ON_BC_dest" + selected + ".json", function(err, filedata) {
        d3.json("data/rail/rail_" + selected_comm + "_orig" + selected + "_all_dest.json", function(err, filedata) {
          console.log("fname: ", "rail_" + selected_comm + "_orig" + selected + "_all_dest.json")
        data[comm_reg] = filedata;
        console.log("data after d3json: ", data)
        showArea();
      });
    } else {
      showArea();
    }
  // }
}

// ---------------------------------------------------------------------
function showArea() {
  areaChart(origChart, settings, data[comm_reg]);
  d3.selectAll(".area-label").style("display", "none");
}

// ---------------------------------------------------------------------
function showComm() {
  // change area chart title to match selected province
  d3.select(".commTable h4")
      .text("Annual tonnages for all commodities, sorted by volume in 2016: " +
            i18next.t("ATR", {ns: "regions"}) +
            " to " + i18next.t("QC", {ns: "regions"}));

  // var rawCommData = [];
  d3.csv("data/rail/test_commdata_origATR_destQC_SUBSET.csv", function(error, rows) {
    const rawCommData = [];
    rows.forEach(function(d) {
      const x = d[""];
      delete d[""];
      for (var prop in d) {
        const y = prop,
          value = d[prop];
        rawCommData.push({
          x: y,
          y: x,
          value: +value
        });
      }
    });

    // //Extract data for only year 2016
    // var filterYear = rawCommData.filter(item => item.x === "2016");

    // //Sort these 2016 values
    // filterYear.sort((a,b) => (a.value > b.value) ? -1 : ((b.value > a.value) ? 1 : 0));
    // console.log("filterYear: ", filterYear)

    // //Save sorted commodities in array
    // var sortedCommArray = filterYear.map(item => item.y);
    // console.log("sortedCommArray: ", sortedCommArray)

    // //sort rawCommData according to string order in sortedCommArray
    // //??????????

    years = rawCommData.filter((item) => item.y === "wheat").map((item) => item.x);
    rawCommData.sort((a, b) => (a.value > b.value) ? -1 : ((b.value > a.value) ? 1 : 0));
    maxVal = rawCommData[0].value;
    console.log("maxVal: ", maxVal);

    // console.log("sorted Comm: ", rawCommData)
    // Commodities in descending order of yr 2016 value
    rankedCommNames = rawCommData.filter((item) => item.x === "2016").map((item) => item.y);
    // console.log("rankedCommNames: ", rankedCommNames)

    // var rankedCommData = [];
    for (let idx = 0; idx < rankedCommNames.length; idx++) {
      for (let jdx = 0; jdx < years.length; jdx++) {
        const thisVal = rawCommData.filter((item) => item.x === years[jdx] &&
                      item.y === rankedCommNames[idx]).map((item) => item.value)[0];
        rankedCommData.push( {"x": years[jdx], "y": rankedCommNames[idx], "value": thisVal} );
      }
    }

    // // List of all variables and number of them
    // var domain = d3.set(rankedCommData.map(function(d) { return d.x })).values()
    // var num = Math.sqrt(rankedCommData.length)

    drawBubbles(rankedCommData, rankedCommNames, years, maxVal, count);
  }); // end d3.csv
}

// ---------------------------------------------------------------------
// Landing page displays
i18n.load(["src/i18n"], function() {
  d3.queue()
      .defer(d3.json, "data/rail/rail_meat_origATR_all_dest.json")
      .await(function(error, data) {
        // display total regional tonnages
        showRadar();

        // display annual tonnages
        areaChart(origChart, settings, data);
        d3.selectAll(".area-label").style("display", "none");

        // areaChart tooltip
        var tooltip = d3.select("#annualTimeseries")
            .append("div")
            .attr("class", "tip")
            .style("position", "absolute")
            .style("z-index", "20")
            .style("visibility", "hidden")
            .style("top", 40 + "px");

        
        origChart.selectAll(".data")
          .selectAll("path.area")
          .on("mouseover", function(d, i) {
            var idx = i + 1;

            d3.selectAll(".area:not(.area" + idx + ")").classed("inactive", true);
           
            // console.log("this: ", d3.select(this).attr("class").split(/\s+/)[2])
            // console.log("select this: ", d3.select(this))
            // console.log("select this: ", d3.select(this).attr("class"))
            // var this_region = d3.select(this).attr("class").split(/\s+/)[2];

            // d3.selectAll("rect:not(." + this_region + ")")
            //   .classed("inactive", true);

            // d3.selectAll("text:not(." + this_region + ")")
            //   .classed("inactive", true);
            // d3.selectAll("g").filter(function(d) { return this.id.match(/foo/).length > 0; });


            tooltip
                .style("left", tipX(mousex) +"px")
                .html("something")
                .style("visibility", "visible");

           

          })
          .on("mouseout", function(d, i) {
          d3.selectAll(".area").classed("inactive", false);
                
          });
 


        // display sorted commodity bubble table
        showComm(); 

        d3.select("#prevButton").classed("inactive", true);

        d3.select("#nextButton")
            .on("click", function() {
              count++;
              count === 0 ? d3.select("#prevButton").classed("inactive", true) :
                        d3.select("#prevButton").classed("inactive", false);

              drawBubbles(rankedCommData, rankedCommNames, years, maxVal, count);
            });

        d3.select("#prevButton")
            .on("click", function() {
              count--;
              count === 0 ? d3.select("#prevButton").classed("inactive", true) :
                            d3.select("#prevButton").classed("inactive", false);

              drawBubbles(rankedCommData, rankedCommNames, years, maxVal, count);
            });
      });
});

$(document).on("change", uiHandler);