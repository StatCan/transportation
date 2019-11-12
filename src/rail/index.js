import settingsBar from "./settings_barChart.js";
import drawTable from "./railTable.js";
import mapColourScaleFn from "../mapColourScaleFn.js";
import fillMapFn from "../fillMapFnRail.js";
import dateRangeFn from "../api_request/get_date_range.js";
import apiCall from "../api_request/rail_api.js";
import CopyButton from "../copyButton.js";

const RailProductId = 23100062;

/* Copy Button */
// -----------------------------------------------------------------------------
const cButton = new CopyButton();
// -----------------------------------------------------------------------------
// import createLegend from "./createLegend.js";

const dateRange = {};
const defaultOrig = "AT";
const defaultDest = "QC";
const defaultComm = "mixed";
let selectedOrig;
let selectedDest;
let selectedComm;
let maxYear;
const minYear = 2010;
let dataTag; // stores `${selectedOrig}_${selectedComm}`;
const xlabelDY = 0.71; // spacing between areaChart xlabels and ticks
const usaMexicoImageLocation = "lib/usamexico.png";

const origin = "Origin";
const destination = "Dest";

const data = {}; // stores data for barChart
let selectedYear;

// ---------------------------------------------------------------------
/* SVGs */
// Canada map
const map = d3.select(".dashboard .map")
    .append("svg")
    .attr("focusable", "false");
const div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .attr("id", "railTooltip")
    .style("opacity", 0);

// Map colour bar
const margin = {top: 20, right: 0, bottom: 10, left: 20};
const width = 570 - margin.left - margin.right;
const height = 150 - margin.top - margin.bottom;
const svgCB = d3.select("#mapColourScale")
    .select("svg")
    .attr("focusable", "false")
    .attr("class", "mapCB")
    .attr("width", width)
    .attr("height", height)
    .style("vertical-align", "middle");

/* -- shim all the SVGs (chart is already shimmed in component) -- */
d3.stcExt.addIEShim(map, 387.1, 457.5);
d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

const chart = d3.select(".data.raildata")
    .append("svg")
    .attr("focusable", "false")
    .attr("id", "svgBar");

const commTable = d3.select("#commgrid")
    .append("svg")
    .attr("id", "svg_commgrid");

// ---------------------------------------------------------------------
/* load data fn */
// ---------------------------------------------------------------------
function uiHandler(event) {
  if (event.target.id === "commodity") {
    setCommodity(document.getElementById("commodity").value);
    updatePage();
  }
  if (event.target.id === "originGeo") {
    setOrigin(document.getElementById("originGeo").value);
    updatePage();
  }
  if (event.target.id === "destGeo") {
    setDest(document.getElementById("destGeo").value);
    updatePage();
  }
  if (event.target.id === "yearSelector") {
    setYear(document.getElementById("yearSelector").value);
    updatePage();
  }
}
// -----------------------------------------------------------------------------
/* -- Map interactions -- */

map.on("mousemove", () => {
  if (d3.select(d3.event.target).attr("id")) {
    // Tooltip
    const key = d3.event.target.id;
    let value;

    if (!isNaN(data[dataTag][selectedYear][key.substring(0, key.length - 4)])) {
      value = settingsBar.formatNum(data[dataTag][selectedYear][key.substring(0, key.length - 4)]) + " " + i18next.t("units", {ns: "rail"});
    } else {
      value = i18next.t("hoverNA", {ns: "rail"});
    }
    div
        .style("opacity", .9);
    div.html(
        "<b>" + i18next.t("hoverText", {ns: "rail", origin: i18next.t(selectedOrig, {ns: "rail"}), dest: i18next.t(key.substring(0, key.length-4), {ns: "rail"})}) + "</b>"+ "<br><br>" +
          "<table>" +
            "<tr>" +
              "<td><b>" + value + "</td>" +
            "</tr>" +
          "</table>"
    );

    div
        .style("left", ((d3.event.pageX +10) + "px"))
        .style("top", ((d3.event.pageY +10) + "px"));
  }
});

map.on("mouseout", () => {
  div
      .style("opacity", 0);
});
map.on("mousedown", () => {
  if (event.target.id !== "YT_map" && event.target.id !== "NU_map" && event.target.id !== "NT_map" && event.target.id !== "") {
    document.getElementById("originGeo").value = d3.event.target.id.substring(0, event.target.id.length -4);
    setOrigin(d3.event.target.id.substring(0, event.target.id.length -4));
    updatePage();
  }
});

// -----------------------------------------------------------------------------
/* FNS */
function updatePage() {
  if (!data[dataTag]) {
    apiCall(maxYear, minYear, selectedOrig).then(function(newData) {
      buildData(newData);
      showBarChartData();
      colorMap();
      drawTable(data[dataTag], settingsBar, selectedOrig);

      // ------------------copy button---------------------------------
      // need to re-apend the button since table is being re-build
      if (cButton.pNode) cButton.appendTo(document.getElementById("copy-button-container"));
      dataCopyButton(data[dataTag]);
      // ---------------------------------------------------------------
    });
  } else {
    showBarChartData();
    colorMap();
    drawTable(data[dataTag], settingsBar, selectedOrig);

    // ------------------copy button---------------------------------
    // need to re-apend the button since table is being re-build
    if (cButton.pNode) cButton.appendTo(document.getElementById("copy-button-container"));
    dataCopyButton(data[dataTag]);
    // ---------------------------------------------------------------
  }
}

