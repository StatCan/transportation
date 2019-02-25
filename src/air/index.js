import settings from "./stackedAreaSettings.js";
import mapColourScaleFn from "../mapColourScaleFn.js";
import areaLegendFn from "../areaLegendFn.js";
import CopyButton from "../copyButton.js";

// const passengerMode = "passenger"; // TODO
// const majorAirportMode = "majorAirport"; // TODO

/* Copy Button */
// -----------------------------------------------------------------------------
const cButton = new CopyButton();
// -----------------------------------------------------------------------------

const data = {
  "passengers": {},
  "major_airports": {}
};


let totals;
let passengerTotals;
let majorTotals; // TODO
let canadaMap;
let selectedDataset = "passengers";

let selectedYear = "2017";
let selectedMonth = "01";
let selectedDate = selectedYear;
let selectedRegion = "CANADA"; // default region for areaChart

let selectedAirpt; // NB: NEEDS TO BE DEFINED AFTER canadaMap; see colorMap()
const lineData = {};


// which data set to use. 0 for passenger, 1 for movements/major airports
// let dataSet = 0; // TODO

const formatComma = d3.format(",d");
const scalef = 1e3;

// -----------------------------------------------------------------------------
/* SVGs */
const map = d3.select(".dashboard .map")
    .append("svg");
const movementsButton = d3.select("#major");
const passengerButton = d3.select("#movements");
const monthDropdown = d3.select("#months");
// map colour bar
const margin = {top: 20, right: 0, bottom: 10, left: 20};
const width = 510 - margin.left - margin.right;
const height = 150 - margin.top - margin.bottom;
const svgCB = d3.select("#mapColourScale")
    .select("svg")
    .attr("class", "airCB")
    .attr("width", width)
    .attr("height", height)
    .style("vertical-align", "middle");

const chart = d3.select(".data")
    .append("svg")
    .attr("id", "svg_areaChartAir");

// area chart legend
const svgLegend = d3.select("#areaLegend")
    .select("svg")
    .attr("class", "airAreaCB")
    .attr("width", 650)
    .attr("height", height)
    .style("vertical-align", "middle");

/* -- shim all the SVGs -- */
d3.stcExt.addIEShim(map, 387.1, 457.5);
d3.stcExt.addIEShim(svgCB, height, width);
d3.stcExt.addIEShim(svgLegend, height, 650);

// -----------------------------------------------------------------------------
/* letiables */
// For map circles
let path;
const defaultPointRadius = 1.3;
const defaultStrokeWidth = 0.5;

// const airportGroup = map.append("g");
let airportGroup;


let allAirports;

// -----------------------------------------------------------------------------
/* tooltip */
/* -- for map -- */
const div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
/* -- for areaChart 1 -- */
const divArea = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// -----------------------------------------------------------------------------
/* UI Handler */
$(".data_set_selector").on("click", function(event) {
  if (event.target.id === ("major")) {
    movementsButton
        .attr("class", "btn btn-primary major data_set_selector")
        .attr("aria-pressed", true);
    passengerButton
        .attr("class", "btn btn-default movements data_set_selector")
        .attr("aria-pressed", false);

    monthDropdown.style("visibility", "visible");
    selectedDate = selectedYear + "-" + selectedMonth;
    selectedDataset = "major_airports";
    totals = majorTotals;
    getData();
    showAreaData();
  }
  if (event.target.id === ("movements")) {
    movementsButton
        .attr("class", "btn btn-default major data_set_selector")
        .attr("aria-pressed", false);
    passengerButton
        .attr("class", "btn btn-primary movements data_set_selector")
        .attr("aria-pressed", true);

    monthDropdown.style("visibility", "hidden");
    selectedDate = selectedYear;
    selectedDataset = "passengers";
    totals = passengerTotals;
    getData();
    showAreaData();
  }
});
function uiHandler(event) {
  if (event.target.id === "groups") {
    // clear any map region that is highlighted
    d3.select(".map").selectAll("path").classed("airMapHighlight", false);

    selectedRegion = document.getElementById("groups").value;
    showAreaData();
  }
  if (event.target.id === "yearSelector") {
    selectedYear = document.getElementById("yearSelector").value;
    if (selectedDataset ==="major_airports") {
      selectedDate = selectedYear + "-" + selectedMonth;
    } else {
      selectedDate = selectedYear;
    }
    colorMap();
  }
  if (event.target.id === "monthSelector") {
    selectedMonth = document.getElementById("monthSelector").value;
    selectedDate = selectedYear + selectedMonth;
    colorMap();
  }
}

