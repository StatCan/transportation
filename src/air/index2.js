import settings from "./stackedAreaSettings.js";

const map = d3.select(".dashboard .map")
    .append("svg");
const regionChart = d3.select("#Q1")
    .append("svg")
    .attr("id", "svg_areaChartRegion");
const airportChart = d3.select("#Q2")
    .append("svg")
    .attr("id", "svg_areaChartAirport");
// !!!!!!! WIP !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const data = {};
const airportData = {};
let selected = "CANADA"; // default region for areaChart

let selectedAirpt;
let selectedProv;

function uiHandler(event) {
  if (event.target.id === "groups") {
    selected = document.getElementById("groups").value;
    showAreaData();
  }
}

function showAreaData() {
  const showChart = () => {
    areaChart(regionChart, settings, data[selected]);
  };
  console.log("data[selected]: ", !data[selected])
  if (!data[selected]) {
    // return d3.json(`data/air/${selected}_numMovements.json`, (ptData) => {
    d3.json(`data/air/${selected}_passengers_MOCK.json`, (ptData) => {
      data[selected] = ptData;
      showChart();
    });
  }
  showChart();
}

function showAirport() {
  // const fname = `data/air/combo_${selectedProv}_${selectedAirpt}_numMovements.json`;
  const fname = "data/air/CANADA_passengers_planed_MOCK.json";

  // Load airport data containing remaining provincial totals
  d3.json(fname, function(err, airport) {
    // selected = `${selectedProv}_${selectedAirpt}`; // "ON_YYZ";
    airportData[selected] = airport;
    d3.select("#Q2").select(".areaChartTitle")
        .text(`Passengers enplaned/deplaned at ${selectedAirpt} (x 1,000)`);
    areaChart(airportChart, settings, airportData[selected]);
  });

  // call airportData
}

// For map circles
let path;
const defaultPointRadius = 1.5;
const defaultStrokeWidth = 0.5;

const canadaMap = getCanadaMap(map)
    .on("loaded", function() {
    // TEMPORARY
      d3.select(".dashboard .map").selectAll("path").style("stroke", "black");
      const fakeTotDict = {
        "BC": 1131,
        "AB": 630,
        "SK": 149,
        "MB": 225,
        "ON": 1233,
        "QC": 621,
        "NB": 231,
        "NS": 84,
        "PE": 0,
        "NL": 87,
        "NT": 51,
        "NU": 0,
        "YK": 32
      };
      const totArr = [];
      for (let key in fakeTotDict) {
        totArr.push(fakeTotDict[key])
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

      for (const key in fakeTotDict) {
        if (fakeTotDict.hasOwnProperty(key)) {
          d3.select(".dashboard .map")
              .select("." + key).style("fill", colourMap(fakeTotDict[key]));
        }
      }
      // END TEMPORARY

      // d3.json("geojson/testairport.geojson", (error, airports) => {
      d3.json("geojson/vennAirport_96.geojson", (error, airports) => {
        if (error) throw error;

        const airportGroup = map.append("g");
        path = d3.geoPath().projection(this.settings.projection)
            .pointRadius(defaultPointRadius);

        airportGroup.selectAll("path")
            .data(airports.features)
            .enter().append("path")
            .attr("d", path)
            .attr("id", (d, i) => {
              return "airport" + d.id;
            })
            .attr("class", "airport")
            .on("mouseover", (d) => {
              selectedAirpt = d.properties.id;
              selectedProv = d.province;
              // change area chart title to match selected province
              // heading.text(`${selectedProv} and contribution from airport ${selectedAirpt}`);
              showAirport();
            });
      });
    });

map.on("click", () => {
  const transition = d3.transition().duration(1000);
  const classes = d3.event.target.classList;

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
});

i18n.load(["src/i18n"], showAreaData);
$(document).on("change", uiHandler);
