import settings from "./stackedAreaSettings.js";
import settingsMajorAirports from "./stackedAreaSettingsMajorAirports.js";
import mapColourScaleFn from "../mapColourScaleFn.js";
import fillMapFn from "../fillMapFn.js";
import areaLegendFn from "../areaLegendFn.js";
import CopyButton from "../copyButton.js";

/* Copy Button */
// -----------------------------------------------------------------------------
const cButton = new CopyButton();
// -----------------------------------------------------------------------------

const formatComma = d3.format(",d");
const scalef = 1e3;

const data = {
  "passengers": {},
  "major_airports": {}
};

const passengerDropdownData = [
  {
    "fullName": "Canada",
    "code": "CANADA",
    "type": "geo"
  },
  {
    "fullName": "Newfoundland and Labrador",
    "code": "NL",
    "type": "geo"
  },
  {
    "fullName": "St John's International",
    "code": "YYT",
    "type": "airport"
  },
  {
    "fullName": "Prince Edward Island",
    "code": "PE",
    "type": "geo"
  },
  {
    "fullName": "Nova Scotia",
    "code": "NS",
    "data": "no",
    "type": "geo"
  },
  {
    "fullName": "Halifax/Robert L. Stanfield International",
    "code": "YHZ",
    "type": "airport"
  },
  {
    "fullName": "New Brunswick",
    "code": "NB",
    "data": "no",
    "type": "geo"
  },
  {
    "fullName": "Moncton/Greater Moncton International",
    "code": "YQM",
    "type": "airport"
  },
  {
    "fullName": "Quebec",
    "code": "QC",
    "type": "geo"
  },
  {
    "fullName": "Montréal/Pierre Elliott Trudeau International",
    "code": "YUL",
    "type": "airport"
  },
  {
    "fullName": "Québec/Jean Lesage International",
    "code": "YQB",
    "type": "airport"
  },
  {
    "fullName": "Ontario",
    "code": "ON",
    "type": "geo"
  },
  {
    "fullName": "Ottawa/Macdonald-Cartier International",
    "code": "YOW",
    "type": "airport"
  },
  {
    "fullName": "Toronto/Lester B Pearson International",
    "code": "YYZ",
    "type": "airport"
  },
  {
    "fullName": "Manitoba",
    "code": "MB",
    "type": "geo"
  },
  {
    "fullName": "Winnipeg/James Armstrong Richardson International",
    "code": "YWG",
    "type": "airport"
  },
  {
    "fullName": "Saskatchewan",
    "code": "SK",
    "type": "geo"
  },
  {
    "fullName": "Alberta",
    "code": "AB",
    "type": "geo"
  },
  {
    "fullName": "Calgary International",
    "code": "YYC",
    "type": "airport"
  },
  {
    "fullName": "Edmonton International",
    "code": "YEG",
    "type": "airport"
  },
  {
    "fullName": "British Columbia",
    "code": "BC",
    "type": "geo"
  },
  {
    "fullName": "Vancouver International",
    "code": "YVR",
    "type": "airport"
  },
  {
    "fullName": "Victoria International",
    "code": "YYJ",
    "type": "airport"
  },
  {
    "fullName": "Yukon",
    "code": "YT",
    "data": "no",
    "type": "geo"
  },
  {
    "fullName": "Northwest Territories",
    "code": "NT",
    "type": "geo"
  },
  {
    "fullName": "Nunavut",
    "code": "NU",
    "type": "geo"
  }
];