function getData() {
  if (!data[selectedDataset][selectedRegion]) {
    d3.json(`data/air/${selectedDataset}/${selectedRegion}.json`, (err, filedata) => {
      data[selectedDataset][selectedRegion] = filedata;
      showAreaData();
    });
  } else {
    showAreaData();
  }
}
// -----------------------------------------------------------------------------
/* Interactions */
/* -- Map interactions -- */
map.on("mouseover", () => {
  if (d3.select(d3.event.target).attr("class")) {
    // const classes = d3.event.target.classList;
    const classes = (d3.select(d3.event.target).attr("class") || "").split(" "); // IE-compatible

    if (classes[0] !== "svg-shimmed") {
      const key = i18next.t(classes[0], {ns: "airGeography"});

      if (key !== "airport") {
        // Highlight map region
        d3.select(".dashboard .map")
            .select("." + classes[0])
            .classed("airMapHighlight", true);
        // Tooltip
        const value = formatComma(totals[selectedDate][classes[0]] / 1e3);
        div.transition()
            .style("opacity", .9);
        div.html( // **** CHANGE ns WITH DATASET ****
            "<b>" + key + " (" + i18next.t("units", {ns: "airPassengers"}) + ")</b>"+ "<br><br>" +
              "<table>" +
                "<tr>" +
                  "<td><b>" + value + "</td>" +
            // "<td>" + " (" + units + ")</td>" +
                "</tr>" +
              "</table>"
        )
            .style("pointer-events", "none");
        div
            .style("left", ((d3.event.pageX +10) + "px"))
            .style("top", ((d3.event.pageY +10) + "px"));
      }
    }
  }
});

map.on("mouseout", () => {
  div.transition()
      .style("opacity", 0);

  if (selectedRegion) {
    d3.select(".map")
        .selectAll("path:not(." + selectedRegion + ")")
        .classed("airMapHighlight", false);
  } else {
    d3.select(".map")
        .selectAll("path")
        .classed("airMapHighlight", false);
  }
});

map.on("click", () => {
  // clear any previous clicks
  d3.select(".map")
      .selectAll("path")
      .classed("airMapHighlight", false);

  const transition = d3.transition().duration(1000);

  // User clicks on region
  if (d3.select(d3.event.target).attr("class") &&
        d3.select(d3.event.target).attr("class").indexOf("svg-shimmed") === -1) {
    const classes = (d3.select(d3.event.target).attr("class") || "").split(" "); // IE-compatible

    // ---------------------------------------------------------------------
    // Region highlight
    selectedRegion = classes[0];
    d3.select(".dashboard .map")
        .select("." + classes[0])
        .classed("airMapHighlight", true);
    // Display selected region in stacked area chart
    getData();
    // update region displayed in dropdown menu
    d3.select("#groups")._groups[0][0].value = selectedRegion;

    // ---------------------------------------------------------------------
    // zoom
    if (classes[0] !== "airport") { // to avoid zooming airport cirlces
      if (classes[1] === "zoomed" || (classes.length === 0)) {
        // return circles to original size
        path.pointRadius(function(d, i) {
          return defaultPointRadius;
        });
        d3.transition(transition).selectAll(".airport")
            .style("stroke-width", defaultStrokeWidth)
            .attr("d", path);
        return canadaMap.zoom();
      }
      path.pointRadius(function(d, i) {
        return 0.5;
      });
      d3.transition(transition).selectAll(".airport")
          .style("stroke-width", 0.1)
          .attr("d", path);

      canadaMap.zoom(classes[0]);
    }
  } else { // user clicks outside map
    // reset area chart to Canada
    selectedRegion = "CANADA";
    showAreaData();

    // update region displayed in dropdown menu
    d3.select("#groups")._groups[0][0].value = selectedRegion;
    // Chart titles
    updateTitles();

    if (d3.select("." + selectedRegion + ".zoomed")) {
      // clear zoom
      return canadaMap.zoom();
    }
  }

  // Chart titles
  updateTitles();
});

