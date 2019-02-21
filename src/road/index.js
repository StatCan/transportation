import settings from "./stackedAreaSettings.js";
import mapColourScaleFn from "../mapColourScaleFn.js";
import fillMapFn from "../fillMapFn.js";
import areaLegendFn from "../areaLegendFn.js";

const data = {};
let mapData = {};
let selected = "CANADA";
let selectedYear = "2017";
const formatComma = d3.format(",d");
const scalef = 1e3;

// -----------------------------------------------------------------------------
/* SVGs */
// fuel sales stacked area chart
const chart = d3.select(".data")
    .append("svg")
    .attr("id", "svgFuel");
// Canada map
const map = d3.select(".dashboard .map")
    .append("svg");

// map colour bar
const margin = {top: 20, right: 0, bottom: 10, left: 20};
const width = 510 - margin.left - margin.right;
const height = 150 - margin.top - margin.bottom;
const svgCB = d3.select("#mapColourScale")
    .select("svg")
    .attr("class", "roadCB")
    .attr("width", width)
    .attr("height", height)
    .style("vertical-align", "middle");


// area chart legend
const svgLegend = d3.select("#areaLegend")
    .select("svg")
    .attr("class", "roadAreaCB")
    .attr("width", 650)
    .attr("height", height)
    .style("vertical-align", "middle");

/* -- shim all the SVGs -- */
d3.stcExt.addIEShim(map, 387.1, 457.5);
d3.stcExt.addIEShim(svgCB, height, width);
d3.stcExt.addIEShim(svgLegend, height, 650);

// -----------------------------------------------------------------------------
/* tooltip */
const div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
const divArea = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


// -----------------------------------------------------------------------------
/* Interactions */
/* -- Map interactions -- */
map.on("mouseover", () => {
  if (d3.select(d3.event.target).attr("class")) {
    // const classes = d3.event.target.classList;
    const classes = (d3.select(d3.event.target).attr("class") || "").split(" "); // IE-compatible

    // Highlight map region
    const selectedPath = d3.select(".dashboard .map")
        .select("." + classes[0]);

    selectedPath.classed("roadMapHighlight", true);
    selectedPath.moveToFront();
    // Tooltip
    const key = i18next.t(classes[0], {ns: "roadGeography"});
    const value = formatComma(mapData[selectedYear][classes[0]] / scalef);
    div.transition()
        .style("opacity", .9);
    div.html(
        "<b>" + key + " (" + i18next.t("units", {ns: "road"}) + ")</b>"+ "<br><br>" +
          "<table>" +
            "<tr>" +
              "<td><b>$" + value + "</td>" +
            // "<td>" + " (" + units + ")</td>" +
            "</tr>" +
          "</table>"
    );
  }
})
    .on("mousemove", () => {
      div
          .style("left", ((d3.event.pageX +10) + "px"))
          .style("top", ((d3.event.pageY +10) + "px"));
    }).on("mouseout", () => {
      div.transition()
          .style("opacity", 0);

      if (selected) {
        d3.select(".map")
            .selectAll("path:not(." + selected + ")")
            .classed("roadMapHighlight", false);
      } else {
        d3.select(".map")
            .selectAll("path")
            .classed("roadMapHighlight", false);
      }
    });
map.on("click", () => {
  // clear any previous clicks
  d3.select(".map")
      .selectAll("path")
      .classed("roadMapHighlight", false);

  if (d3.select(d3.event.target).attr("class") &&
        d3.select(d3.event.target).attr("class").indexOf("svg-shimmed") === -1) {
    const classes = (d3.select(d3.event.target).attr("class") || "").split(" "); // IE-compatible

    selected = classes[0];
    d3.select(".dashboard .map")
        .select("." + classes[0])
        .classed("roadMapHighlight", true);

    // Display selected region in stacked area chart
    if (!data[selected]) {
      d3.json("data/road/" + selected + ".json", function(err, filedata) {
        data[selected] = filedata;
        showData();
      });
    } else {
      showData();
    }
    // update region displayed in dropdown menu
    d3.select("#groups")._groups[0][0].value = selected;
  } else {
    // reset area chart to Canada
    selected = "CANADA";
    showData();

    // update region displayed in dropdown menu
    d3.select("#groups")._groups[0][0].value = selected;
  }
  // Chart titles
  updateTitles();
});

/* --  areaChart interactions -- */
// vertical line to attach to cursor
const vertical = d3.select("#annualTimeseries")
    .append("div")
    .attr("class", "linecursor")
    .style("position", "absolute")
    .style("z-index", "0")
    .style("width", "2px")
    .style("height", "310px")
    .style("top", "60px")
    .style("bottom", "70px")
    .style("left", "0px")
    .style("background", "#ccc");

let idx;
let thisValue;