const majorDropdownData = [
  {
    "fullName": "Canada",
    "code": "CANADA",
    "type": "geo"
  },
  {
    "fullName": "Newfoundland and Labrador",
    "code": "NL",
    "type": "geo"
  },
  {
    "fullName": "St John's International",
    "code": "YYT",
    "type": "airport"
  },
  {
    "fullName": "Prince Edward Island",
    "code": "PE",
    "type": "geo"
  },
  {
    "fullName": "Charlottetown",
    "code": "YYG",
    "type": "airport"
  },
  {
    "fullName": "Nova Scotia",
    "code": "NS",
    "type": "geo"
  },
  {
    "fullName": "Halifax/Robert L. Stanfield International",
    "code": "YHZ",
    "type": "airport"
  },
  {
    "fullName": "New Brunswick",
    "code": "NB",
    "type": "geo"
  },
  {
    "fullName": "Moncton/Greater Moncton International",
    "code": "YQM",
    "type": "airport"
  },
  {
    "fullName": "Fredericton International",
    "code": "YFC",
    "type": "airport"
  },
  {
    "fullName": "Saint John",
    "code": "YSJ",
    "type": "airport"
  },
  {
    "fullName": "Quebec",
    "code": "QC",
    "type": "geo"
  },
  {
    "fullName": "Montréal/Pierre Elliott Trudeau International",
    "code": "YUL",
    "type": "airport"
  },
  {
    "fullName": "Québec/Jean Lesage International",
    "code": "YQB",
    "type": "airport"
  },
  {
    "fullName": "Montréal Mirabel International",
    "code": "YMX",
    "type": "airport"
  },
  {
    "fullName": "Ontario",
    "code": "ON",
    "type": "geo"
  },
  {
    "fullName": "Ottawa/Macdonald-Cartier International",
    "code": "YOW",
    "type": "airport"
  },
  {
    "fullName": "Toronto/Lester B Pearson International",
    "code": "YYZ",
    "type": "airport"
  },
  {
    "fullName": "Thunder Bay International",
    "code": "YQT",
    "type": "airport"
  },
  {
    "fullName": "London International",
    "code": "YXU",
    "type": "airport"
  },
  {
    "fullName": "Manitoba",
    "code": "MB",
    "type": "geo"
  },
  {
    "fullName": "Winnipeg/James Armstrong Richardson International",
    "code": "YWG",
    "type": "airport"
  },
  {
    "fullName": "Saskatchewan",
    "code": "SK",
    "type": "geo"
  },
  {
    "fullName": "Regina International",
    "code": "YQR",
    "type": "airport"
  },
  {
    "fullName": "Saskatoon John G. Diefenbaker International",
    "code": "YXE",
    "type": "airport"
  },
  {
    "fullName": "Alberta",
    "code": "AB",
    "type": "geo"
  },
  {
    "fullName": "Calgary International",
    "code": "YYC",
    "type": "airport"
  },
  {
    "fullName": "Edmonton International",
    "code": "YEG",
    "type": "airport"
  },
  {
    "fullName": "British Columbia",
    "code": "BC",
    "type": "geo"
  },
  {
    "fullName": "Vancouver International",
    "code": "YVR",
    "type": "airport"
  },
  {
    "fullName": "Victoria International",
    "code": "YYJ",
    "type": "airport"
  },
  {
    "fullName": "Kelowna International",
    "code": "YLW",
    "type": "airport"
  },
  {
    "fullName": "Prince George Airport",
    "code": "YXS",
    "type": "airport"
  },
  {
    "fullName": "Yukon",
    "code": "YT",
    "type": "geo"
  },
  {
    "fullName": "Erik Nielsen Whitehorse International",
    "code": "YXY",
    "type": "airport"
  },
  {
    "fullName": "Northwest Territories",
    "code": "NT",
    "type": "geo"
  },
  {
    "fullName": "Yellowknife",
    "code": "YZF",
    "type": "airport"
  },
  {
    "fullName": "Nunavut",
    "code": "NU",
    "type": "geo"
  },
  {
    "fullName": "Iqaluit",
    "code": "YFB",
    "type": "airport"
  }
];

// -- vars that change with dropdown menu selections and toggle button -- //
let selectedDropdown = passengerDropdownData;

let totals;
let overlayRect;
let passengerTotals;
let majorTotals;
let canadaMap;
let selectedDataset = "passengers";
let selectedYear = "2017";
let selectedMonth = "01";
let selectedDate = selectedYear;
let selectedRegion = "CANADA";
let selectedSettings = settings;
let divFactor = scalef; // corresponds to passenger dataset; will change when toggled to major_airports
const majorDateRange = {};
const passengerDateRange = {};
let selectedDateRange = {};

