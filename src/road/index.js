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

    if (classes[0] !== "svg-shimmed") {
      // Highlight map region
      const selectedPath = d3.select(".dashboard .map")
          .select("." + classes[0]);

      selectedPath.classed("roadMapHighlight", true);
      selectedPath.moveToFront();
      // Tooltip
      console.log("classes: ", classes);
      console.log("classes[0]: ", classes[0]);
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
// const vertical = d3.select("#annualTimeseries")
//     .append("div")
//     .attr("class", "linecursor")
//     .style("position", "absolute")
//     .style("z-index", "0")
//     .style("width", "2px")
//     .style("height", "310px")
//     .style("top", "60px")
//     .style("bottom", "70px")
//     .style("left", "0px")
//     .style("background", "#ccc");

d3.select("#annualTimeseries")
    .on("mousemove", function() {
      const innerWidth = 593.4; // svg width

      data[selected].map(function(d) {
        return d.date;
      });
      const bisectDate = d3.bisector(function(d) {
        return d.date;
      }).left;
      const chartData = data[selected];

      const yearRange = data[selected].map(function(d) {
        return parseInt(d.date);
      });

      const xDomain = d3.extent(yearRange);
      console.log("xDomain: ", xDomain);

      const x = d3.scaleTime().range([0, innerWidth]).domain(xDomain);
      const x0 = x.invert(d3.mouse(this)[0]);
      const i = bisectDate(chartData, x0);
      console.log(i);
      console.log("YEAR ", yearRange[i]);

      const thisGas = formatComma(data[selected].filter((item) => item.date === yearRange[i].toString())[0]["gas"] / scalef);
      const thisDiesel = formatComma(data[selected].filter((item) => item.date === yearRange[i].toString())[0]["diesel"] / scalef);
      const thisLPG = formatComma(data[selected].filter((item) => item.date === yearRange[i].toString())[0]["lpg"] / scalef);

      divArea.transition()
          .style("opacity", .9);
      divArea.html(
          "<b>" + "Fuel sales (" + i18next.t("units", {ns: "road"}) + ") in " + yearRange[i] + ":</b>" + "<br><br>" +
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