d3.select("#annualTimeseries")
    .on("mousemove", function() {
      const innerWidth = 930; // GET FROM SETTINGS
      const mouse = d3.mouse(this);
      const mousex = mouse[0];

      // const parseDate = d3.utcParse("%Y");
      // console.log(data[selected].map(function(d) { return parseDate(d.date); }))
      // const bisectDate = d3.bisector(function(d) {
      //   console.log("d[0]: ", d[0])
      //   return d[0];
      // }).left;
      //
      // const formatValue = d3.format(",.2f");
      // const formatCurrency = function(d) { return "$" + formatValue(d); };
      //
      // const x = d3.scaleTime()
      //     .range([0, innerWidth]);
      //
      // // const xAxis = d3.axisBottom()
      // //     .scale(x)
      // //     .orient("bottom");
      // //
      // // var x0 = x.invert(d3.mouse(this)[0]);
      // // console.log("x0: ", x0)
      //
      //
      // const yearRange = data[selected].map(function(d) { return parseInt(d.date); });
      // console.log("yearRange: ", yearRange);
      //
      // const xDomain = d3.extent(yearRange);
      // console.log("xDomain: ", xDomain);


      // const xScale = d3.scaleTime().range([0, innerWidth]).domain(xDomain);

      //
      // console.log("mouse[0]: ", mouse[0])
      // const mousexScale = xScale.invert(mouse[0]);
      // // const mousexScale = chart.x.invert(mouse[0]);
      // console.log("mousexScale: ", mousexScale)
      // console.log("xScale(2015): ", xScale(2015));
      // console.log("xScale(mousexScale): ", xScale(mousexScale));
      //
      // const thisDate = bisectDate(data[selected], mousexScale);
      // console.log("thisDate: ", thisDate)

      if (mousex < 599) { // restrict line from going off the x-axis
        // Find x-axis intervale closest to mousex
        idx = findXInterval(mousex);

        chart
            .on("mousemove", (d) => {
              // Tooltip
              const root = d3.select(d3.event.target);

              if (root._groups[0][0].__data__) {
                const thisArray = root._groups[0][0].__data__;
                if (thisArray[idx]) {
                  const thisYear = thisArray[idx];
                  thisValue = formatComma(thisYear[1] - thisYear[0]);
                }
              }
            });

        const yearDict = {
          0: 2010, 1: 2011, 2: 2012, 3: 2013, 4: 2014, 5: 2015, 6: 2016, 7: 2017
        };

        if (thisValue) {
          const thisGas = formatComma(data[selected].filter((item) => item.date === yearDict[idx].toString())[0]["gas"] / scalef);
          const thisDiesel = formatComma(data[selected].filter((item) => item.date === yearDict[idx].toString())[0]["diesel"] / scalef);
          const thisLPG = formatComma(data[selected].filter((item) => item.date === yearDict[idx].toString())[0]["lpg"] / scalef);

          divArea.transition()
              .style("opacity", .9);
          divArea.html(
              "<b>" + "Fuel sales (" + i18next.t("units", {ns: "road"}) + ") in " + yearDict[idx] + ":</b>" + "<br><br>" +
              "<table>" +
                "<tr>" +
                  "<td><b>" + i18next.t("gas", {ns: "roadArea"}) + "</b>: $" + thisGas + "</td>" +
                "</tr>" +
                "<tr>" +
                  "<td><b>" + i18next.t("diesel", {ns: "roadArea"}) + "</b>: $" + thisDiesel + "</td>" +
                "</tr>" +
                "<tr>" +
                  "<td><b>" + i18next.t("lpg", {ns: "roadArea"}) + "</b>: $" + thisLPG + "</td>" +
                "</tr>" +
              "</table>"
          )
              .style("left", (d3.event.pageX) + 10 + "px")
              .style("top", (d3.event.pageY) + 10 + "px")
              .style("pointer-events", "none");
        }
      } // mousex restriction
    })
    .on("mouseout", function(d, i) {
      // Clear tooltip
      divArea.transition().style("opacity", 0);
    });

// -----------------------------------------------------------------------------
/* FNS */
function colorMap() {
  // store map data in array and plot colour
  const thisTotalArray = [];
  thisTotalArray.push(mapData[selectedYear]);

  const colourArray = ["#AFE2FF", "#72C2FF", "#bc9dff", "#894FFF", "#5D0FBC"];

  // colour map with fillMapFn and output dimExtent for colour bar scale
  const dimExtent = fillMapFn(thisTotalArray, colourArray);

  // colour bar scale and add label
  const mapScaleLabel = i18next.t("mapScaleLabel", {ns: "road"}) + " (" + i18next.t("units", {ns: "road"}) + ")";
  mapColourScaleFn(svgCB, colourArray, dimExtent);
  d3.select("#cbID").text(mapScaleLabel);

  // d3.stcExt.addIEShim(map, 387.1, 457.5);
}