/* --  areaChart interactions -- */
// vertical line to attach to cursor
const vertical = d3.select("#annualTimeseries")
    .append("div")
    .attr("id", "infoDiv")
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
// let sectorType;
d3.select("#annualTimeseries")
    .on("mousemove", function() {
      const mouse = d3.mouse(this);
      const mousex = mouse[0];

      if (mousex < 599) { // restrict line from going off the x-axis
      // Find x-axis intervale closest to mousex
        idx = findXInterval(mousex);

        chart
            .on("mouseover", (d) => {
            // Tooltip
              const root = d3.select(d3.event.target);

              if (root._groups[0][0].__data__) {
                const thisArray = root._groups[0][0].__data__;
                if (thisArray[idx]) {
                  const thisYear = thisArray[idx];
                  thisValue = formatComma(thisYear[1] - thisYear[0]);
                  // const sectorType = i18next.t(root.attr("class").split(" ").slice(-1)[0], {ns: "airPassengers"});
                }
              }
            });

        const yearDict = {
          0: 2010, 1: 2011, 2: 2012, 3: 2013, 4: 2014, 5: 2015, 6: 2016, 7: 2017
        };

        if (thisValue) {
          const thisData = data[selectedDataset][selectedRegion];
          const thisDomestic = formatComma(thisData.filter((item) => item.date === yearDict[idx].toString())[0]["domestic"] / scalef);
          const thisTrans = formatComma(thisData.filter((item) => item.date === yearDict[idx].toString())[0]["trans_border"] / scalef);
          const thisInter = formatComma(thisData.filter((item) => item.date === yearDict[idx].toString())[0]["other_intl"] / scalef);
          divArea.transition()
              .style("opacity", .9);
          divArea.html(
              "<b>" + "Passenger movements (" + i18next.t("units", {ns: "airPassengers"}) + ") in " + yearDict[idx] + ":</b>" + "<br><br>" +
              "<table>" +
                "<tr>" +
                  "<td><b>" + i18next.t("domestic", {ns: "airPassengers"}) + "</b>: " + thisDomestic + "</td>" +
                "</tr>" +
                "<tr>" +
                  "<td><b>" + i18next.t("trans_border", {ns: "airPassengers"}) + "</b>: " + thisTrans + "</td>" +
                "</tr>" +
                "<tr>" +
                  "<td><b>" + i18next.t("other_intl", {ns: "airPassengers"}) + "</b>: " + thisInter + "</td>" +
                "</tr>" +
              "</table>"
          )
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY) + "px");
        }
      } // mousex restriction
    })
    .on("mouseout", function(d, i) {
    // Clear tooltip
      divArea.transition().style("opacity", 0);
    });

// -----------------------------------------------------------------------------
/* FNS */
/* -- plot circles on map -- */
const refreshMap = function() {
  path = d3.geoPath().projection(canadaMap.settings.projection)
      .pointRadius(defaultPointRadius);
  airportGroup.selectAll("path")
      .data(allAirports.features)
      .enter().append("path")
      .attr("d", path)
      .attr("id", (d, i) => {
        return "airport" + d.properties.id;
      })
      .attr("class", (d, i) => {
        return "airport " + d.properties.hasPlanedData;
      });
};