function setYear(newYear) {
  selectedYear = newYear;
}
function setCommodity(newComm) {
  selectedComm = newComm;
  dataTag = `${selectedOrig}_${selectedComm}`;
}
function setOrigin(newOrig) {
  selectedOrig = newOrig;
  dataTag = `${selectedOrig}_${selectedComm}`;
  // Highlight region selected from menu on map
  highlightMap(newOrig, origin);
}
function setDest(newDest) {
  selectedDest = newDest;
}
function highlightMap(selection, mode) {
  d3.selectAll(`.dashboard .map .rail${mode}MapHighlight`)
      .classed(`rail${mode}MapHighlight`, false)
      .classed("railMapHighlight", false);

  d3.selectAll(`.dashboard .map #${selection}_map`)
      .classed(`rail${mode}MapHighlight`, true)
      .classed("railMapHighlight", true);

  d3.selectAll(".dashboard .map .railMapHighlight")
      .moveToFront();
}

function colorMap() {
  // store map data in array and plot
  const thisTotalObject ={};
  const thisTotalArray = [];

  for (const key in data[dataTag][selectedYear]) {
    if (key !== "All") {
      thisTotalObject[key] = (data[dataTag][selectedYear][key]);
    }
  }
  thisTotalArray.push(thisTotalObject);

  const colourArray = ["#AFE2FF", "#72C2FF", "#bc9dff", "#894FFF", "#5D0FBC"];
  const numLevels = colourArray.length;

  // colour map with fillMapFn and output dimExtent for colour bar scale
  const dimExtent = fillMapFn(thisTotalArray, colourArray, numLevels);

  // colour bar scale and add label
  // ADD LOGIC FOR 0 VALUE
  if (dimExtent[1] === 0) {
    mapColourScaleFn(svgCB, [colourArray[0]], dimExtent, 1, settingsBar);
  } else {
    mapColourScaleFn(svgCB, colourArray, dimExtent, colourArray.length, settingsBar);
  }


  // Colourbar label (need be plotted only once)
  const mapScaleLabel = i18next.t("units", {ns: "rail"});
  d3.select("#cbTitle")
      .select("text")
      .text(mapScaleLabel)
      .attr("transform", function(d, i) {
        return "translate(203, 15)";
      });
}

// ---------------------------------------------------------------------
/* -- display barChart -- */
function filterDataBar() {
  const d = data[dataTag];
  return [{
    category: `${this.selectedOrig}`,
    values: Object.keys(d).map((p) => {
      return {
        year: p,
        value: d[p][this.selectedDest]
      };
    })
  }];
}

function showBarChartData() {
  barChart(chart, {...aditionalBarSettings, selectedOrig, selectedDest});
  d3.select("#svgBar").select(".x.axis").selectAll(".tick text").attr("dy", `${xlabelDY}em`);
  updateTitles();
}

