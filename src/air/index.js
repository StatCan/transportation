import settingsInit from "./stackedAreaSettings.js";
import settingsMajorAirportsInit from "./stackedAreaSettingsMajorAirports.js";
import mapColourScaleFn from "../mapColourScaleFn.js";
import fillMapFn from "../fillMapFn.js";
import areaTooltip from "../areaTooltip.js";
import createOverlay from "../overlay.js";
import dropdownCheck from "../dropdownCheck.js";
import CopyButton from "../copyButton.js";

/* Copy Button */
// -----------------------------------------------------------------------------
const cButton = new CopyButton();
// -----------------------------------------------------------------------------

const xlabelDY = 1.5; // spacing between areaChart xlabels and ticks

// Add number formatter to stackedArea settings file
const settingsAux = {
  _selfFormatter: i18n.getNumberFormatter(0),
  formatNum: function(...args) {
    return this._selfFormatter.format(args);
  }
};

const settings = {...settingsInit, ...settingsAux};
const settingsMajorAirports = {...settingsMajorAirportsInit, ...settingsAux};

const data = {
  "passengers": {},
  "major_airports": {}
};

const passengerDropdownData = [
  {
    "code": "CANADA",
    "type": "geo"
  },
  {
    "code": "NL",
    "type": "geo"
  },
  {
    "code": "YYT",
    "type": "airport"
  },
  {
    "code": "PE",
    "type": "geo"
  },
  {
    "code": "NS",
    "data": "no",
    "type": "geo"
  },
  {
    "code": "YHZ",
    "type": "airport"
  },
  {
    "code": "NB",
    "data": "no",
    "type": "geo"
  },
  {
    "code": "YQM",
    "type": "airport"
  },
  {
    "code": "QC",
    "type": "geo"
  },
  {
    "code": "YUL",
    "type": "airport"
  },
  {
    "code": "YQB",
    "type": "airport"
  },
  {
    "code": "ON",
    "type": "geo"
  },
  {
    "code": "YOW",
    "type": "airport"
  },
  {
    "code": "YYZ",
    "type": "airport"
  },
  {
    "code": "MB",
    "type": "geo"
  },
  {
    "code": "YWG",
    "type": "airport"
  },
  {
    "code": "SK",
    "type": "geo"
  },
  {
    "code": "AB",
    "type": "geo"
  },
  {
    "code": "YYC",
    "type": "airport"
  },
  {
    "code": "YEG",
    "type": "airport"
  },
  {
    "code": "BC",
    "type": "geo"
  },
  {
    "code": "YVR",
    "type": "airport"
  },
  {
    "code": "YYJ",
    "type": "airport"
  },
  {
    "code": "YT",
    "data": "no",
    "type": "geo"
  },
  {
    "code": "NT",
    "type": "geo"
  },
  {
    "code": "NU",
    "type": "geo"
  }
];

const majorDropdownData = [
  {
    "code": "CANADA",
    "type": "geo"
  },
  {
    "code": "NL",
    "type": "geo"
  },
  {
    "code": "YYT",
    "type": "airport"
  },
  {
    "code": "PE",
    "type": "geo"
  },
  {
    "code": "YYG",
    "type": "airport"
  },
  {
    "code": "NS",
    "type": "geo"
  },
  {
    "code": "YHZ",
    "type": "airport"
  },
  {
    "code": "NB",
    "type": "geo"
  },
  {
    "code": "YQM",
    "type": "airport"
  },
  {
    "code": "YFC",
    "type": "airport"
  },
  {
    "code": "YSJ",
    "type": "airport"
  },
  {
    "code": "QC",
    "type": "geo"
  },
  {
    "code": "YUL",
    "type": "airport"
  },
  {
    "code": "YQB",
    "type": "airport"
  },
  {
    "code": "YMX",
    "type": "airport"
  },
  {
    "code": "ON",
    "type": "geo"
  },
  {
    "code": "YOW",
    "type": "airport"
  },
  {
    "code": "YYZ",
    "type": "airport"
  },
  {
    "code": "YQT",
    "type": "airport"
  },
  {
    "code": "YXU",
    "type": "airport"
  },
  {
    "code": "MB",
    "type": "geo"
  },
  {
    "code": "YWG",
    "type": "airport"
  },
  {
    "code": "SK",
    "type": "geo"
  },
  {
    "code": "YQR",
    "type": "airport"
  },
  {
    "code": "YXE",
    "type": "airport"
  },
  {
    "code": "AB",
    "type": "geo"
  },
  {
    "code": "YYC",
    "type": "airport"
  },
  {
    "code": "YEG",
    "type": "airport"
  },
  {
    "code": "BC",
    "type": "geo"
  },
  {
    "code": "YVR",
    "type": "airport"
  },
  {
    "code": "YYJ",
    "type": "airport"
  },
  {
    "code": "YLW",
    "type": "airport"
  },
  {
    "code": "YXS",
    "type": "airport"
  },
  {
    "code": "YT",
    "type": "geo"
  },
  {
    "code": "YXY",
    "type": "airport"
  },
  {
    "code": "NT",
    "type": "geo"
  },
  {
    "code": "YZF",
    "type": "airport"
  },
  {
    "code": "NU",
    "type": "geo"
  },
  {
    "code": "YFB",
    "type": "airport"
  }
];

