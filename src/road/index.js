import settingsInit from "./stackedAreaSettings.js";
import mapColourScaleFn from "../mapColourScaleFn.js";
import fillMapFn from "../fillMapFn.js";
import areaLegendFn from "../areaLegendFn.js";
import areaTooltip from "../areaTooltip.js";
import createOverlay from "../overlay.js";
import CopyButton from "../copyButton.js";

const data = {};
let stackedArea; // stores areaChart() call
let mapData = {};
let selectedRegion = "CANADA";
let selectedYear = "2017";
const xlabelDY = 1.5; // spacing between areaChart xlabels and ticks

// Add number formatter to stackedArea settings file
const thisLang = document.getElementsByTagName("html")[0].getAttribute("lang");
const settingsAux = {
  formatNum: function() {
    let formatNumber;
    if (thisLang === "fr") {
      const locale = d3.formatLocale({
        decimal: ",",
        thousands: " ",
        grouping: [3]
      });
      formatNumber = locale.format(",d");
    } else {
      formatNumber = d3.format(",d");
    }

    const format = function(d) {
      if (Number(d)) {
        return formatNumber(d);
      } else {
        return d;
      }
    };
    return format;
  }
};

const settings = {...settingsInit, ...settingsAux};


/* Copy Button */
// -----------------------------------------------------------------------------
const cButton = new CopyButton();
// -----------------------------------------------------------------------------
/* SVGs */
// Fuel sales stacked area chart
const chart = d3.select(".data")
    .append("svg")
    .attr("id", "svgFuel");

// Canada map
const map = d3.select(".dashboard .map")
    .append("svg");

// Map colour bar
const margin = {top: 20, right: 0, bottom: 10, left: 20};
const width = 570 - margin.left - margin.right;
const height = 150 - margin.top - margin.bottom;
const svgCB = d3.select("#mapColourScale")
    .select("svg")
    .attr("class", "mapCB")
    .attr("width", width)
    .attr("height", height)
    .style("vertical-align", "middle");

// Area chart legend
const svgLegend = d3.select("#areaLegend")
    .select("svg")
    .attr("class", "roadAreaCB")
    .attr("width", 650)
    .attr("height", height)
    .style("vertical-align", "middle");

/* -- shim all the SVGs (chart is already shimmed in component) -- */
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
/* -- Map interactions -- */
map.on("mousemove", () => {
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
      const key = i18next.t(classes[0], {ns: "geography"});
      const value = settings.formatNum()(mapData[selectedYear][classes[0]]);
      div
          .style("opacity", .9);
      div.html(
          "<b>" + key + " (" + i18next.t("units", {ns: "road"}) + ")</b>"+ "<br><br>" +
            "<table>" +
              "<tr>" +
                "<td><b>" + value + "</td>" +
              "</tr>" +
            "</table>"
      );

      div
          .style("left", ((d3.event.pageX +10) + "px"))
          .style("top", ((d3.event.pageY +10) + "px"));
    } else {
      // clear tooltip for IE
      div
          .style("opacity", 0);
    }
  }
});

map.on("mouseout", () => {
  div.transition()
      .style("opacity", 0);

  if (selectedRegion) {
    d3.select(".map")
        .selectAll("path:not(." + selectedRegion + ")")
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

    selectedRegion = classes[0];
    d3.select(".dashboard .map")
        .select("." + classes[0])
        .classed("roadMapHighlight", true)
        .moveToFront();
    updateTitles();

    // Display selected region in stacked area chart
    loadData(selectedRegion, () => {
      showAreaData();
    });

    // update region displayed in dropdown menu
    d3.select("#groups")._groups[0][0].value = selectedRegion;
  } else {
    // reset area chart to Canada
    selectedRegion = "CANADA";
    updateTitles();
    showAreaData();

    // update region displayed in dropdown menu
    d3.select("#groups")._groups[0][0].value = selectedRegion;
  }
});

// -----------------------------------------------------------------------------
/* FNS */
function colorMap() {
  // store map data in array and plot colour
  const thisTotalArray = [];
  thisTotalArray.push(mapData[selectedYear]);

  const colourArray = ["#AFE2FF", "#72C2FF", "#bc9dff", "#894FFF", "#5D0FBC"];
  const numLevels = colourArray.length;

  // colour map with fillMapFn and output dimExtent for colour bar scale
  const dimExtent = fillMapFn(thisTotalArray, colourArray, numLevels);

  // colour bar scale and add label
  mapColourScaleFn(svgCB, colourArray, dimExtent, colourArray.length, settings);

  // Colourbar label (need be plotted only once)
  const mapScaleLabel = i18next.t("units", {ns: "road"});
  d3.select("#cbTitle")
      .select("text")
      .text(mapScaleLabel)
      .attr("transform", function(d, i) {
        return "translate(203, 15)";
      });
}

