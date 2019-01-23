import settings from "./stackedAreaSettings.js";

const data = {};
let selected = "ATR";
let selectedComm = "meat";
let commFromRegion = selectedComm + "_from_" + selected;
let commToRegion = selectedComm + "_to_" + selected;

const regions = ["ATR", "QC", "ON", "MB", "SK", "AB", "BC"];

const formatNumber = d3.format(","); // d3.format(".2f");
const format = function(d) {
  return formatNumber(d);
};

// ---------------------------------------------------------------------
// radarChart legend
const margin = {top: 0, right: 0, bottom: 0, left: 0};
const w = 380 - margin.left - margin.right;
const h = 40 - margin.top - margin.bottom;

const rlegendSVG = d3.select("#rLegend")
    .append("svg:svg")
    .attr("width", w)
    .attr("height", h)
    .style("vertical-align", "middle");
// Draw destination legend line
const lineOrig = rlegendSVG.append("g");
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

const lineDest = rlegendSVG.append("g");
lineDest
    .append("line")
    .attr("class", "dest")
    .attr("x1", 150) // 5
    .attr("y1", 7)
    .attr("x2", 195) // 50
    .attr("y2", 7);
lineDest
    .append("text")
    .attr("class", "legendText")
    .attr("x", 210)
    .attr("y", 10)
    .text("destination");

// ---------------------------------------------------------------------
// areaChart legend
const marginAreaSVG = {top: 0, right: 0, bottom: 0, left: 50};
const widthAreaSVG = 750 - marginAreaSVG.left - marginAreaSVG.right;
const heightAreaSVG = 40 - marginAreaSVG.top - marginAreaSVG.bottom;

const arealegendSVG = d3.select("#areaLegend")
    .append("svg:svg")
    .attr("width", widthAreaSVG)
    .attr("height", heightAreaSVG)
    .style("vertical-align", "middle");

const rects = arealegendSVG.selectAll("rect")
    .data(regions)
    .enter()
    .append("g");

const rectDim = 15;
rects.append("rect")
    .attr("class", function(d) {
      return "rect " + d;
    })
    .attr("width", rectDim)
    .attr("height", rectDim)
    .attr("y", 5)
    .attr("x", function(d, i) {
      return marginAreaSVG.left + i * 100;
    });

rects
    .append("text")
    .attr("class", function(d) {
      return "legendText forAreaChart rect-" + d;
    })
    .attr("x", function(d, i) {
      return marginAreaSVG.left + 20 + i * 100;
    })
    .attr("y", 15)
    .text(function(d) {
      return d;
    });

rects
    .on("mouseover", function(d) {
      const selectedClass = d3.select(this)._groups[0][0].__data__;

      // highlight selected class in legend and timeseries chart
      d3.selectAll(".area:not( ." + selectedClass + ")").classed("inactive-region", true);
      d3.selectAll(".rect:not(." + selectedClass + ")").classed("inactive-region", true);
      d3.selectAll("text.forAreaChart:not(.rect-" + selectedClass + ")").classed("inactive-region", true);
    })
    .on("mouseout", function(d) {
      // restore opacity
      d3.selectAll(".area").classed("inactive-region", false);
      d3.selectAll(".rect").classed("inactive-region", false);
      d3.selectAll("text.legendText").classed("inactive-region", false);
    });

// ---------------------------------------------------------------------
// areaChart tooltip
const div = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// vertical line to help orient the user while exploring the streams
const vertical = d3.select("#annualTimeseries")
    .append("div")
    .attr("class", "remove")
    .style("position", "absolute")
    .style("z-index", "19")
    .style("width", "2px")
    .style("height", "345px")
    .style("top", "10px")
    .style("bottom", "30px")
    .style("left", "0px")
    .style("background", "#ccc");
// TEMPORARY HACK UNTIL CAN OBTAIN AREACHART XSCALE
const mousexDict = {
  106: 2002,
  // 126: 2003,
  199: 2004,
  // 205: 2005,
  292: 2006,
  // 286: 2007,
  382: 2008,
  // 360: 2009,
  481: 2010,
  // 438: 2011,
  568: 2012,
  // 507: 2013,
  684: 2014,
  // 548: 2015,
  620: 2016
};
// ---------------------------------------------------------------------
/* globals areaChart */
const areaChartFromRegion = d3.select("#destTimeseries")
    .append("svg");