// -- vars that change with dropdown menu selections and toggle button -- //
let selectedDropdown = passengerDropdownData;

let totals;
let passengerTotals;
let majorTotals;
let canadaMap;

const majorDateRange = {};
const passengerDateRange = {};
const lineDataPassenger = {};
const lineDataMajor = {};
let passengerMetaData;
let majorMetaData;
let metaData;
let lineData = lineDataPassenger;

// -- store default values for selections -- //
const defaultYear = "2017";
const defaultRegion = "CANADA";
let selectedDataset = "passengers";
let selectedYear = "2017";
let selectedMonth = "01";
let selectedDate = selectedYear;
let selectedRegion = "CANADA";
let selectedSettings = settings;
let selectedDateRange = {};
let selectedAirpt; // NB: NEEDS TO BE DEFINED AFTER canadaMap; see colorMap()

let stackedArea; // stores areaChart() call

// -----------------------------------------------------------------------------
/* SVGs */
const map = d3.select(".dashboard .map")
    .attr("id", "map")
    .append("svg");
const movementsButton = d3.select("#major");
const passengerButton = d3.select("#movements");
const monthDropdown = d3.select("#months");
// map colour bar
const margin = {top: 0, right: 0, bottom: 10, left: 20};
const width = 570 - margin.left - margin.right;
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

/* -- shim all the SVGs -- */
d3.stcExt.addIEShim(map, 387.1, 457.5);
d3.stcExt.addIEShim(svgCB, height, width);

// -----------------------------------------------------------------------------
/* letiables */
// For map circles
let path;
const defaultPointRadius = 1.3;
const zoomedPointRadius = 0.9;

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
    .style("pointer-events", "none")
    .style("opacity", 0);

