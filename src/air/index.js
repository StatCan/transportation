import settings from "./stackedAreaSettings.js";
import settingsAirport from "./stackedAreaSettingsAirports.js";

const passengerMode = "passenger";
const majorAirportMode = "majorAirport";

const data = {};

let passengerTotals;
let majorTotals;
let canadaMap;
const numberOfProvinces = 13;

let selectedYear = 2017;
let selectedMode = passengerMode;

let selectedRegion = "CANADA"; // default region for areaChart

let selectedAirpt;
const lineData = {};



// which data set to use. 0 for passenger, 1 for movements/major airports
let dataSet = 0;

const map = d3.select(".dashboard .map")
    .append("svg");


const chart = d3.select(".data")
    .append("svg")
    .attr("id", "svg_areaChartAir");
const chart2 = d3.select("#lineChart") // .select(".data")
    .append("svg")
    .attr("id", "svg_lineChart");


// For map circles
let path;
const defaultPointRadius = 1.5;
const defaultStrokeWidth = 0.5;

const airportGroup = map.append("g");
let allAirports;
// !!!!!!! WIP !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

/* canada map */

function uiHandler(event) {
  if (event.target.id === "groups") {
    selectedRegion = document.getElementById("groups").value;
    showAreaData();
  }
  if (event.target.id === "yearSelector"){
    selectedYear = document.getElementById("yearSelector").value;
    colorMap();
  }
}

function showAreaData() {
  const showChart = () => {
    areaChart(chart, settings, data[selectedRegion]);
  };

  if (!data[selectedRegion]) {
    return d3.json(`data/air/passengers/${selectedRegion}.json`, (ptData) => {
      data[selectedRegion] = ptData;
      showChart();
    });
  }
  showChart();
}

function colorMap() {
    map.selectAll("path").style("stroke", "black");

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
    const minValue =  Math.min.apply(null, totArr.filter(Boolean));
    const maxValue =  totArr[numberOfProvinces-1];
    const dimExtent = [minValue, maxValue]

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

const showAirport = function() {
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
            .select(".areaChartTitle")
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
      .select(".areaChartTitle")
      .text(i18next.t(selectedAirpt, {ns: "airports"}));
}


let refreshMap = function(){

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
    })


}


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
    .defer(d3.json, "geojson/vennAirport_with_dataFlag.geojson")
    .await(function(error, passengerTotal, majorTotal, airports) {
      if (error) throw error;
      passengerTotals = passengerTotal;
      majorTotals = majorTotal;
      settings.x.label = i18next.t("x_label", {ns: "area"}),
      settings.y.label = i18next.t("y_label", {ns: "area"}),
      settingsAirport.x.label = i18next.t("x_label", {ns: "areaAirport"}),
      settingsAirport.y.label = i18next.t("y_label", {ns: "areaAirport"}),
      selectedYear = document.getElementById("yearSelector").value;

      canadaMap = getCanadaMap(map)
          .on("loaded", function(){

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


              map.style("visibility", "visible")
              d3.select(".canada-map").moveToBack();

          })
      showAreaData();
    });
});

$(document).on("change", uiHandler);
d3.selection.prototype.moveToFront = function() {
     return this.each(function(){
       this.parentNode.appendChild(this);
     });
   };
 d3.selection.prototype.moveToBack = function() {
     return this.each(function() {
         var firstChild = this.parentNode.firstChild;
         if (firstChild) {
             this.parentNode.insertBefore(this, firstChild);
         }
     });
 };
