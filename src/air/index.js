import settings from "./stackedAreaSettings.js";
import settingsLineChart from "./settings_lineChart.js";
// import settingsLineChart from "./settings_bubbleTable.js";

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
let selected = "CANADA"; // default region for areaChart

let selectedAirpt;
let selectedProv;
const lineData = {};

/* canada map */
const heading = d3.select(".dashboard h4");

function uiHandler(event) {
  if (event.target.id === "groups") {
    selected = document.getElementById("groups").value; // clear any previous airport title
    d3.select(".dashboard h4").text("");
    showAreaData();
  }
}

function showAreaData() {
  const showChart = () => {
    areaChart(chart, settings, data[selected]);
  };
  // change area chart title to match selected province
  if (d3.select(".dashboard h4").text().indexOf("contribution from airport") === -1) {
    d3.select(".dashboard h4").text(i18next.t(selected, {ns: "provinces"}) + " (x 1,000)");
  }

  if (!data[selected]) {
    return d3.json(`data/air/${selected}_numMovements.json`, (ptData) => {
      data[selected] = ptData;
      showChart();
    });
  }
  showChart();
}

function showAirport() {
  if (!lineData[selectedAirpt]) {
    const fname = "data/air/CANADA_passengers_planed_MOCK.json";
    // return d3.json(`data/air/rankdata_${selectedAirpt}.json`, (aptData) => {
    return d3.json(fname, (aptData) => {
      lineData[selectedAirpt] = aptData;
      console.log("call lineChart")
      lineChart(chart2, settingsLineChart, lineData[selectedAirpt]);
    });
  }
  lineChart(chart2, settingsLineChart, lineData[selected_airpt]);
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

      d3.json("geojson/vennAirport.geojson", (error, airports) => {
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
            .attr("class", "airport")
            .on("mouseover", (d) => {
              selectedAirpt = d.properties.id;
              selectedProv = d.properties.province;
              // change area chart title to match selected province
              heading.text(`${selectedProv} and contribution from airport ${selectedAirpt}`);
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