/* -- display areaChart -- */
function showData() {
  areaChart(chart, settings, data[selected]);
  d3.select("#svgFuel").select(".x.axis")
      .select("text")
      // .attr("dy", xaxisLabeldy)
      .attr("display", "none");

  // Highlight region selected from menu on map
  d3.select(".dashboard .map")
      .select("." + selected)
      .classed("roadMapHighlight", true);

  updateTitles();
  plotLegend();
}

/* -- update map and areaChart titles -- */
function updateTitles() {
  const geography = i18next.t(selected, {ns: "roadGeography"});
  d3.select("#mapTitleRoad")
      .text(i18next.t("mapTitle", {ns: "road"}) + ", " + geography + ", " + selectedYear);
  d3.select("#areaTitleRoad")
      .text(i18next.t("chartTitle", {ns: "road"}) + ", " + geography);
  settings.tableTitle = i18next.t("tableTitle", {ns: "roadArea", geo: geography});
}

function plotLegend() {
  const classArray = ["gas", "diesel", "lpg"];
  areaLegendFn(svgLegend, classArray);

  d3.select("#areaLegend")
      .selectAll("text")
      .text(function(d, i) {
        return i18next.t(classArray[i], {ns: "roadArea"});
      });
}

/* -- find year interval closest to cursor for areaChart tooltip -- */
function findXInterval(mousex) {
  // const xref = [0.0782, 137.114, 274.150, 411.560, 548.60, 685.630, 822.670];
  const xref = [62, 149, 234, 321, 404, 491, 576];
  const xrefMid = [xref[0] + (xref[1] - xref[0])/2, xref[1] + (xref[1] - xref[0])/2,
    xref[2] + (xref[1] - xref[0])/2, xref[3] + (xref[1] - xref[0])/2,
    xref[4] + (xref[1] - xref[0])/2, xref[5] + (xref[1] - xref[0])/2,
    xref[6] + (xref[1] - xref[0])/2];

  // Plot vertical line at cursor
  vertical.style("left", mousex + "px" );

  if ( mousex < xrefMid[0] ) {
    idx = 0;
  } else if ( mousex < xrefMid[1] ) {
    idx = 1;
  } else if ( mousex < xrefMid[2] ) {
    idx = 2;
  } else if ( mousex < xrefMid[3] ) {
    idx = 3;
  } else if ( mousex < xrefMid[4] ) {
    idx = 4;
  } else if ( mousex < xrefMid[5] ) {
    idx = 5;
  } else if ( mousex < xrefMid[6] ) {
    idx = 6;
  } else if ( mousex > xrefMid[6] ) {
    idx = 7;
  }
  return idx;
}

// -----------------------------------------------------------------------------
/* uiHandler*/
function uiHandler(event) {
  if (event.target.id === "groups") {
    selected = document.getElementById("groups").value;

    // clear any map region that is highlighted
    d3.select(".map").selectAll("path").classed("roadMapHighlight", false);
    // Chart titles
    updateTitles();

    if (!data[selected]) {
      d3.json("data/road/" + selected + ".json", function(err, filedata) {
        data[selected] = filedata;
        showData();
      });
    } else {
      showData();
    }
  }
  if (event.target.id === "year") {
    selectedYear = document.getElementById("year").value;
    updateTitles(); // update to reflect new menu selections for all charts
    colorMap();
  }
}

// -----------------------------------------------------------------------------
/* Initial page load */
i18n.load(["src/i18n"], () => {
  settings.x.label = i18next.t("x_label", {ns: "roadArea"}),
  settings.y.label = i18next.t("y_label", {ns: "roadArea"}),
  settings.tableTitle = i18next.t("tableTitle", {ns: "roadArea", geo: i18next.t(selected, {ns: "roadGeography"})}),
  d3.queue()
      .defer(d3.json, "data/road/Annual_Totals.json")
      .defer(d3.json, "data/road/CANADA.json")
      .await(function(error, mapfile, areafile) {
        mapData = mapfile;
        data[selected] = areafile;

        getCanadaMap(map)
            .on("loaded", function() {
              colorMap();
            });

        // Area chart and x-axis position
        areaChart(chart, settings, data[selected]);
        plotLegend();
        // Remove x-axis label
        d3.select("#svgFuel").select(".x.axis")
            .select("text")
            // .attr("dy", xaxisLabeldy)
            .attr("display", "none");

        // Show chart titles based on default menu options
        updateTitles();
      });
});

$(document).on("change", uiHandler);
d3.selection.prototype.moveToFront = function() {
  return this.each(function() {
    this.parentNode.appendChild(this);
  });
};
d3.selection.prototype.moveToBack = function() {
  return this.each(function() {
    const firstChild = this.parentNode.firstChild;
    if (firstChild) {
      this.parentNode.insertBefore(this, firstChild);
    }
  });
};
