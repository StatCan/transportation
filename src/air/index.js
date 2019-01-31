import settings from "./stackedAreaSettings.js";
import settingsAirport from "./stackedAreaSettingsAirports.js";

const map = d3.select(".dashboard .map")
    .append("svg");
const chart = d3.select(".data")
    .append("svg")
    .attr("id", "svg_areaChartAir");
const chart2 = d3.select("#lineChart") // .select(".data")
    .append("svg")
    .attr("id", "svg_lineChart");
// !!!!!!! WIP !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const data = {};
let passengerTotals;
let majorTotals;
let selectedYear = 2017;

let selected = "CANADA"; // default region for areaChart

let selectedAirpt;
const lineData = {};

// which data set to use. 0 for passenger, 1 for movements/major airports
let dataSet = 0;

/* canada map */

function uiHandler(event) {
  if (event.target.id === "groups") {
    selected = document.getElementById("groups").value;
    showAreaData();
  }
  if (event.target.id === "yearSelector"){
    selectedYear = document.getElementById("yearSelector").value;
    colorMap();
  }
}

function showAreaData() {
  const showChart = () => {
    areaChart(chart, settings, data[selected]);
  };

  if (!data[selected]) {
    return d3.json(`data/air/passengers/${selected}.json`, (ptData) => {
      data[selected] = ptData;
      showChart();
    });
  }
  showChart();
}

function colorMap() {
  // TEMPORARY
    d3.select(".dashboard .map").selectAll("path").style("stroke", "black");

    const totArr = [];
    for (const sales of Object.keys(passengerTotals[selectedYear])) {
      totArr.push(passengerTotals[selectedYear][sales]);
    }
    // https://d3js.org/colorbrewer.v1.js
    const colourArray= ["#eff3ff", "#bdd7e7", "#6baed6", "#3182bd", "#08519c"];

    totArr.sort(function(a, b) {
      return a - b;
    });

    // colour map to take data value and map it to the colour of the level bin it belongs to
    const dimExtent = d3.extent(totArr);
    const colourMap = d3.scaleLinear()
        .domain([dimExtent[0], dimExtent[1]])
        .range(colourArray);

    for (const key in passengerTotals[selectedYear]) {
      if (passengerTotals[selectedYear].hasOwnProperty(key)) {
        d3.select(".dashboard .map")
            .select("." + key).style("fill", colourMap(passengerTotals[selectedYear][key]));
      }
    }
}

function showAirport() {
  if (!lineData[selectedAirpt]) {
    const fname = `data/air/passengers/${selectedAirpt}.json`;
    return d3.json(fname, (aptData) => {
      if (aptData) {
        for(var year of aptData){
          for (var key in year){
            if (year[key]==="x" || year[key]===".."){
              year[key]=0;
            }
          }
        }
        lineData[selectedAirpt] = aptData;
        // lineChart(chart2, settingsLineChart, lineData[selectedAirpt]);
        areaChart(chart2, settingsAirport, lineData[selectedAirpt]);
        // line chart title
        d3.select("#svg_lineChart")
            .select(".airptChartTitle")
            .text(i18next.t(selectedAirpt, {ns: "airports"}));
      }
      // lineData[selectedAirpt] = aptData;
      // lineChart(chart2, settingsLineChart, lineData[selectedAirpt]);
    });
  }
  // lineChart(chart2, settingsLineChart, lineData[selectedAirpt]);
  areaChart(chart2, settingsAirport, lineData[selectedAirpt]);
  // line chart title
  d3.select("#svg_lineChart")
      .select(".airptChartTitle")
      .text(i18next.t(selectedAirpt, {ns: "airports"}));
}

// For map circles
let path;
const defaultPointRadius = 1.5;
const defaultStrokeWidth = 0.5;

const canadaMap = getCanadaMap(map)
    .on("loaded", function() {
      colorMap();

      // d3.json("geojson/vennAirport.geojson", (error, airports) => {
      d3.json("geojson/vennAirport_with_dataFlag.geojson", (error, airports) => {
        if (error) throw error;

        const airportGroup = map.append("g");
        path = d3.geoPath().projection(this.settings.projection)
            .pointRadius(defaultPointRadius);

        airportGroup.selectAll("path")
            .data(airports.features)
            .enter().append("path")
            .attr("d", path)
            .attr("id", (d, i) => {
              return "airport" + d.properties.id;
            })
            .attr("class", (d, i) => {
              return "airport " + d.properties.hasPlanedData;
            })
            .on("mouseover", (d) => {
              selectedAirpt = d.properties.id;
              if (d.properties.hasPlanedData !== "noYears") {
                  showAirport();
              }
            });
      });
    });

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

i18n.load(["src/i18n"], () => {
  d3.queue()
    .defer(d3.json, "data/air/passengers/Annual_Totals.json")
    .defer(d3.json, "data/air/major_airports/Annual_Totals.json")
    .await(function(error, passengerTotal, majorTotal) {
      passengerTotals = passengerTotal;
      majorTotals = majorTotal;
      settings.x.label = i18next.t("x_label", {ns: "area"}),
      settings.y.label = i18next.t("y_label", {ns: "area"}),
      settingsAirport.x.label = i18next.t("x_label", {ns: "areaAirport"}),
      settingsAirport.y.label = i18next.t("y_label", {ns: "areaAirport"}),
      selectedYear = 2017,
      colorMap(),
      showAreaData();
    });
});
$(document).on("change", uiHandler);
