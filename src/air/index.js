import settings from "./stackedAreaSettings.js";
import settingsMajorAirports from "./stackedAreaSettingsMajorAirports.js";
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

const passengerDropdownData = {
  "Canada": "CANADA",
  "Newfoundland and Labrador": "NL",
  "St John's International": "YYT",
  "Prince Edward Island": "PE",
  "Nova Scotia (no data)": "NS",
  "Halifax/Robert L Stanfield International": "YHZ",
  "New Brunswick (no data)": "NB",
  "Moncton/Greater Moncton International": "YQM",
  "Quebec": "QC",
  "Montréal/Pierre Elliott Trudeau International": "YUL",
  "Québec/Jean Lesage International": "YQB",
  "Ontario": "ON",
  "Ottawa/Macdonald-Cartier International": "YOW",
  "Toronto/Lester B Pearson International": "YYZ",
  "Manitoba": "MB",
  "Winnipeg/James Armstrong Richardson International": "NL",
  "Saskatchewan": "SK",
  "Alberta": "AB",
  "Calgary International": "YYC",
  "Edmonton International": "YEG",
  "British Columbia": "BC",
  "Vancouver International": "YVR",
  "Victoria International": "YYJ",
  "Yukon (no data)": "YT",
  "Northwest Territories": "NT",
  "Nunavut": "NU"
};
const majorDropdownData = {
  "Canada": "CANADA",
  "Newfoundland and Labrador": "NL",
  "St John's International": "YYT",
  "Prince Edward Island": "PE",
  "Charlottetown": "YYG",
  "Nova Scotia (no data)": "NS",
  "Halifax/Robert L Stanfield International": "YHZ",
  "New Brunswick (no data)": "NB",
  "Moncton/Greater Moncton International": "YQM",
  "Fredericton International": "YFC",
  "Saint John": "YSJ",
  "Quebec": "QC",
  "Montréal/Pierre Elliott Trudeau International": "YUL",
  "Québec/Jean Lesage International": "YQB",
  "Montréal Mirabel International": "YMX",
  "Ontario": "ON",
  "Ottawa/Macdonald-Cartier International": "YOW",
  "Toronto/Lester B Pearson International": "YYZ",
  "Thunder Bay International": "YQT",
  "London International": "YXU",
  "Manitoba": "MB",
  "Winnipeg/James Armstrong Richardson International": "NL",
  "Saskatchewan": "SK",
  "Regina International": "YQR",
  "Saskatoon John G. Diefenbaker International": "YXE",
  "Alberta": "AB",
  "Calgary International": "YYC",
  "Edmonton International": "YEG",
  "British Columbia": "BC",
  "Vancouver International": "YVR",
  "Victoria International": "YYJ",
  "Kelowna International": "YLW",
  "Prince George Airport": "YXS",
  "Yukon (no data)": "YT",
  "Erik Nielsen Whitehorse International": "YXY",
  "Northwest Territories": "NT",
  "Yellowknife": "YZF",
  "Nunavut": "NU",
  "Iqaluit": "YFB"
};
let selectedDropdown = passengerDropdownData;

let totals;
let passengerTotals;
let majorTotals; // TODO
let canadaMap;
let selectedDataset = "passengers";
let selectedYear = "2017";
let selectedMonth = "01";
let selectedDate = selectedYear;
let selectedRegion = "CANADA"; // default region for areaChart
let selectedSettings = settings;

let selectedAirpt; // NB: NEEDS TO BE DEFINED AFTER canadaMap; see colorMap()
const lineData = {};
// which data set to use. 0 for passenger, 1 for movements/major airports
// let dataSet = 0; // TODO

const formatComma = d3.format(",d");
const scalef = 1e3;
let stackedArea; // stores areaChart() call

// -----------------------------------------------------------------------------
/* SVGs */
const map = d3.select(".dashboard .map")
    .append("svg");
const movementsButton = d3.select("#major");
const passengerButton = d3.select("#movements");
const monthDropdown = d3.select("#months");
// map colour bar
const margin = {top: 20, right: 0, bottom: 10, left: 20};
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

/* -- for map NaN legend -- */
// const divNaN = d3.select("body").append("div")
//     .attr("class", "tooltip")
//     .style("opacity", 0);

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
    selectedDropdown = majorDropdownData;
    selectedSettings = settingsMajorAirports;
    createDropdown();

    totals = majorTotals;
    getData();
    showAreaData();
  //  d3.selectAll("g.x.axis .tick text").attr("transform", "rotate(-45)");
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
    createDropdown();

    totals = passengerTotals;
    getData();
    showAreaData();
  //  d3.selectAll("g.x.axis .tick text").attr("transform", "rotate(0)");
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
      data[selectedDataset][selectedRegion] = filedata.map((obj) => {
        const rObj = {};
        rObj.date = obj.date;
        rObj.domestic = obj.domestic;
        rObj.transborder = obj.transborder;
        rObj.international = obj.international;
        return rObj;
      });
      showAreaData();
    });
  } else {
    showAreaData();
  }
}
// -----------------------------------------------------------------------------
/* Interactions */
/* -- Map interactions -- */
map.on("mousemove", () => {
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
        div
            .style("opacity", .9);
        div.html( // **** CHANGE ns WITH DATASET ****
            "<b>" + key + " (" + i18next.t("scalef", {ns: "airPassengers"}) + ")</b>"+ "<br><br>" +
              "<table>" +
                "<tr>" +
                  "<td><b>" + value + " " + i18next.t("units", {ns: "airPassengers"}) + "</td>" +
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
  // clear any previous clicks
  d3.select(".map")
      .selectAll("path")
      .classed("airMapHighlight", false);

  // const transition = d3.transition().duration(1000);

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

        return canadaMap.zoom();
      }
      path.pointRadius(function(d, i) {
        return zoomedPointRadius;
      });

      canadaMap.zoom(classes[0]);
    }
  } else { // user clicks outside map
    // reset circle size
    path.pointRadius(function(d, i) {
      return defaultPointRadius;
    });

    // reset area chart to Canada
    selectedRegion = "CANADA";
    showAreaData();

    // update region displayed in dropdown menu
    d3.select("groups")._groups[0][0].value = selectedRegion;
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
function plotHoverLine() {
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
        const hoverValue = findAreaData(mousex);

        const thisDomestic = formatComma(hoverValue.domestic / scalef);
        const thisTrans = formatComma(hoverValue.transborder / scalef);
        const thisInter = formatComma(hoverValue.international / scalef);
        divArea.html(
            "<b>" + "Passenger movements (" + i18next.t("units", {ns: "airPassengers"}) + ") in " + hoverValue.date + ":</b>" + "<br><br>" +
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
        hoverLine.style("display", null);
        hoverLine.style("transform", "translate(" + stackedArea.x(new Date(hoverValue.date))+ "px)");
        hoverLine.moveToFront();
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
        return "airport " + selectedDataset + " " + d.properties.hasPlanedData;
      });
};

