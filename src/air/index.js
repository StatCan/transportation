import settings from "./stackedAreaSettings.js";
import settingsAirport from "./stackedAreaSettingsAirports.js";

// const passengerMode = "passenger"; // TODO
// const majorAirportMode = "majorAirport"; // TODO

const data = {};

let passengerTotals;
// let majorTotals; // TODO
let canadaMap;

let selectedYear = 2017;
// let selectedMode = passengerMode; // TODO

let selectedRegion = "CANADA"; // default region for areaChart

let selectedAirpt;
const lineData = {};


// which data set to use. 0 for passenger, 1 for movements/major airports
// let dataSet = 0; // TODO

const units = "millions of dollars";
const mapScaleLabel = "Total (" + units + ")";
const formatComma = d3.format(",d");

// -----------------------------------------------------------------------------
/* SVGs */
const map = d3.select(".dashboard .map")
    .append("svg");
const chart = d3.select(".data")
    .append("svg")
    .attr("id", "svg_areaChartAir");
const chart2 = d3.select("#aptChart") // .select(".data")
    .append("svg")
    .attr("id", "svg_aptChart");

/* variables */
// For map circles
let path;
const defaultPointRadius = 1.1;
const defaultStrokeWidth = 0.5;

const airportGroup = map.append("g");
let allAirports;

// -----------------------------------------------------------------------------
/* tooltip */
/*-- for map --*/
const div = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);
/*-- for areaChart 1 --*/
const divArea = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// -----------------------------------------------------------------------------
/* UI Handler */
function uiHandler(event) {
  if (event.target.id === "groups") {
    selectedRegion = document.getElementById("groups").value;
    showAreaData();
  }
  if (event.target.id === "yearSelector") {
    selectedYear = document.getElementById("yearSelector").value;
    colorMap();
  }
}

// -----------------------------------------------------------------------------
/* Interactions */
/*-- Map interactions --*/
map.on("click", () => {
  const transition = d3.transition().duration(1000);
  const classes = d3.event.target.classList;

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
    // console.log("path: ", path.pointRadius());
    d3.transition(transition).selectAll(".airport")
        .style("stroke-width", 0.1)
        .attr("d", path);

    canadaMap.zoom(classes[0]);
  }
});

/*--  areaChart interactions --*/
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
let fuelType;
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
              fuelType = i18next.t(root.attr("class").split(" ").slice(-1)[0], {ns: "airPassengers"});
            }         
          }      
      });

      const yearDict = {
        0: 2010, 1: 2011, 2: 2012, 3: 2013, 4: 2014, 5: 2015, 6: 2016, 7: 2017
      }

      if (thisValue) {
        divArea.transition()
          .style("opacity", .9);
        divArea.html(
          "<b>" + fuelType + " (" + i18next.t("units", {ns: "road"}) + ")</b>"+ "<br><br>" +
            "<table>" +
              "<tr>" + 
                "<td><b>" + yearDict[idx] + ": $" + thisValue  + "</td>" +
                // "<td>" + " (" + units + ")</td>" +
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
/*-- plot circles on map --*/
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
  let dimExtent = [];
  map.selectAll("path").style("stroke", "black");

  const totArr = [];
  for (const sales of Object.keys(passengerTotals[selectedYear])) {
    totArr.push(passengerTotals[selectedYear][sales]);
  }

  const colourArray= ["#eff3ff", "#bdd7e7", "#6baed6", "#3182bd", "#08519c"];

  // colour map to take data value and map it to the colour of the level bin it belongs to
  dimExtent = d3.extent(totArr);
  const colourMap = d3.scaleQuantile()
      .domain([dimExtent[0], dimExtent[1]])
      .range(colourArray);

  for (const key in passengerTotals[selectedYear]) {
    if (passengerTotals[selectedYear].hasOwnProperty(key)) {
      d3.select(".dashboard .map")
          .select("." + key).style("fill", colourMap(passengerTotals[selectedYear][key]));
    }
  }
}

/*-- stackedArea chart for Passenger or Major Airports data --*/
function showAreaData() {
  const showChart = () => {
    areaChart(chart, settings, data[selectedRegion]);
    d3.select("#svg_areaChartAir").select(".x.axis")
            .select("text")
            .attr("display", "none");
  };

  if (!data[selectedRegion]) {
    return d3.json(`data/air/passengers/${selectedRegion}.json`, (ptData) => {
      data[selectedRegion] = ptData;
      showChart();
    });
  }
  showChart();
}

/*-- stackedArea chart for airports --*/
const showAirport = function() {
  if (!lineData[selectedAirpt]) {
    const fname = `data/air/passengers/${selectedAirpt}.json`;
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
        areaChart(chart2, settingsAirport, lineData[selectedAirpt]);
        d3.select("#svg_aptChart").select(".x.axis").select("text").attr("display", "none");
        // Titles
        const fullName = i18next.t(selectedAirpt, {ns: "airports"});
        // airport chart title
        d3.select("#svg_aptChart")
            .select(".areaChartTitle")
            .text(fullName);
        // airport table title
        d3.select("#chrt-dt-tbl1")
          .text(`Air passenger traffic at ${fullName}, (in thousands)`);
      }
    });
  }
  areaChart(chart2, settingsAirport, lineData[selectedAirpt]);
  // airport chart title
  d3.select("#svg_aptChart")
      .select(".areaChartTitle")
      .text(i18next.t(selectedAirpt, {ns: "airports"}));
};

/*-- update map and areaChart titles --*/
function updateTitles() {
  const geography = i18next.t(selectedRegion, {ns: "airGeography"});
  d3.select("#mapTitleAir")
      .text(i18next.t("mapTitle", {ns: "airPassengers"}) + ", " + geography + ", " + selectedYear);
  d3.select("#areaTitleAir")
      .text(i18next.t("chartTitle", {ns: "airPassengers"}) + ", " + geography);
}

i18n.load(["src/i18n"], () => {
  settings.x.label = i18next.t("x_label", {ns: "airPassengers"}),
  settings.y.label = i18next.t("y_label", {ns: "airPassengers"}),
  settings.tableTitle = i18next.t("tableTitle", {ns: "airPassengers"}),
  settingsAirport.x.label = i18next.t("x_label", {ns: "airPassengerAirports"}),
  settingsAirport.y.label = i18next.t("y_label", {ns: "airPassengerAirports"}),
  settingsAirport.tableTitle = i18next.t("tableTitle", {ns: "airPassengerAirports"}),
  d3.queue()
      .defer(d3.json, "data/air/passengers/Annual_Totals.json")
      .defer(d3.json, "data/air/major_airports/Annual_Totals.json")
      .defer(d3.json, "geojson/vennAirport_with_dataFlag.geojson")
      .await(function(error, passengerTotal, majorTotal, airports) {
        if (error) throw error;
        passengerTotals = passengerTotal;
        // majorTotals = majorTotal;
     
        selectedYear = document.getElementById("yearSelector").value;

        canadaMap = getCanadaMap(map)
            .on("loaded", function() {
              allAirports = airports;

              refreshMap();
              colorMap();

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
