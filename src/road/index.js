import settings from "./stackedAreaSettings.js";
import mapColourScaleFn from "../mapColourScaleFn.js";
import fillMapFn from "../fillMapFn.js";
import areaLegendFn from "../areaLegendFn.js";

const data = {};
let mapData = {};
let selected = "CANADA";
let selectedYear = "2017";
let overlayRect;
const formatComma = d3.format(",d");
const scalef = 1e3;


// -----------------------------------------------------------------------------
/* SVGs */
// fuel sales stacked area chart
const chart = d3.select(".data")
    .append("svg")
    .attr("id", "svgFuel");

//verticle line
let hoverLine = chart.append("line")
  .attr("class", "hoverLine")
  .style("display", "none")
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
let stackedChart;

// -----------------------------------------------------------------------------
/* Interactions */
/* -- Map interactions -- */
map.on("mouseover", () => {
  if (d3.select(d3.event.target).attr("class")) {
    // const classes = d3.event.target.classList;
    const classes = (d3.select(d3.event.target).attr("class") || "").split(" "); // IE-compatible

    // Highlight map region
    const selectedPath = d3.select(".dashboard .map")
        .select("." + classes[0])

    selectedPath.classed("roadMapHighlight", true);
    selectedPath.moveToFront();
    // Tooltip
    const key = i18next.t(classes[0], {ns: "roadGeography"});
    const value = formatComma(mapData[selectedYear][classes[0]] / 1e3);
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


let hoverValue;
let thisValue;
let fuelType;

// -----------------------------------------------------------------------------
/* FNS */
/* -- find year interval closest to cursor for areaChart tooltip -- */
function findAreaData(mousex) {
  const bisectDate = d3.bisector(function(d) {
    return d.date;
  }).left;
  const x0 = stackedChart.x.invert(mousex);
  const chartData = data[selected];
  let d;
  const i = bisectDate(chartData, x0.toISOString().substring(0, 4));

  const d0 = chartData[i - 1];
  const d1 = chartData[i];

  if (d0 && d1) {
    d = x0 - d0.date > d1.date - x0 ? d1 : d0;
  } else if (d0) {
    d = d0;
  }
  else{
    d = d1;
  }
  return d;
}

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
  stackedChart = areaChart(chart, settings, data[selected]);
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

/* -- mouse events for area chart-- */

function areaInteraction() {
  d3.select("#svgFuel .data")
      .on("mouseover", function(){
        divArea.transition()
            .style("opacity", .9);
        const mouse = d3.mouse(this);
        const mousex = mouse[0];
      })
      .on("mousemove", function() {
        const mouse = d3.mouse(this);
        const mousex = mouse[0];
        // Find x-axis intervale closest to mousex
        hoverValue = findAreaData(mousex);

        const thisGas = formatComma(hoverValue.gas / scalef);
        const thisDiesel = formatComma(hoverValue.diesel/ scalef);
        const thisLPG = formatComma(hoverValue.lpg/ scalef);

        divArea.html(
            "<b>" + "Fuel sales (" + i18next.t("units", {ns: "road"}) + ") in " + hoverValue.date + ":</b>" + "<br><br>" +
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
        stackedChart = areaChart(chart, settings, data[selected]);
        areaInteraction();
        plotLegend();

        overlayRect = d3.select("#svgFuel .data").append("rect")
          .style("fill", "none")
          .style("pointer-events", "all")
          .attr("class", "overlay")
          .on("mouseout", function() {
            hoverLine.style("display", "none");
          })
          .on("mousemove", function(){
            console.log(d3.mouse(this)[0])
            hoverLine.style("display", null);
            hoverLine.style("transform", "translate(" + d3.mouse(this)[0]+ "px)");
            hoverLine.moveToFront()
          });

        overlayRect
          .attr("width", stackedChart.settings.innerWidth)
          .attr("height", stackedChart.settings.innerHeight)

        hoverLine
          .attr("x1", stackedChart.settings.margin.left)
          .attr("x2", stackedChart.settings.margin.left)
          .attr("y1", stackedChart.settings.margin.top)
          .attr("y2", stackedChart.settings.innerHeight + stackedChart.settings.margin.top);

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
