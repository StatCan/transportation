import settings from "./settings_lineChart.js";
import settingsBar from "./settings_barChart.js";
import settBubble from "./settings_bubbleTable.js";
import createLegend from "./createLegend.js";

// const data = {};
let selectedRegion = "ON";
let selectedComm = "chems"; // "coal";

// const regions = ["AT", "QC", "ON", "MB", "SK", "AB", "BC", "US-MEX"];
const regions = ["AT", "ON", "QC", "MB", "SK", "AB", "BC"];
const remainingRegions = regions.filter((item) => item !== selectedRegion);

// const formatNumber = d3.format(","); // d3.format(".2f");
// const format = function(d) {
//   return formatNumber(d);
// };

// ---------------------------------------------------------------------
/* SVGs */
const chartPair1 = d3.select("#pair1")
    .append("svg")
    .attr("id", "svg_pair1");
const bar1 = d3.select("#bar1")
    .append("svg")
    .attr("id", "svg_bar1");

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
    const numYears = Object.keys(json1).length;
    const years = Object.keys(json1); // array

    // for (let idx = 0; idx < remainingRegions.length; idx++) {
    for (let idx = 0; idx < 1; idx++) {
      const targetRegion = remainingRegions[idx];
      d3.json("data/rail/" + targetRegion + "_" + selectedComm + ".json", function(err, json2) {
         // Construct array to send to bar chart
         const keys = [selectedRegion + "to" + targetRegion];
         console.log("keys: ", keys)
          const rtn = keys.map((d) => {
          return {
            id: d,
            values: years.map((p) => {
              return {
                year: p,
                value: json1[parseInt(p)][targetRegion]
              };
            })
          };
        });
        console.log("rtn: ", rtn)
        barChart(bar1, settingsBar, rtn);


        // const arrBar = [];
        // for (let idx = 0; idx < numYears; idx++) {
        //   const thisYear = Object.keys(json1)[idx];
        //   arrBar.push({
        //     category: selectedRegion + "to" + targetRegion,
        //     values: 
        //     [selectedRegion + "to" + targetRegion]: json1[thisYear][targetRegion],
        //     [targetRegion + "to" + selectedRegion]: json2[thisYear][selectedRegion]
        //   });
        // }
        // console.log("arrBar: ", arrBar);

        // -----------------------------------------------------------------------
        // Construct data object pair to send to line chart
        const arrPair = [];
        for (let idx = 0; idx < numYears; idx++) {
          const thisYear = Object.keys(json1)[idx];
          arrPair.push({
            year: thisYear,
            [selectedRegion + "to" + targetRegion]: json1[thisYear][targetRegion],
            [targetRegion + "to" + selectedRegion]: json2[thisYear][selectedRegion]
          });
        }
        console.log("arrPair: ", arrPair);

        // send to lineChart
        if (idx == 0) {
          lineChart(chartPair1, settings, arrPair);
          createLegend([selectedRegion, targetRegion], "#legend1");
        }
      }); // inner d3.json
    } // for loop
  }); // outer d3.json

  showComm(selectedRegion);
});

$(document).on("change", uiHandler);