const areaChartToRegion = d3.select("#origTimeseries")
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
  if (event.target.id === "commodity") {
    selectedComm = document.getElementById("commodity").value;
  }
  if (event.target.id === "region") {
    selected = document.getElementById("region").value;
  }
  commFromRegion = selectedComm + "_from_" + selected;
  commToRegion = selectedComm + "_to_" + selected;

  if (!data[commFromRegion]) {
    // d3.json("data/rail/rail_meat_origATR_ON_BC_dest" + selected + ".json", function(err, filedata) {
    // Read in chosen region as ORIGIN
    d3.json("data/rail/rail_" + selectedComm + "_orig" + selected + "_all_dest.json", function(err, fileorig) {
      data[commFromRegion] = fileorig;

      // Read in chosen region as DESTINATION
      d3.json("data/rail/rail_" + selectedComm + "_all_orig_to_" + selected + ".json", function(err, filedest) {
        data[commToRegion] = filedest;

        showArea();
      });
    });
  } else {
    showArea();
  }
}

// ---------------------------------------------------------------------
function showArea() {
  areaChart(areaChartFromRegion, settings, data[commFromRegion]);
  areaChart(areaChartToRegion, settings, data[commToRegion]);
  d3.selectAll(".area-label").style("display", "none");

  // chart titles
  d3.select("#destTimeseriesTitle")
      .text("From " + i18next.t(selected, {ns: "regions"}) + ", all destinations");
  d3.select("#origTimeseriesTitle")
      .text("To " + i18next.t(selected, {ns: "regions"}) + ", all origins");
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

    // //Save sorted commodities in array
    // var sortedCommArray = filterYear.map(item => item.y);

    // //sort rawCommData according to string order in sortedCommArray
    // //??????????

    years = rawCommData.filter((item) => item.y === "wheat").map((item) => item.x);
    rawCommData.sort((a, b) => (a.value > b.value) ? -1 : ((b.value > a.value) ? 1 : 0));
    maxVal = rawCommData[0].value;

    // Commodities in descending order of yr 2016 value
    rankedCommNames = rawCommData.filter((item) => item.x === "2016").map((item) => item.y);

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
  // display total regional tonnages
  showRadar();

  d3.json("data/rail/rail_" + selectedComm + "_orig" + selected + "_all_dest.json", function(err, fileorig) {
    data[commFromRegion] = fileorig;
    let mousex;
    let year;

    // Read in chosen region as DESTINATION
    d3.json("data/rail/rail_" + selectedComm + "_all_orig_to_" + selected + ".json", function(err, filedest) {
      data[commToRegion] = filedest;

      // display annual tonnages for commFromRegion and commToRegion
      areaChart(areaChartFromRegion, settings, data[commFromRegion]);
      areaChart(areaChartToRegion, settings, data[commToRegion]);
      d3.selectAll(".area-label").style("display", "none");

      // chart titles
      d3.select("#destTimeseriesTitle")
          .text("From " + i18next.t(selected, {ns: "regions"}) + ", all destinations");
      d3.select("#origTimeseriesTitle")
          .text("To " + i18next.t(selected, {ns: "regions"}) + ", all origins");

      // select layers of the areaChart
      areaChartFromRegion.selectAll(".data")
          .selectAll("path.area")
          .on("mouseover", function(d, i) {
            const idx = i + 1;
            d3.selectAll(".area:not(.area" + idx + ")").classed("inactive-region", true);

            // Tooltip
            const region = d3.select(".area" + idx).attr("class").split("area area" + idx + " ")[1];
            const xarr = Object.keys(mousexDict);
            for (let idx = 0; idx < xarr.length; idx++) {
              if (xarr[idx] > mousex) {
                year = mousexDict[xarr[idx]];
                break;
              }
            }

            const value = d.filter((item) => item.data.year === year)[0].data[region];

            div.transition()
                .style("opacity", .9);
            div.html(
                "<b>" + year + "</b>"+ "<br><br>" +
                "<table>" +
                  "<tr>" +
                    "<td>" + region + ": </td>" +
                  "<td><b>" + format(value) + " " + " </td>" +
                  "<td>" + " " + " . Mtons" + "</td>" +
                  "</tr>" +
                "</table>"
            )
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px");
          })
          .on("mouseout", function(d, i) {
            d3.selectAll(".area").classed("inactive-region", false);
            // tooltip
            div.transition().style("opacity", 0);
          });
      // select the areaChart itself for the vertical line
      d3.select("#annualTimeseries")
          .on("mousemove", function() {
            mousex = d3.mouse(this);
            mousex = mousex[0] + 5;
            vertical.style("left", mousex + "px" );
          })
          .on("mouseover", function() {
            mousex = d3.mouse(this);
            mousex = mousex[0] + 5;
            vertical.style("left", mousex + "px");
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
});

$(document).on("change", uiHandler);
