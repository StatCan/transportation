import settings from "./stackedAreaSettings.js";
// import drawBubbles from "./drawbubbles.js";

const data = {};
let selected = "ATR";
let selectedComm = "meat";
let commFromRegion = selectedComm + "_from_" + selected;
let commToRegion = selectedComm + "_to_" + selected;

// const regions = ["ATR", "QC", "ON", "MB", "SK", "AB", "BC"];
const regions = ["ATR", "ON"];

const formatNumber = d3.format(","); // d3.format(".2f");
const format = function(d) {
  return formatNumber(d);
};

// ---------------------------------------------------------------------
// areaChart tooltip
const div = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// vertical line to help orient the user while exploring the streams
const vertical = d3.select("#tonnageDivId")
    .append("div")
    .attr("class", "remove")
    .style("position", "absolute")
    .style("z-index", "19")
    .style("width", "2px")
    .style("height", "500px")
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
const chartPair1 = d3.select("#pair1")
    .append("svg");
const chartPair2 = d3.select("#pair2")
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
    });
  } else {
    showArea();
  }
}

// ---------------------------------------------------------------------
function showArea() {
  areaChart(chartPair1, settings, data[commFromRegion]);
  // areaChart(chartPair2, settings, data[commToRegion]);
}


// ---------------------------------------------------------------------
// Landing page displays
i18n.load(["src/i18n"], function() {
  // display total regional tonnages
  // showRadar();

  d3.json("data/rail/rail_" + selectedComm + "_orig" + selected + "_all_dest.json", function(err, fileorig) {
    data[commFromRegion] = fileorig;
    let mousex;
    let year;

    // Read in chosen region as DESTINATION
    d3.json("data/rail/rail_" + selectedComm + "_all_orig_to_" + selected + ".json", function(err, filedest) {
      data[commToRegion] = filedest;

      // display annual tonnages for commFromRegion and commToRegion
      areaChart(chartPair1, settings, data[commFromRegion]);
      areaChart(chartPair2, settings, data[commToRegion]);

      // select layers of the areaChart
      chartPair1.selectAll(".data")
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
      d3.select("#tonnageDivId")
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
      // TO DO!!

      d3.select("#prevButton").classed("inactive", true);

      d3.select("#nextButton")
          .on("click", function() {
            count++;
            count === 0 ? d3.select("#prevButton").classed("inactive", true) :
                      d3.select("#prevButton").classed("inactive", false);

            // drawBubbles(rankedCommData, rankedCommNames, years, maxVal, count);
          });

      d3.select("#prevButton")
          .on("click", function() {
            count--;
            count === 0 ? d3.select("#prevButton").classed("inactive", true) :
                          d3.select("#prevButton").classed("inactive", false);

            // drawBubbles(rankedCommData, rankedCommNames, years, maxVal, count);
          });
    });
  });
});

$(document).on("change", uiHandler);
