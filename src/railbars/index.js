import settings from "./settings_lineChart.js";
import settingsBar from "./settings_barChart.js";
import settBubble from "./settings_bubbleTable.js";
// import createLegend from "./createLegend.js";

// const data = {};
let selectedRegion = "ON";
let selectedComm = "chems"; // "coal";
let domain; // Stores domain of flattened json1
const scalef = 1e3; // scale factor for data values

// const regions = ["AT", "QC", "ON", "MB", "SK", "AB", "BC", "US-MEX"];
const regions = ["AT", "ON", "QC", "MB", "SK", "AB", "BC"];
const getRemainingRegions = () => regions.filter((item) => item !== selectedRegion);

// const formatNumber = d3.format(","); // d3.format(".2f");
// const format = function(d) {
//   return formatNumber(d);
// };

// ---------------------------------------------------------------------
/* SVGs */
// const chartPair1 = d3.select("#pair1")
//     .append("svg")
//     .attr("id", "svg_pair1");

const barSVG = [];
for (let c = 0; c < getRemainingRegions().length; c++) {
  barSVG.push(d3.select(`#bar${c}`)
      .append("svg")
      .attr("id", `svg_bar${c}`));
}

// barChart title divs
const titleDIV = [];
for (let c = 0; c < getRemainingRegions().length; c++) {
  titleDIV.push(`#bar${c}Title`);
}

// ---------------------------------------------------------------------
// global variables for commodities bubble table
// const rankedCommData = [];
// let count = 0;
// let years;
// let maxVal;
// let rankedCommNames; // temp
const commTable = d3.select("#commgrid")
    .append("svg")
    .attr("id", "svg_commgrid");

// ---------------------------------------------------------------------
function uiHandler(event) {
  if (event.target.id === "commodity") {
    selectedComm = document.getElementById("commodity").value;
  }
  if (event.target.id === "region") {
    selectedRegion= document.getElementById("region").value;
  }

  // TO DO
  // if (!data[selectedRegion]) {
  //   // Read in chosen region as ORIGIN
  //   d3.json("data/rail/rail_" + selectedComm + "_orig" + selectedRegion+ "_all_dest.json", function(err, fileorig) {
  //     data[selectedRegion] = fileorig;
  //   });
  // } else {
  //   showArea();
  // }
}

// ---------------------------------------------------------------------
// FUNCTIONS
// function showArea() {
//   lineChart(chartPair1, settings, data[selectedRegion]);
// }
function showComm(region) {
  const thisText = "Total tonnage from all origins to all destinations (x 1M) for 10 commodities";
  d3.select("#commTableTitle")
      .text(thisText);

  // Read commodities file for selected region
  d3.json("data/rail/commdata_allOrig_allDest.json", function(err, json) {
    sortComm(json);
    bubbleTable(commTable, settBubble, json);
  });
}
function sortComm(data) {
  console.log("sort the data!");
}
function filterDataBar(d) {
  return [{
    category: `${this.selectedRegion}to${this.targetRegion}`,
    values: Object.keys(d).map((p) => {
      return {
        year: p,
        value: d[parseInt(p, 10)][this.targetRegion] / scalef
      };
    })
  }];
}
/* -- update map and areaChart titles -- */
function updateTitles(idx) {
  const geography = i18next.t(selectedRegion, {ns: "railGeography"});
  const comm = i18next.t(selectedComm, {ns: "commodities"});

  // Title for group of bar charts
  d3.select("#barChartTitle")
      .text(`${comm} transported by rail from ${geography} to all destinations`);

  // individual bar chart titles
  const targetGeo = i18next.t(getRemainingRegions()[idx], {ns: "railGeography"});
  d3.select(titleDIV[idx])
      .text(targetGeo);
}
// ---------------------------------------------------------------------
// Landing page displays
i18n.load(["src/i18n"], function() {
  settings.x.label = i18next.t("x_label", {ns: "railArea"}),
  settings.y.label = i18next.t("y_label", {ns: "railArea"}),
  settingsBar.x.label = i18next.t("x_label", {ns: "railBar"}),
  settingsBar.y.label = i18next.t("y_label", {ns: "railBar"}),
  // settBubble.z.getText = i18next.t("y_label", {ns: "commodities"}),

  d3.json("data/rail/" + selectedRegion + "_" + selectedComm + ".json", function(err, json1) {
    console.log("json1: ", json1);
    // const numYears = Object.keys(json1).length;
    // const years = Object.keys(json1); // array
    const remainingRegions = getRemainingRegions();
    domain = [0, 65];

    const s = {
      ...settingsBar,
      filterData: filterDataBar
    };
    settingsBar.y.getDomain = () => {
      return domain;
    };

    for (let idx = 0; idx < remainingRegions.length; idx++) {
      const targetRegion = remainingRegions[idx];
      // barChart(eval(`bar${idx}`), {...s, selectedRegion, targetRegion}, json1);
      const thisSVG = barSVG[idx];
      barChart(thisSVG, {...s, selectedRegion, targetRegion}, json1);
      // rotate x-axis labels
      d3.selectAll(".railBar")
          .selectAll(".x.axis")
          .selectAll(".tick")
          .selectAll("text")
          .attr("transform", "rotate(-45)")
          .style("text-anchor", "end");
      updateTitles(idx);
    }
  }); // outer d3.json

  showComm(selectedRegion);
});

$(document).on("change", uiHandler);
