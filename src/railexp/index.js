import settings from "./stackedAreaSettings.js";

const data = {};
let selected = "ATR";
let selected_comm = "meat";
let comm_from_reg = selected_comm + "_from_" + selected;
let comm_to_reg = selected_comm + "_to_" + selected;

const regions = ["ATR", "QC", "ON", "MB", "SK", "AB", "BC"];

var formatNumber = d3.format(",") ; // d3.format(".2f");
var format = function(d) {
  return formatNumber(d);
};

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
var margin_area = {top: 0, right: 0, bottom: 0, left: 50};
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
        return "rect " + d;
      })
      .attr("width", rect_dim)
      .attr("height", rect_dim)
       .attr("y", 5)
      .attr("x", function (d, i) {
        return margin_area.left + i * 100;
      });

rects
  .append("text")
  // .attr("class", "legendText")
  .attr("class", function(d) {
    return "legendText rect-" + d;
  })
  .attr("x", function (d, i) {
    return margin_area.left + 20 + i * 100;
  })
  .attr("y", 15)
  .text(function(d) {
    return d;
  });

rects
  .on("mouseover", function(d) {
    var selectedClass = d3.select(this)._groups[0][0].__data__;

    // highlight selected class in legend and timeseries chart
    d3.selectAll(".area:not( ." + selectedClass + ")").classed("inactive-region", true);
    d3.selectAll(".rect:not(." + selectedClass + ")").classed("inactive-region", true);
    d3.selectAll("text.legendText:not(.rect-" + selectedClass + ")").classed("inactive-region", true);
  })
  .on("mouseout", function(d) {
    // restore opacity
    d3.selectAll(".area").classed("inactive-region", false);
    d3.selectAll(".rect").classed("inactive-region", false);
    d3.selectAll("text.legendText").classed("inactive-region", false);
  })

// ---------------------------------------------------------------------
// areaChart tooltip
var div = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// vertical line to help orient the user while exploring the streams
var vertical = d3.select("#annualTimeseries")
      .append("div")
      .attr("class", "remove")
      .style("position", "absolute")
      .style("z-index", "19")
      .style("width", "2px")
      .style("height", "320px")
      .style("top", "10px")
      .style("bottom", "30px")
      .style("left", "0px")
      .style("background", "#ccc");
//TEMPORARY HACK UNTIL CAN OBTAIN AREACHART XSCALE
const mousex_dict = {
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
}
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
    selected_comm = document.getElementById("commodity").value;
  }
  if (event.target.id === "region") {
    selected = document.getElementById("region").value;
  }
  comm_from_reg = selected_comm + "_from_" + selected;
  comm_to_reg = selected_comm + "_to_" + selected;
  console.log("comm_from_reg: ", comm_from_reg)
  console.log("comm_to_reg: ", comm_to_reg)

    if (!data[comm_from_reg]) {
      // d3.json("data/rail/rail_meat_origATR_ON_BC_dest" + selected + ".json", function(err, filedata) {
        // Read in chosen region as ORIGIN
        d3.json("data/rail/rail_" + selected_comm + "_orig" + selected + "_all_dest.json", function(err, fileorig) {
          data[comm_from_reg] = fileorig;
          console.log("data as ORIG: ", data)

          // Read in chosen region as DESTINATION
          d3.json("data/rail/rail_" + selected_comm + "_all_orig_to_" + selected + ".json", function(err, filedest) {
            console.log("filedest: ", "rail_" + selected_comm + "_all_orig_to_" + selected + ".json")
            data[comm_to_reg] = filedest;
            console.log("data as DEST: ", data)

          showArea();
        });
      });
    } else {
      showArea();
    }
  // }
}

// ---------------------------------------------------------------------
function showArea() {
  areaChart(areaChartFromRegion, settings, data[comm_from_reg]);
  areaChart(areaChartToRegion, settings, data[comm_to_reg]);
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
 // display total regional tonnages
  showRadar();

  d3.json("data/rail/rail_" + selected_comm + "_orig" + selected + "_all_dest.json", function(err, fileorig) {
    data[comm_from_reg] = fileorig;
    console.log("data as ORIG: ", data)
    var mousex;
    var year;

    // Read in chosen region as DESTINATION
    d3.json("data/rail/rail_" + selected_comm + "_all_orig_to_" + selected + ".json", function(err, filedest) {
      console.log("filedest: ", "rail_" + selected_comm + "_all_orig_to_" + selected + ".json")
      data[comm_to_reg] = filedest;
      console.log("data as DEST: ", data) 

      // display annual tonnages for comm_from_reg and comm_to_reg
      areaChart(areaChartFromRegion, settings, data[comm_from_reg]);
      areaChart(areaChartToRegion, settings, data[comm_to_reg]);
      d3.selectAll(".area-label").style("display", "none");

      // select layers of the areaChart
      areaChartFromRegion.selectAll(".data")
        .selectAll("path.area")
        .on("mouseover", function(d, i) {
          var idx = i + 1;
          d3.selectAll(".area:not(.area" + idx + ")").classed("inactive-region", true);

          //Tooltip
          
          // console.log("mousex in tooltip: ", mousex);
          var region = d3.select(".area" + idx).attr("class").split("area area" + idx + " ")[1];
          const xarr = Object.keys(mousex_dict);
          for (let idx = 0; idx < xarr.length; idx++) {
            if (xarr[idx] > mousex) {
              year = mousex_dict[xarr[idx]];
              break;
            }
          }
          // console.log("year: ", year);
          // console.log("region: ", region);
          const value = d.filter((item) => item.data.year === year)[0].data[region];
          // console.log("value: ", value);

          div.transition()
            .style("opacity", .9)
            // div.html(region)
            div.html(
                "<b>" + year + "</b>"+ "<br><br>" +
                "<table>" +
                  "<tr>" + 
                    "<td>" + region + ": </td>" +
                  "<td><b>" + format(value) + " "  + " </td>" +
                  "<td>" + " " + " . Mtons" + "</td>" +
                  "</tr>" +
                "</table>"
            )
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY) + "px");
        })
        .on("mouseout", function(d, i) {
          d3.selectAll(".area").classed("inactive-region", false);
          //tooltip
          div.transition().style("opacity", 0);                
        });
      // select the areaChart itself for the vertical line
      d3.select("#annualTimeseries")
        .on("mousemove", function(){
           mousex = d3.mouse(this);
           mousex = mousex[0] + 5;
           vertical.style("left", mousex + "px" )})
        .on("mouseover", function(){
           mousex = d3.mouse(this);
           mousex = mousex[0] + 5;
           vertical.style("left", mousex + "px")});


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