function colorMap() {
  const colourArray = ["#edf8fb", "#b3cde3", "#8c96c6", "#8856a7", "#810f7c"];

  let dimExtent = [];
  // map.selectAll("path").style("stroke", "black");

  const totArr = [];
  for (const sales of Object.keys(totals[selectedDate])) {
    totArr.push(totals[selectedDate][sales]);
  }

  // colour map to take data value and map it to the colour of the level bin it belongs to
  dimExtent = d3.extent(totArr);
  const colourMap = d3.scaleQuantile()
      .domain([dimExtent[0], dimExtent[1]])
      .range(colourArray);

  for (const key in totals[selectedDate]) {
    if (totals[selectedDate].hasOwnProperty(key)) {
      // d3.select(".dashboard .map")
      map
          .select("." + key).style("fill", colourMap(totals[selectedDate][key]));
    }
  }

  // colour bar scale and add label
  const mapScaleLabel = i18next.t("mapScaleLabel", {ns: "airPassengers"}) + " ("
    + i18next.t("units", {ns: "airPassengers"}) + ")";
  mapColourScaleFn(svgCB, colourArray, dimExtent);

  // Colourbar label (need be plotted only once)
  const label = d3.select("#mapColourScale").append("div").attr("class", "airmapCBlabel");
  if (d3.select(".airmapCBlabel").text() === "") {
    label
        .append("text")
        .text(mapScaleLabel);
  }

  // DEFINE AIRPORTGROUP HERE, AFTER CANADA MAP IS FINISHED, OTHERWISE
  // CIRCLES WILL BE PLOTTED UNDERNEATH THE MAP PATHS!
  airportGroup = map.append("g");

  // d3.stcExt.addIEShim(map, 387.1, 457.5);
}

/* -- stackedArea chart for Passenger or Major Airports data -- */
function showAreaData() {
  updateTitles();

  const showChart = () => {
    areaChart(chart, settings, data[selectedDataset][selectedRegion]);
    // Highlight region selected from menu on map
    d3.select(".dashboard .map")
        .select("." + selectedRegion)
        .classed("airMapHighlight", true);

    // ------------------copy button---------------------------------
    // need to re-apend the button since table is being re-build
    if (cButton.pNode) cButton.appendTo(document.getElementById("copy-button-container"));
    dataCopyButton(data[selectedDataset][selectedRegion]);
    // ---------------------------------------------------------------
  };

  if (!data[selectedDataset][selectedRegion]) {
    return d3.json(`data/air/passengers/${selectedRegion}.json`, (ptData) => {
      data[selectedDataset][selectedRegion] = ptData;
      showChart();
    });
  }
  showChart();
}

function filterDates(data) {
  for (const year in data) {
    if (data[year].date === selectedDate) {
      return data[year];
    }
  }
}
/* -- stackedArea chart for airports -- */
const showAirport = function() {
  if (!lineData[selectedAirpt]) {
    const fname = `data/air/${selectedDataset}/${selectedAirpt}.json`;
    return d3.json(fname, (aptData) => {
      if (aptData) {
        for (const year of aptData) {
          for (const key in year) {
            if (year[key]==="x" || year[key]==="..") {
              year[key]=0;
            }
          }
        }
        lineData[selectedAirpt] = aptData;
        const divData = filterDates(lineData[selectedAirpt]);
        div.transition()
            .style("opacity", .9);
        div.html( // **** CHANGE ns WITH DATASET ****
            "<b>placeholder title</b>"+ "<br><br>" +
              "<table>" +
                "<tr>" +
                  "<td><b> enplaned: " + divData.enplaned + " </td>" +
                  "<td><b> deplaned: " + divData.deplaned + "</td>" +
            // "<td>" + " (" + units + ")</td>" +
                "</tr>" +
              "</table>"
        )
            .style("pointer-events", "none");
        // Titles
        const fullName = i18next.t(selectedAirpt, {ns: "airports"});

        // airport table title
        d3.select("#chrt-dt-tbl1")
            .text(`Air passenger traffic at ${fullName}, (in thousands)`);
      }
    });
  }
  // airport chart title
  d3.select("#svg_aptChart")
      .select(".areaChartTitle")
      .text(i18next.t(selectedAirpt, {ns: "airports"}));
};

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