// -----------------------------------------------------------------------------
/* UI Handler */
$(".data_set_selector").on("click", function(event) {
  // Reset to defaults
  d3.select(".map").selectAll("path").classed("airMapHighlight", false);
  selectedYear = defaultYear;
  selectedRegion = defaultRegion;
  d3.select("#groups")._groups[0][0].value = selectedRegion;
  d3.select("#yearSelector")._groups[0][0].value = selectedYear;

  if (event.target.id === ("major")) {
    movementsButton
        .attr("class", "btn btn-primary major data_set_selector")
        .attr("aria-pressed", true);
    passengerButton
        .attr("class", "btn btn-default movements data_set_selector")
        .attr("aria-pressed", false);

    monthDropdown.style("visibility", "visible");
    selectedDataset = "major_airports";
    selectedDropdown = majorDropdownData;
    selectedSettings = settingsMajorAirports;

    selectedDateRange = majorDateRange;
    selectedDate = selectedDateRange.max;
    selectedMonth = selectedDate.substring(5, 7);
    selectedYear = selectedDate.substring(0, 4);
    d3.select("#yearSelector")._groups[0][0].value = selectedYear;
    d3.select("#monthSelector")._groups[0][0].value = selectedMonth;

    metaData = majorMetaData;
    lineData = lineDataMajor;
    createDropdown();
    totals = majorTotals;
    updateTitles();
    resetZoom();
    showAreaData();
    colorMap();
    refreshMap();
  }
  if (event.target.id === ("movements")) {
    movementsButton
        .attr("class", "btn btn-default major data_set_selector")
        .attr("aria-pressed", false);
    passengerButton
        .attr("class", "btn btn-primary movements data_set_selector")
        .attr("aria-pressed", true);

    monthDropdown.style("visibility", "hidden");
    selectedDataset = "passengers";
    selectedDropdown = passengerDropdownData;
    selectedSettings = settings;
    selectedDateRange = passengerDateRange;
    selectedDate = selectedDateRange.max;
    d3.select("#yearSelector")._groups[0][0].value = selectedYear;

    metaData = passengerMetaData;
    lineData = lineDataPassenger;
    createDropdown();

    totals = passengerTotals;
    updateTitles();
    resetZoom();
    showAreaData();
    colorMap();
    refreshMap();
  }
});
function uiHandler(event) {
  if (event.target.id === "groups") {
    // clear any map region that is highlighted
    d3.select(".map").selectAll("path").classed("airMapHighlight", false);
    selectedRegion = document.getElementById("groups").value;

    if (d3.select(`#airport${selectedRegion}`)._groups[0][0]) { // menu selection is an airport
      const zoomTo = d3.select(`#airport${selectedRegion}`).attr("class").split(" ")[1];

      canadaMap.zoom(zoomTo);
    } else if (selectedRegion === "CANADA") {
      resetZoom();
    } else { // zoom to selectedRegion
      canadaMap.zoom(selectedRegion);
    }

    showAreaData();
  }
  if (event.target.id === "yearSelector") {
    selectedYear = document.getElementById("yearSelector").value;
    // d3.select("#airportYQB")
    if (selectedDataset ==="major_airports") {
      const yearId = `#${"yearSelector"}`;
      const monthId = `#${"monthSelector"}`;
      selectedMonth = dropdownCheck(yearId, monthId, selectedDateRange, selectedYear, selectedMonth, true);
      selectedDate = selectedYear + "-" + selectedMonth;
    } else {
      selectedDate = selectedYear;
    }
    colorMap();
    refreshMap();
    updateTitles();
  }
  if (event.target.id === "monthSelector") {
    selectedMonth = document.getElementById("monthSelector").value;
    selectedDate = selectedYear + "-" + selectedMonth;
    colorMap();
    refreshMap();
    updateTitles();
  }
}