function colorMap() {
  const colourArray = ["#AFE2FF", "#72C2FF", "#bc9dff", "#894FFF", "#5D0FBC", "#fff", "#565656"];
  const numLevels = 5; // remaining 2 colours in array are for blank and NaN box

  let dimExtent = [];

  const totArr = [];
  for (const sales of Object.keys(totals[selectedDate])) {
    totArr.push(totals[selectedDate][sales]);
  }

  // colour map to take data value and map it to the colour of the level bin it belongs to
  dimExtent = d3.extent(totArr);
  const colourMap = d3.scaleQuantile()
      .domain([dimExtent[0], dimExtent[1]])
      .range(colourArray.slice(0, numLevels));

  for (const key in totals[selectedDate]) {
    if (totals[selectedDate].hasOwnProperty(key)) {
      map.select("." + key).style("fill", colourMap(totals[selectedDate][key]));
    }
  }

  // colour bar scale and add label
  const mapScaleLabel = i18next.t("mapScaleLabel", {ns: "airPassengers"});
  mapColourScaleFn(svgCB, colourArray, dimExtent, numLevels);

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
}

/* -- stackedArea chart for Passenger or Major Airports data -- */
function showAreaData() {
  console.log("IN showAreaData!!!!!!!!!!!!!!!!!!!!!!!")
  updateTitles();

  const showChart = () => {
    stackedArea = areaChart(chart, selectedSettings, data[selectedDataset][selectedRegion]);

    if (selectedDataset === "major_airports") {
         d3.select("#svg_areaChartAir .x.axis").selectAll("g.tick")
      .each(function(d, i) {
        var thisMonth = d.getMonth();
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
    loadData().then(function(ptData) {
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
          console.log(error);
        });
  } else {
    showChart();
    // plotHoverLine();
  }
}

function loadData() {
  return new Promise(function(resolve, reject) {
    d3.json(`data/air/${selectedDataset}/${selectedRegion}.json`, function(err, ptData) {
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
  const dropdown = $("#groups");
  dropdown.empty(); // remove old options
  $.each(selectedDropdown, function(key, value) {
    dropdown.append($("<option></option>")
        .attr("value", value).text(key));
  });
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
        div.style("opacity", .9);
        div.html( // **** CHANGE ns WITH DATASET ****
            "<b>placeholder title</b>"+ "<br><br>" +
              "<table>" +
                "<tr>" +
                  "<td><b> enplaned: " + divData.enplaned + " </td>" +
                  "<td><b> deplaned: " + divData.deplaned + "</td>" +
                "</tr>" +
              "</table>"
        )
            .style("pointer-events", "none");
        // Titles
        // const fullName = i18next.t(selectedAirpt, {ns: "airports"});
      }
    });
  }
  // airport chart title
  d3.select("#svg_aptChart")
      .select(".areaChartTitle")
      .text(i18next.t(selectedAirpt, {ns: "airports"}));
};

/* -- update map and areaChart titles -- */
function updateTitles() {
  const geography = i18next.t(selectedRegion, {ns: "airGeography"});
  d3.select("#mapTitleAir")
      .text(i18next.t("mapTitle", {ns: "airPassengers"}) + ", " + geography + ", " + selectedDate);
  d3.select("#areaTitleAir")
      .text(i18next.t("chartTitle", {ns: "airPassengers"}) + ", " + geography);
  selectedSettings.tableTitle = i18next.t("tableTitle", {ns: "airPassengers", geo: geography});
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
  settingsMajorAirports.x.label = i18next.t("x_label", {ns: "airPassengers"}),
  settingsMajorAirports.y.label = i18next.t("y_label", {ns: "airPassengers"}),
  d3.queue()
      .defer(d3.json, "data/air/passengers/Annual_Totals.json")
      .defer(d3.json, "data/air/major_airports/Annual_Totals.json")
      .defer(d3.json, "geojson/vennAirport_with_dataFlag.geojson")
      .defer(d3.json, `data/air/passengers/${selectedRegion}.json`)
      .await(function(error, passengerTotal, majorTotal, airports, areaData) {
        if (error) throw error;
        totals = passengerTotal;
        passengerTotals = passengerTotal;
        majorTotals = majorTotal;
        data[selectedDataset][selectedRegion] = areaData;
        selectedYear, selectedDate = document.getElementById("yearSelector").value;
        selectedMonth = document.getElementById("monthSelector").value;
        createDropdown();
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