/* -- update map and areaChart titles -- */
function updateTitles() {
  const geography = i18next.t(selectedRegion, {ns: "airGeography"});
  d3.select("#mapTitleAir")
      .text(i18next.t("mapTitle", {ns: "airPassengers"}) + ", " + geography + ", " + selectedDate);
  d3.select("#areaTitleAir")
      .text(i18next.t("chartTitle", {ns: "airPassengers"}) + ", " + geography);
  settings.tableTitle = i18next.t("tableTitle", {ns: "airPassengers", geo: geography});
}

function plotLegend() {
  const classArray = ["domestic", "trans_border", "other_intl"];
  areaLegendFn(svgLegend, classArray);

  d3.select("#areaLegend")
      .selectAll("text")
      .text(function(d, i) {
        return i18next.t(classArray[i], {ns: "airPassengers"});
      });
}

// -----------------------------------------------------------------------------
/* Copy Button*/
function dataCopyButton(cButtondata) {
  const lines = [];
  const geography = i18next.t(selectedRegion, {ns: "airGeography"});
  const title = [i18next.t("tableTitle", {ns: "airPassengerAirports", geo: geography})];
  const columns = [""];

  for (const concept in cButtondata[0]) if (concept != "date") columns.push(i18next.t(concept, {ns: "airPassengers"}));

  lines.push(title, [], columns);

  for (const row in cButtondata) {
    if (Object.prototype.hasOwnProperty.call(cButtondata, row)) {
      const auxRow = [];

      for (const column in cButtondata[row]) {
        if (Object.prototype.hasOwnProperty.call(cButtondata[row], column)) {
          let value = cButtondata[row][column];

          if (column != "date" && column != "total" && !isNaN(value)) value /= 1000;
          auxRow.push(value);
        }
      }
      lines.push(auxRow);
    }
  }
  cButton.data = lines;
}
// -----------------------------------------------------------------------------

i18n.load(["src/i18n"], () => {
  settings.x.label = i18next.t("x_label", {ns: "airPassengers"}),
  settings.y.label = i18next.t("y_label", {ns: "airPassengers"}),
  d3.queue()
      .defer(d3.json, "data/air/passengers/Annual_Totals.json")
      .defer(d3.json, "data/air/major_airports/Annual_Totals.json")
      .defer(d3.json, "geojson/vennAirport_with_dataFlag.geojson")
      .await(function(error, passengerTotal, majorTotal, airports) {
        if (error) throw error;
        totals = passengerTotal;
        passengerTotals = passengerTotal;
        majorTotals = majorTotal;

        selectedYear, selectedDate = document.getElementById("yearSelector").value;
        selectedMonth = document.getElementById("monthSelector").value;
        canadaMap = getCanadaMap(map)
            .on("loaded", function() {
              allAirports = airports;

              colorMap();
              refreshMap();

              airportGroup.selectAll("path")
                  .on("mouseover", (d) => {
                    selectedAirpt = d.properties.id;
                    if (d.properties.hasPlanedData !== "noYears") {
                      showAirport();
                    }
                  });

              map.style("visibility", "visible");
              d3.select(".canada-map").moveToBack();
            });

        showAreaData();
        plotLegend();
        // Show chart titles based on default menu options
        updateTitles();

        // copy button options
        const cButtonOptions = {
          pNode: document.getElementById("copy-button-container"),
          title: i18next.t("CopyButton_Title", {ns: "CopyButton"}),
          msgCopyConfirm: i18next.t("CopyButton_Confirm", {ns: "CopyButton"}),
          accessibility: i18next.t("CopyButton_Title", {ns: "CopyButton"})
        };
        // build nodes on copy button
        cButton.build(cButtonOptions);
      });
});

$(document).on("change", uiHandler);