// -----------------------------------------------------------------------------
/* Interactions */
/* -- Map interactions -- */
map.on("mousemove", () => {
  if (d3.select(d3.event.target).attr("class")) {
    // const classes = d3.event.target.classList;
    const classes = (d3.select(d3.event.target).attr("class") || "").split(" "); // IE-compatible

    // if (classes[0] !== "svg-shimmed" && classes.indexOf("classNaN") === -1) {
    if (classes[0] !== "svg-shimmed") {
      const key = i18next.t(classes[0], {ns: "geography"});

      if (key !== "airport") {
        // Highlight map region
        d3.select(".dashboard .map")
            .select("." + classes[0])
            .classed("airMapHighlight", true)
            .moveToFront();

        // Tooltip
        let value;
        let line2;
        if (Number(totals[selectedDate][classes[0]])) {
          value = selectedSettings.formatNum(totals[selectedDate][classes[0]]);
          line2 = (selectedDataset === "passengers") ? `${value} ${i18next.t("units", {ns: "airPassengers"})}` :
            `${value} ${i18next.t("units", {ns: "airMajorAirports"})}`;
        } else {
          value = totals[selectedDate][classes[0]]; // "x"
          line2 = `${value}`;
        }

        div
            .style("opacity", .9);
        div.html(
            `<b> ${key} </b> <br><br>
              <table>
                <tr>
                  <td><b> ${line2} </td>
                </tr>
              </table>`
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
  div
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

map.on("mousedown", () => {
  if (!d3.select(d3.event.target).attr("class") || d3.select(d3.event.target).attr("class") === "svg-shimmed") {
    toCanada();
  }
  // Bruno : Minor modification here 2019-04-02
 else if (d3.select(d3.event.target).attr("class")) { // Do not allow NaN region to be clicked
    // clear any previous clicks
    d3.select(".map")
        .selectAll("path")
        .classed("airMapHighlight", false);

    // User clicks on region
    if (d3.select(d3.event.target).attr("class") &&
          d3.select(d3.event.target).attr("class").indexOf("svg-shimmed") === -1) {
      const classes = (d3.select(d3.event.target).attr("class") || "").split(" "); // IE-compatible
      if (classes[0] !== "airport") { // to avoid zooming airport cirlces
        // ---------------------------------------------------------------------
        // Region highlight
        selectedRegion = classes[0];
        // Display selected region in stacked area chart
        showAreaData();

        // upsdate region displayed in dropdown menu
        d3.select("#groups")._groups[0][0].value = selectedRegion;

        // ---------------------------------------------------------------------
        // zoom
        if (classes[0] !== "airport") { // to avoid zooming airport cirlces
          if (classes[1] === "zoomed" || (classes.length === 0)) {
            // return circles to original size
            path.pointRadius(function(d, i) {
              return defaultPointRadius;
            });

            return canadaMap.zoom();
          }
          path.pointRadius(function(d, i) {
            return zoomedPointRadius;
          });

          canadaMap.zoom(classes[0]);
        }
        // Chart titles
        updateTitles();
      }
    }
  }
});

// -----------------------------------------------------------------------------
const toCanada = function() {
  // reset area chart to Canada
  selectedRegion = "CANADA";
  showAreaData();

  // update region displayed in dropdown menu
  d3.select("#groups")._groups[0][0].value = selectedRegion;
  // Chart titles
  updateTitles();
  resetZoom();
};
/* -- map-related -- */
const resetZoom = function() {
  // clear any previous clicks
  d3.select(".map")
      .selectAll("path")
      .classed("airMapHighlight", false);

  // reset circle size
  path.pointRadius(function(d, i) {
    return defaultPointRadius;
  });

  if (d3.select("." + selectedRegion + ".zoomed")) {
    // clear zoom
    return canadaMap.zoom();
  }
};
/* -- plot circles on map -- */
const refreshMap = function() {
  // when circles are properly labeled add functionality to move grey dots to the background
  d3.selectAll(".airport").remove();
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
        if (metaData[selectedDate][d.properties.id]) {
          return `airport ${d.properties.province} ${selectedDataset} ${metaData[selectedDate][d.properties.id]}`;
        } else {
          return `airport ${d.properties.province} ${selectedDataset} dontShow`;
        }
      })
      .on("mouseover", (d) => {
        selectedAirpt = d.properties.id;
        showAirport();
      });

  // d3.selectAll(".noData").moveToBack();
};

function colorMap() {
  // last 2 colours for blank and NaN box
  const colourArray = [];
  if (selectedDataset === "passengers") {
    colourArray.push("#AFE2FF", "#72C2FF", "#bc9dff", "#894FFF", "#5D0FBC", "#F9F9F9", "#565656");
  } else {
    colourArray.push("#AFE2FF", "#72C2FF", "#bc9dff", "#894FFF", "#5D0FBC");
  }
  const numLevels = 5; // number of levels to divide colourbar into

  const totArr = [];
  totArr.push(totals[selectedDate]);

  // colour map to take data value and map it to the colour of the level bin it belongs to
  const dimExtent = fillMapFn(totArr, colourArray, numLevels);

  // colour bar scale and add label
  mapColourScaleFn(svgCB, colourArray, dimExtent, numLevels, selectedSettings);

  // DEFINE AIRPORTGROUP HERE, AFTER CANADA MAP IS FINISHED, OTHERWISE
  // CIRCLES WILL BE PLOTTED UNDERNEATH THE MAP PATHS!
  airportGroup = map.append("g");
}

/* -- stackedArea chart for Passenger or Major Airports data -- */
function showAreaData() {
  updateTitles();

  const showChart = () => {
    // Bruno : My new stuff on 2019-04-02
    let d = data[selectedDataset][selectedRegion];
    let allX = true;

    for (let i = 0; i < d.length; i++) {
      allX = allX && isNaN(d[i].domestic) && isNaN(d[i].transborder) && isNaN(d[i].international);
    }

    d3.select("#annualTimeseries").style("display", allX ? "none" : "");
    d3.select("#areaLegend").style("display", allX ? "none" : "");
    d3.select("#warning").style("display", allX ? "" : "none");
    // Bruno : End of my new stuff on 2019-04-02

    stackedArea = areaChart(chart, selectedSettings, data[selectedDataset][selectedRegion]);

    // areaChart hoverLine and tooltip
    createOverlay(stackedArea, data[selectedDataset][selectedRegion], (d) => {
      areaTooltip(stackedArea.settings, divArea, d);
    },
    () => {
      divArea.style("opacity", 0);
    });
    d3.selectAll(".flag").style("opacity", 0);
    d3.select("#svg_areaChartAir").select(".x.axis").selectAll(".tick text").attr("dy", `${xlabelDY}em`);

    // Add css class for month tick lines
    if (selectedDataset === "major_airports") {
      d3.select("#svg_areaChartAir .x.axis").selectAll("g.tick")
          .each(function(d, i) {
            const thisMonth = d.getMonth();
            if (thisMonth !== 0) {
              d3.select(this).attr("class", "tick notJan");
            } else {
              d3.select(this).attr("class", "tick Jan");
            }
          });
    } else {
      d3.select("#svg_areaChartAir .x.axis").selectAll("g.tick")
          .attr("class", "tick");
    }

    // Highlight region selected from menu on map
    d3.select(".dashboard .map")
        .select("." + selectedRegion)
        .classed("airMapHighlight", true)
        .moveToFront();

    // ------------------copy button---------------------------------
    // need to re-apend the button since table is being re-build
    if (cButton.pNode) cButton.appendTo(document.getElementById("copy-button-container"));
    dataCopyButton(data[selectedDataset][selectedRegion]);
    // ---------------------------------------------------------------

  };

  if (!data[selectedDataset][selectedRegion]) {
    loadData(selectedRegion).then(function(ptData) {
      data[selectedDataset][selectedRegion] = ptData.map((obj) => {
        const rObj = {};
        rObj.date = obj.date;
        rObj.domestic = obj.domestic;
        rObj.transborder = obj.transborder;
        rObj.international = obj.international;
        rObj.total = obj.total;
        return rObj;
      });
      showChart();
    })
        .catch(function(error) {
          console.log("File does not exist", error);
        });
  } else {
    showChart();
  }
}

function loadData(itemToLoad) {
  return new Promise(function(resolve, reject) {
    d3.json(`data/air/${selectedDataset}/${itemToLoad}.json`, function(err, ptData) {
      if (err) {
        reject(err);
      } else {
        resolve(ptData);
      }
    });
  });
}
function filterDates(data) {
  for (const year in data) {
    if (data[year].date === selectedDate) {
      return data[year];
    }
  }
}
function createDropdown() {
  const geoDropdown = $("#groups");
  geoDropdown.empty(); // remove old options

  // check available month/year combinations
  const yearId = `#${"yearSelector"}`;
  const monthId = `#${"monthSelector"}`;
  if (selectedDataset === "major_airports") {
    selectedMonth = dropdownCheck(yearId, monthId, selectedDateRange, selectedYear, selectedMonth, true);
  } else {
    selectedMonth = dropdownCheck(yearId, monthId, selectedDateRange, selectedYear, selectedMonth, false);
  }

  // indent airports under each geographic region
  const indent = "&numsp;&numsp;&numsp;";
  let prefix;
  for (const geo of selectedDropdown) {
    if (geo.type === "airport") {
      prefix = indent;
    } else {
      prefix="";
    }
    if (geo.data && geo.data === "no") {
      geoDropdown.append($("<option disabled></option>")
          .attr("value", geo.code).html(prefix + i18next.t(geo.code, {ns: "geography"})));
    } else {
      geoDropdown.append($("<option></option>")
          .attr("value", geo.code).html(prefix +i18next.t(geo.code, {ns: "geography"})));
    }
  }
}

/* -- stackedArea chart for airports -- */
const showAirport = function() {
  if (!lineData[selectedAirpt]) {
    loadData(selectedAirpt).then(function(aptData) {
      lineData[selectedAirpt] = aptData;
      airportHover();
    });
  } else {
    airportHover();
  }
};

function airportHover() {
  const divData = filterDates(lineData[selectedAirpt]);
  div.style("opacity", .9);
  if (selectedDataset === "passengers") {
    const thisEnplaned = Number(divData.enplaned) ? selectedSettings.formatNum(divData.enplaned) : divData.enplaned;
    const thisDeplaned = Number(divData.deplaned) ? selectedSettings.formatNum(divData.deplaned) : divData.deplaned;
    const showUnits = Number(divData.enplaned) ? i18next.t("units", {ns: "airPassengers"}) : "";
    div.html(
        `<b> ${i18next.t(selectedAirpt, {ns: "geography"})}, ${divData.date}:</b> <br><br>
          <table>
            <tr>
              <td><b> ${i18next.t("enplaned", {ns: "airPassengers"})}: </b> ${thisEnplaned} ${showUnits} </td>
            </tr>
              <td><b> ${i18next.t("deplaned", {ns: "airPassengers"})}: </b> ${thisDeplaned} ${showUnits} </td>
            </tr>
         </table>`
    )
        .style("pointer-events", "none");
  } else {
    const thisDomestic = selectedSettings.formatNum(divData.domestic);
    const thisTrans = selectedSettings.formatNum(divData.transborder);
    const thisInter = selectedSettings.formatNum(divData.international);
    const divDate = `${i18next.t((divData.date).substring(5, 7), {ns: "months"})} ${divData.date.substring(0, 4)}`;
    div.html(
        `<b> ${i18next.t(selectedAirpt, {ns: "geography"})}, ${divDate}:</b> <br><br>
          <table>
            <tr>
              <td><b> ${i18next.t("domestic", {ns: "airPassengers"})} </b>: ${thisDomestic} </td>
            </tr>
            <tr>
              <td><b> ${i18next.t("transborder", {ns: "airPassengers"})} </b>: ${thisTrans} </td>
            </tr>
          <tr>
            <td><b> ${i18next.t("international", {ns: "airPassengers"})} </b>: ${thisInter} </td>
          </tr>
        </table>`
    )
        .style("pointer-events", "none");
  }
  // airport chart title
  d3.select("#svg_aptChart")
      .select(".areaChartTitle")
      .text(i18next.t(selectedAirpt, {ns: "geography"}));
}
/* -- update map and areaChart titles -- */
function updateTitles() {
  const geography = i18next.t(selectedRegion, {ns: "geography"});
  const mapTitle = (selectedDataset === "passengers") ?
    `${i18next.t("mapTitle", {ns: "airPassengers"})}, ${selectedDate}` :
    `${i18next.t("mapTitle", {ns: "airMajorAirports"})}, ${i18next.t(selectedMonth, {ns: "months"})} ${selectedYear}`;
  const areaTitle = (selectedDataset === "passengers") ?
    `${i18next.t("chartTitle", {ns: "airPassengers"})}, ${geography}` :
    `${i18next.t("chartTitle", {ns: "airMajorAirports"})}, ${geography}`;
  const tableTitle = (selectedDataset === "passengers") ?
    `${i18next.t("tableTitle", {ns: "airPassengers"})}, ${geography}` :
    `${i18next.t("tableTitle", {ns: "airMajorAirports"})}, ${geography}`;

  d3.select("#mapTitleAir")
      .text(mapTitle);

  d3.select("#areaTitleAir")
      .text(areaTitle);

  selectedSettings.tableTitle = tableTitle;
}

function getDateMinMax() {
  for (const [date] of Object.entries(majorTotals)) {
    if (!majorDateRange.min || new Date(date)< new Date(majorDateRange.min)) {
      majorDateRange.min = date;
    }
    if (!majorDateRange.max || new Date(date)> new Date(majorDateRange.max)) {
      majorDateRange.max = date;
    }
  }
  for (const [date] of Object.entries(passengerTotals)) {
    if (!passengerDateRange.min || new Date(date)< new Date(passengerDateRange.min)) {
      passengerDateRange.min = date;
    }
    if (!passengerDateRange.max || new Date(date)> new Date(passengerDateRange.max)) {
      passengerDateRange.max = date;
    }
  }
}
// ------------------------------------------------------------------------------
function isIE() {
  const ua = window.navigator.userAgent;
  const msie = ua.indexOf("MSIE ");
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10);
  }
  const trident = ua.indexOf("Trident/");
  if (trident > 0) {
    // IE 11 => return version number
    const rv = ua.indexOf("rv:");
    return parseInt(ua.substring(rv + 3, ua.indexOf(".", rv)), 10);
  }
  const edge = ua.indexOf("Edge/");
  if (edge > 0) {
    // Edge (IE 12+) => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf(".", edge)), 10);
  }
  // other browser
  return false;
}

function ieWorkAround() {
  const summaryNode = document.getElementById("chrt-dt-tbl");
  summaryNode.addEventListener("keydown", function(ev) {
    if (ev.which == 13 || ev.which == 32) toggle(ev);
  });

  summaryNode.addEventListener( "click", function(ev) {
    toggle(ev);
  });

  function toggle(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    const nodedetails = document.getElementsByClassName("chart-data-table")[0];
    const isOpen = nodedetails.hasAttribute("open");
    if (isOpen) nodedetails.removeAttribute("open");
    else nodedetails.setAttribute("open", "open");
  }
}
// -----------------------------------------------------------------------------
/* Copy Button*/
function dataCopyButton(cButtondata) {
  const lines = [];
  const geography = i18next.t(selectedRegion, {ns: "geography"});
  const title = [i18next.t("tableTitle", {ns: "airMajorAirports", geo: geography})];
  const columns = [""];

  for (const concept in cButtondata[0]) if (concept != "date") {
    if (concept !== "isLast") columns.push(i18next.t(concept, {ns: "airPassengers"}));
  }
  lines.push(title, [], columns);

  for (const row in cButtondata) {
    if (Object.prototype.hasOwnProperty.call(cButtondata, row)) {
      const auxRow = [];

      for (const column in cButtondata[row]) {
        if (column !== "isLast") {
          if (Object.prototype.hasOwnProperty.call(cButtondata[row], column)) {
            const value = cButtondata[row][column];

            if (column != "date" && column != "total" && !isNaN(value)) value;
            auxRow.push(value);
          }
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
  settingsMajorAirports.x.label = i18next.t("x_label", {ns: "airMajorAirports"}),
  settingsMajorAirports.y.label = i18next.t("y_label", {ns: "airMajorAirports"}),
  d3.queue()
      .defer(d3.json, "data/air/passengers/Annual_Totals.json")
      .defer(d3.json, "data/air/passengers/metaData.json")
      .defer(d3.json, "data/air/major_airports/Annual_Totals.json")
      .defer(d3.json, "data/air/major_airports/metaData.json")
      .defer(d3.json, "geojson/vennAirport_with_dataFlag.geojson")
      .defer(d3.json, `data/air/passengers/${selectedRegion}.json`)
      .await(function(error, passengerTotal, passengerMeta, majorTotal, majorMeta, airports, areaData) {
        if (error) throw error;
        totals = passengerTotal;
        passengerTotals = passengerTotal;
        passengerMetaData = passengerMeta;
        majorTotals = majorTotal;
        majorMetaData = majorMeta;
        metaData = passengerMetaData;
        data[selectedDataset][selectedRegion] = areaData;
        getDateMinMax();
        selectedDateRange = passengerDateRange;
        selectedYear, selectedDate = selectedDateRange.max.substring(0, 4);
        selectedMonth = selectedDateRange.max.substring(5, 7);
        createDropdown();
        canadaMap = getCanadaMap(map)
            .on("loaded", function() {
              allAirports = airports;

              colorMap();

              // airportGroup.selectAll("path")
              //     .on("mouseover", (d) => {
              //       selectedAirpt = d.properties.id;
              //       if (d.properties.hasPlanedData !== "noYears") {
              //         showAirport();
              //       }
              //     });

              map.style("visibility", "visible")
                  .style("pointer-events", "visible");
              d3.select(".canada-map");
              refreshMap();
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

        d3.select("#symbolLink")
            .html(`<a href=${i18next.t("linkURL", {ns: "symbolLink"})} target='_blank'>${i18next.t("linkText", {ns: "symbolLink"})}</a>`);

        showAreaData();
        // Show chart titles based on default menu options
        updateTitles();


        if (isIE()) ieWorkAround();
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