/* -- update map and areaChart titles -- */
function updateTitles() {
  const thisComm = i18next.t(selectedComm, {ns: "rail"});
  const tableComm = i18next.t(selectedComm, {ns: "railTable"});
  const thisOrig = i18next.t(selectedOrig, {ns: "geography"});
  const thisDest = i18next.t(selectedDest, {ns: "geography"});
  d3.select("#railTitleBarChart")
      .text(i18next.t("barChartTitle", {ns: "rail", commodity: thisComm, geo: i18next.t(("from" + selectedOrig), {ns: "rail"}), dest: i18next.t(("to" + selectedDest), {ns: "rail"})}));
  d3.select("#mapTitleRail")
      .text(i18next.t("mapTitle", {ns: "rail", commodity: thisComm, geo: i18next.t(("from" + selectedOrig), {ns: "rail"}), year: selectedYear}));
  settingsBar.tableTitle = i18next.t("tableTitle", {ns: "rail", comm: tableComm});

  drawTable(data[dataTag], settingsBar, selectedOrig);
}
const aditionalBarSettings = {
  ...settingsBar,
  filterData: filterDataBar
};
function dataCopyButton(cButtondata) {
  const thisTilteOrigin = i18next.t("from" + selectedOrig, {ns: "rail"});
  const finalArray = [];

  // for first data table
  const dataArray = [];
  const tableComm = i18next.t(selectedComm, {ns: "railTable"});
  const title = i18next.t("dataTableTitle", {ns: "rail", comm: tableComm, geo: thisTilteOrigin});
  const firstTitle = [title];
  for (const year in cButtondata) {
    const entry = {};
    entry.year = year;
    for (const geo in cButtondata[year]) {
      entry[geo] = cButtondata[year][geo];
    }
    dataArray.push(entry);
  }
  const mainData = formatForSpreadsheet(dataArray, firstTitle);
  finalArray.push(...mainData);
  finalArray.push([]);
  cButton.data = finalArray;
}
function formatForSpreadsheet(dataArray, title) {
  const lines = [];
  const columns = [""];

  for (const concept in dataArray[0]) if (concept != "year") {
    if (concept !== "isLast") {
      columns.push(i18next.t(concept, {ns: "rail"}));
    }
  }
  lines.push(title, [], columns);

  for (const row in dataArray) {
    if (Object.prototype.hasOwnProperty.call(dataArray, row)) {
      const auxRow = [];

      for (const column in dataArray[row]) {
        if (column !== "isLast") {
          if (Object.prototype.hasOwnProperty.call(dataArray[row], column)) {
            const value = dataArray[row][column];

            if (column != "year" && column != "total" && !isNaN(value)) value;
            if (column === "year") {
              auxRow.unshift(value);
            } else {
              auxRow.push(value);
            }
          }
        }
      }
      lines.push(auxRow);
    }
  }
  return lines;
}
// ---------------------------------------------------------------------
function pageInitWithData() {
  setOrigin(defaultOrig);
  setDest(defaultDest);
  setCommodity(defaultComm);
  getCanadaMap(map)
      .on("loaded", function() {
        // USA-MEXICO SVG

        // Place under alberta
        const usaMexOffset = document.getElementById("AB_map").getBBox();

        // create rectangle
        const usMex = map
            .append("g")
            .attr("id", "usa-mex-group");
        usMex
            .append("rect")
            .attr("width", 35)
            .attr("height", 11)
            .attr("x", usaMexOffset.x)
            .attr("y", (usaMexOffset.height + usaMexOffset.y +18 ))
            .attr("class", "USA-MX")
            .attr("id", "USA-MX_map");

        // create image
        usMex
            .append("image")
            .attr("width", 35)
            .attr("height", 15)
            .attr("x", usaMexOffset.x)
            .attr("y", (usaMexOffset.height + usaMexOffset.y +5 ))
            .attr("xlink:href", usaMexicoImageLocation)
            .attr("id", "USA-MX_map");
        d3.select("#mapColourScale").classed("moveMap", true);
        d3.select(".map").classed("moveMap", true);
        highlightMap(defaultOrig, origin);
        colorMap();
      });
  // copy button options
  const cButtonOptions = {
    pNode: document.getElementById("copy-button-container"),
    title: i18next.t("CopyButton_Title", {ns: "CopyButton"}),
    msgCopyConfirm: i18next.t("CopyButton_Confirm", {ns: "CopyButton"}),
    accessibility: i18next.t("CopyButton_Title", {ns: "CopyButton"})
  };
  // build nodes on copy button
  cButton.build(cButtonOptions);


  d3.select("#mapTitleRail")
      .text(i18next.t("mapTitle", {ns: "rail", commodity: i18next.t(selectedComm, {ns: "rail"}), geo: i18next.t("map" + selectedOrig, {ns: "rail"}), year: selectedYear}));
  d3.select("#symbolLink")
      .html(`<a href=${i18next.t("linkURL", {ns: "symbolLink"})}>${i18next.t("linkText", {ns: "symbolLink"})}</a>`);
  updatePage();
  updateTitles();
}
function buildData(returnData) {
  for (const item of returnData) {
    if (!data[`${item.origin}_${item.comm}`]) {
      const origCommPair = {};
      data[`${item.origin}_${item.comm}`] = origCommPair;
    }
    if (!data[`${item.origin}_${item.comm}`][item.date]) {
      const date = {};
      data[`${item.origin}_${item.comm}`][item.date]= date;
    }
    data[`${item.origin}_${item.comm}`][item.date][item.dest] = item.value;
  }
}
function dateInit(dateFnResult) {
  dateRange.min = minYear;
  dateRange.max = Number(dateFnResult.max);
  dateRange.numPeriods = dateFnResult.numPeriods;
  maxYear = dateFnResult.max;
  selectedYear = maxYear;
  const yearDropdown = $("#yearSelector");
  for (let i = dateRange.min; i<=dateRange.max; i++) {
    yearDropdown.append($("<option></option>")
        .attr("value", i).html(i));
  }
  selectedYear = dateRange.max;
  d3.select("#yearSelector")._groups[0][0].value = selectedYear;
}
// Landing page displays
i18n.load(["src/i18n"], function() {
  settingsBar.x.label = i18next.t("x_label", {ns: "railBar"}),
  settingsBar.y.label = i18next.t("y_label", {ns: "railBar"}),
  settingsBar.z.label = i18next.t("z_label", {ns: "railTable"}),
  dateRangeFn(minYear, 1, RailProductId, "1.1.1.0.0.0.0.0.0.0","year").then((result) => {
    dateInit(result);
    apiCall(maxYear, minYear, defaultOrig).then((returnedData) => {
      buildData(returnedData);
      pageInitWithData();
    });
  });
});



$(document).on("change", uiHandler);
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