let selectedAirpt; // NB: NEEDS TO BE DEFINED AFTER canadaMap; see colorMap()
const lineDataPassenger = {};
const lineDataMajor = {};
let passengerMetaData;
let majorMetaData;
let metaData;
let hoverValue;
let lineData = lineDataPassenger;

// -- store default values for selections -- //
const defaultYear = "2017";
const defaultMonth = "01";
const defaultRegion = "CANADA";

let stackedArea; // stores areaChart() call

// -----------------------------------------------------------------------------
/* SVGs */
const map = d3.select(".dashboard .map")
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

/* vertical line to attach to cursor */
const hoverLine = chart.append("line")
    .attr("class", "hoverLine")
    .style("display", "none");

// -----------------------------------------------------------------------------
/* UI Handler */
$(".data_set_selector").on("click", function(event) {
  resetZoom();

  // Reset to defaults
  d3.select(".map").selectAll("path").classed("airMapHighlight", false);
  selectedYear = defaultYear;
  selectedRegion = defaultRegion;
  d3.select("#groups")._groups[0][0].value = selectedRegion;
  d3.select("#yearSelector")._groups[0][0].value = selectedYear;
  divFactor = (event.target.id === ("movements")) ? scalef : 1;

  if (event.target.id === ("major")) {
    selectedMonth = defaultMonth;

    movementsButton
        .attr("class", "btn btn-primary major data_set_selector")
        .attr("aria-pressed", true);
    passengerButton
        .attr("class", "btn btn-default movements data_set_selector")
        .attr("aria-pressed", false);

    monthDropdown.style("visibility", "visible");
    selectedDate = selectedYear + "-" + selectedMonth;
    selectedDataset = "major_airports";
    selectedDropdown = majorDropdownData;
    selectedSettings = settingsMajorAirports;
    selectedDateRange = majorDateRange;
    metaData = majorMetaData;
    lineData = lineDataMajor;
    createDropdown();

    totals = majorTotals;
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
    selectedDate = selectedYear;
    selectedDataset = "passengers";
    selectedDropdown = passengerDropdownData;
    selectedSettings = settings;
    selectedDateRange = passengerDateRange;
    metaData = passengerMetaData;
    lineData = lineDataPassenger;
    createDropdown();

    totals = passengerTotals;
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
      const key = i18next.t(classes[0], {ns: "airGeography"});

      if (key !== "airport") {
        // Highlight map region
        d3.select(".dashboard .map")
            .select("." + classes[0])
            .classed("airMapHighlight", true)
            .moveToFront();

        // Tooltip
        const line1 = (selectedDataset === "passengers") ? `${key} (${i18next.t("scalef", {ns: "airPassengers"})})` :
          `${key}`;
        let value;
        let line2;
        if (Number(totals[selectedDate][classes[0]])) {
          value = formatComma(totals[selectedDate][classes[0]] / divFactor);
          line2 = (selectedDataset === "passengers") ? `${value} ${i18next.t("units", {ns: "airPassengers"})}` :
            `${value} ${i18next.t("units", {ns: "airMajorAirports"})}`;
        } else {
          value = totals[selectedDate][classes[0]]; // "x"
          line2 = `${value}`;
        }

        div
            .style("opacity", .9);
        div.html(
            "<b>" + line1 + "</b>"+ "<br><br>" +
              "<table>" +
                "<tr>" +
                  "<td><b>" + line2 + "</td>" +
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

map.on("click", () => {
  if (!d3.select(d3.event.target).attr("class") || d3.select(d3.event.target).attr("class") === "svg-shimmed") {
    resetZoom();
  } else if (d3.select(d3.event.target).attr("class") &&
      d3.select(d3.event.target).attr("class").indexOf("classNaN") === -1) { // Do not allow NaN region to be clicked
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
        d3.select(".dashboard .map")
            .select("." + classes[0])
            .classed("airMapHighlight", true);
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
/* FNS */
/* --  areaChart interactions -- */
// vertical line to attach to cursor
function plotHoverLine() {
  overlayRect = d3.select("#svg_areaChartAir .data").append("rect")
      .style("fill", "none")
      .style("pointer-events", "all")
      .attr("class", "overlay")
      .on("mouseout", function() {
        hoverLine.style("display", "none");
      })
      .on("mousemove", function() {
        hoverLine.style("display", null);
        hoverLine.style("transform", "translate(" + stackedArea.x(
            (hoverValue?new Date(hoverValue.date):0)
        )+ "px)");
        hoverLine.moveToFront();
      });

  overlayRect
      .attr("width", stackedArea.settings.innerWidth)
      .attr("height", stackedArea.settings.innerHeight);

  hoverLine
      .attr("x1", stackedArea.settings.margin.left)
      .attr("x2", stackedArea.settings.margin.left)
      .attr("y1", stackedArea.settings.margin.top)
      .attr("y2", stackedArea.settings.innerHeight + stackedArea.settings.margin.top);
}

function findAreaData(mousex) {
  const bisectDate = d3.bisector(function(d) {
    return d.date;
  }).left;
  const x0 = stackedArea.x.invert(mousex);
  const chartData = data[selectedDataset][selectedRegion];
  let d;
  let i;
  if (selectedDataset === "passenger" ) {
    i = bisectDate(chartData, x0.toISOString().substring(0, 4));
  } else {
    i = bisectDate(chartData, x0.toISOString().substring(0, 7));
  }

  const d0 = chartData[i - 1];
  const d1 = chartData[i];

  if (d0 && d1) {
    d = x0 - new Date(d0.date ) > new Date(d1.date ) - x0 ? d1 : d0;
  } else if (d0) {
    d = d0;
  } else {
    d = d1;
  }
  return d;
}
// area chart hover
function areaInteraction() {
  d3.select("#svg_areaChartAir .data")
      .on("mousemove", function() {
        const mousex = d3.mouse(this)[0];
        hoverValue = findAreaData(mousex);

        const thisDomestic = Number(hoverValue.domestic) ? formatComma(hoverValue.domestic / divFactor) : hoverValue.domestic;
        const thisTrans = Number(hoverValue.transborder) ? formatComma(hoverValue.transborder / divFactor) : hoverValue.transborder;
        const thisInter = Number(hoverValue.international) ? formatComma(hoverValue.international / divFactor) : hoverValue.international;

        const line1 = (selectedDataset === "passengers") ?
          `${i18next.t("chartHoverPassengers", {ns: "airPassengers"})}, ${hoverValue.date}: ` :
          `${i18next.t("chartHoverMajorAirports", {ns: "airMajorAirports"})}, ${`${i18next.t((hoverValue.date).substring(5, 7),
              {ns: "modesMonth"})} ${hoverValue.date.substring(0, 4)}`}: `;

        divArea.html(
            "<b>" + line1 + "</b>" + "<br><br>" +
          "<table>" +
            "<tr>" +
              "<td><b>" + i18next.t("domestic", {ns: "airPassengers"}) + "</b>: " + thisDomestic + "</td>" +
            "</tr>" +
            "<tr>" +
              "<td><b>" + i18next.t("transborder", {ns: "airPassengers"}) + "</b>: " + thisTrans + "</td>" +
            "</tr>" +
            "<tr>" +
              "<td><b>" + i18next.t("international", {ns: "airPassengers"}) + "</b>: " + thisInter + "</td>" +
            "</tr>" +
          "</table>"
        );
        divArea
            .style("left", ((d3.event.pageX + 10) + "px"))
            .style("top", ((d3.event.pageY + 10) + "px"))
            .style("pointer-events", "none");
      })
      .on("mouseover", function() {
        divArea.style("opacity", .9);
      })
      .on("mouseout", function(d, i) {
        // Clear tooltip
        hoverLine.style("display", "none");
        divArea.style("opacity", 0);
      });
}

// -----------------------------------------------------------------------------
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
          return "airport " + selectedDataset + " " + metaData[selectedDate][d.properties.id];
        } else {
          return "airport " + selectedDataset + " " + "dontShow";
        }
      })
      .on("mouseover", (d) => {
        selectedAirpt = d.properties.id;
        if (metaData[selectedDate][d.properties.id] !== "noData" ) {
          showAirport();
        }
      });

  d3.selectAll(".noData").moveToBack();

  d3.selectAll(".noData").moveToBack();
};

function colorMap() {
  // last 2 colours for blank and NaN box
  const colourArray = [];
  if (selectedDataset === "passengers") {
    colourArray.push("#AFE2FF", "#72C2FF", "#bc9dff", "#894FFF", "#5D0FBC", "#fff", "#565656");
  } else {
    colourArray.push("#AFE2FF", "#72C2FF", "#bc9dff", "#894FFF", "#5D0FBC");
  }
  const numLevels = 5; // number of levels to divide colourbar into

  const totArr = [];
  totArr.push(totals[selectedDate]);

  // colour map to take data value and map it to the colour of the level bin it belongs to
  const dimExtent = fillMapFn(totArr, colourArray, numLevels);

  // colour bar scale and add label

  mapColourScaleFn(svgCB, colourArray, dimExtent, numLevels, divFactor);

  // Colourbar label (need be plotted only once)
  const mapScaleLabel = selectedDataset === "passengers" ? i18next.t("mapScaleLabel", {ns: "airPassengers"}) : "";
  d3.select("#cbTitle").select("text").text(mapScaleLabel);

  // DEFINE AIRPORTGROUP HERE, AFTER CANADA MAP IS FINISHED, OTHERWISE
  // CIRCLES WILL BE PLOTTED UNDERNEATH THE MAP PATHS!
  airportGroup = map.append("g");
}

/* -- stackedArea chart for Passenger or Major Airports data -- */
function showAreaData() {
  updateTitles();

  const showChart = () => {
    stackedArea = areaChart(chart, selectedSettings, data[selectedDataset][selectedRegion]);
    d3.selectAll(".flag").style("opacity", 0);
    d3.select("#svg_areaChartAir").select(".x.axis").selectAll(".tick text").attr("dy", "0.85em");

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
    }

    // Highlight region selected from menu on map
    d3.select(".dashboard .map")
        .select("." + selectedRegion)
        .classed("airMapHighlight", true);

    // ------------------copy button---------------------------------
    // need to re-apend the button since table is being re-build
    if (cButton.pNode) cButton.appendTo(document.getElementById("copy-button-container"));
    dataCopyButton(data[selectedDataset][selectedRegion]);
    // ---------------------------------------------------------------

    areaInteraction();
    plotLegend();
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
    // plotHoverLine();
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
  const yearDropdown = $("#yearSelector");

  geoDropdown.empty(); // remove old options

  // date dropdown creation
  yearDropdown.empty();
  for (let i = Number(selectedDateRange.min.substring(0, 4)); i<=(Number(selectedDateRange.max.substring(0, 4))); i++) {
    yearDropdown.append($("<option></option>")
        .attr("value", i).html(i));
  }
  d3.select("#yearSelector")._groups[0][0].value = selectedYear;
  if (selectedDataset == "major_airports") {
    const maxMonth = Number(selectedDateRange.max.substring(5, 7));
    const maxYear = Number(selectedDateRange.max.substring(0, 4));

    // Disable months in dropdown menu that do not exist for selectedYear
    if (Number(selectedYear) === maxYear) {
      $("#monthSelector > option").each(function() {
        if (Number(this.value) > maxMonth) {
          this.disabled = true;
        }
      });
    } else {
      // Enable all months
      d3.selectAll("#monthSelector > option").property("disabled", false);

      // Disable year in dropdown menu if current month in dropdown menu does not exist for that year
      const currentMonth = Number(d3.select("#monthSelector")._groups[0][0].value);
      if (currentMonth > maxMonth) {
        $("#yearSelector > option").each(function() {
          if (Number(this.value) === maxYear) {
            this.disabled = true;
          }
        });
      }
    }
  }
  // end dropdown
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
          .attr("value", geo.code).html(prefix + geo.fullName));
    } else {
      geoDropdown.append($("<option></option>")
          .attr("value", geo.code).html(prefix + geo.fullName));
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
    div.html( // **** CHANGE ns WITH DATASET ****
        "<b>" + i18next.t(selectedAirpt, {ns: "airports"}) + ", " + divData.date + ":</b>" + "<br><br>" +
          "<table>" +
            "<tr>" +
              "<td><b>" + i18next.t("enplaned", {ns: "airPassengers"}) + ": </b>" + `${formatComma(divData.enplaned)} ${i18next.t("units", {ns: "airPassengers"})}` + " </td>" +
            "</tr>" +
              "<td><b>" + i18next.t("deplaned", {ns: "airPassengers"}) + ": </b>" + `${formatComma(divData.deplaned)} ${i18next.t("units", {ns: "airPassengers"})}` + "</td>" +
            "</tr>" +
          "</table>")
        .style("pointer-events", "none");
  } else {
    const thisDomestic = divData.domestic;
    const thisTrans = divData.transborder;
    const thisInter = divData.international;
    const divDate = `${i18next.t((divData.date).substring(5, 7), {ns: "modesMonth"})} ${divData.date.substring(0, 4)}`;
    div.html(
        "<b>" + "Passenger movements (" + i18next.t("units", {ns: "airPassengers"}) + ") in " + divDate + ":</b>" + "<br><br>" +
        "<table>" +
          "<tr>" +
            "<td><b>" + i18next.t("domestic", {ns: "airPassengers"}) + "</b>: " + thisDomestic + "</td>" +
          "</tr>" +
          "<tr>" +
            "<td><b>" + i18next.t("transborder", {ns: "airPassengers"}) + "</b>: " + thisTrans + "</td>" +
          "</tr>" +
          "<tr>" +
            "<td><b>" + i18next.t("international", {ns: "airPassengers"}) + "</b>: " + thisInter + "</td>" +
          "</tr>" +
        "</table>")
        .style("pointer-events", "none");
  }
  // airport chart title
  d3.select("#svg_aptChart")
      .select(".areaChartTitle")
      .text(i18next.t(selectedAirpt, {ns: "airports"}));
}
/* -- update map and areaChart titles -- */
function updateTitles() {
  const geography = i18next.t(selectedRegion, {ns: "airGeography"});
  const mapTitle = (selectedDataset === "passengers") ?
    `${i18next.t("mapTitle", {ns: "airPassengers"})}, ${selectedDate}` :
    `${i18next.t("mapTitle", {ns: "airMajorAirports"})}, ${i18next.t(selectedMonth, {ns: "modesMonth"})} ${selectedYear}`;
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

function plotLegend() {
  const classArray = ["domestic", "transborder", "international"];
  areaLegendFn(svgLegend, classArray);

  d3.select("#areaLegend")
      .selectAll("text")
      .text(function(d, i) {
        return i18next.t(classArray[i], {ns: "airPassengers"});
      });
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
// -----------------------------------------------------------------------------
/* Copy Button*/
function dataCopyButton(cButtondata) {
  const lines = [];
  const geography = i18next.t(selectedRegion, {ns: "airGeography"});
  const title = [i18next.t("tableTitle", {ns: "airMajorAirports", geo: geography})];
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
        selectedYear, selectedDate = document.getElementById("yearSelector").value;
        selectedMonth = document.getElementById("monthSelector").value;
        getDateMinMax();
        selectedDateRange = passengerDateRange;
        createDropdown();
        canadaMap = getCanadaMap(map)
            .on("loaded", function() {
              allAirports = airports;

              colorMap();

              airportGroup.selectAll("path")
                  .on("mouseover", (d) => {
                    selectedAirpt = d.properties.id;
                    if (d.properties.hasPlanedData !== "noYears") {
                      showAirport();
                    }
                  });

              map.style("visibility", "visible");
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
        showAreaData();
        plotLegend();
        areaInteraction();
        plotHoverLine();
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