/* -- display areaChart -- */
function showAreaData() {
  stackedArea = areaChart(chart, settings, data[selectedRegion]);
  d3.select("#svgFuel").select(".x.axis")
      .select("text")
      .attr("display", "none");
  d3.select("#svgFuel").select(".x.axis").selectAll(".tick text").attr("dy", `${xlabelDY}em`);

  createOverlay(stackedArea, data[selectedRegion], (d) => {
    areaTooltip(stackedArea.settings, divArea, d);
  }, () => {
    divArea.style("opacity", 0);
  });

  // Highlight region selected from menu on map
  d3.select(".dashboard .map")
      .select("." + selectedRegion)
      .classed("roadMapHighlight", true)
      .moveToFront();

  updateTitles();
  plotLegend();
  cButton.appendTo(document.getElementById("copy-button-container"));
  dataCopyButton(data[selectedRegion]);
}

/* -- update map and areaChart titles -- */
function updateTitles() {
  const geography = i18next.t(selectedRegion, {ns: "geography"});
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
/* load data fn */
const loadData = function(selectedRegion, cb) {
  if (!data[selectedRegion]) {
    d3.json("data/road/" + selectedRegion + ".json", function(err, filedata) {
      data[selectedRegion] = filedata;
      cb();
    });
  } else {
    cb();
  }
};

/* uiHandler*/
function uiHandler(event) {
  if (event.target.id === "groups") {
    selectedRegion = document.getElementById("groups").value;

    // clear any map region that is highlighted
    d3.select(".map").selectAll("path").classed("roadMapHighlight", false);

    // Chart titles
    updateTitles();

    loadData(selectedRegion, () => {
      showAreaData();
    });
  }

  if (event.target.id === "year") {
    selectedYear = document.getElementById("year").value;
    d3.select("#mapTitleRoad")
        .text(i18next.t("mapTitle", {ns: "road", year: selectedYear}));
    colorMap();
  }
}

// -----------------------------------------------------------------------------
/* Copy Button*/
function dataCopyButton(cButtondataFull) {
  const lines = [];
  const geography = i18next.t(selectedRegion, {ns: "geography"});
  const title = [i18next.t("tableTitle", {ns: "roadArea", geo: geography})];
  const columns = [""];

  // filter out extra row added for data padding to areaChart
  let cButtondata = JSON.parse(JSON.stringify(cButtondataFull));
  cButtondata = cButtondataFull.filter((item) => {
    if (item.isLast === undefined) {
      return item;
    }
  });

  for (const concept in cButtondata[0]) if (concept != "date") columns.push(i18next.t(concept, {ns: "roadArea"}));

  lines.push(title, [], columns);

  for (const row in cButtondata) {
    if (Object.prototype.hasOwnProperty.call(cButtondata, row)) {
      const auxRow = [];

      for (const column in cButtondata[row]) {
        if (Object.prototype.hasOwnProperty.call(cButtondata[row], column)) {
          const value = cButtondata[row][column];

          if (column != "date" && column!= "total" && !isNaN(value)) value;

          auxRow.push(value);
        }
      }

      lines.push(auxRow);
    }
  }

  cButton.data = lines;
}

// -----------------------------------------------------------------------------
/* Initial page load */
i18n.load(["src/i18n"], () => {
  settings.x.label = i18next.t("x_label", {ns: "roadArea"}),
  settings.y.label = i18next.t("y_label", {ns: "roadArea"}),
  settings.tableTitle = i18next.t("tableTitle", {ns: "roadArea", geo: i18next.t(selectedRegion, {ns: "geography"})}),
  d3.queue()
      .defer(d3.json, "data/road/Annual_Totals.json")
      .defer(d3.json, "data/road/CANADA.json")
      .await(function(error, mapfile, areafile) {
        mapData = mapfile;
        data[selectedRegion] = areafile;

        getCanadaMap(map)
            .on("loaded", function() {
              colorMap();
            });

        d3.select("#mapTitleRoad")
            .text(i18next.t("mapTitle", {ns: "road", year: selectedYear}));

        // copy button options
        const cButtonOptions = {
          pNode: document.getElementById("copy-button-container"),
          title: i18next.t("CopyButton_Title", {ns: "CopyButton"}),
          msgCopyConfirm: i18next.t("CopyButton_Confirm", {ns: "CopyButton"}),
          accessibility: i18next.t("CopyButton_Title", {ns: "CopyButton"})
        };
        // build nodes on copy button
        cButton.build(cButtonOptions);

        showAreaData();
        plotLegend();
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
