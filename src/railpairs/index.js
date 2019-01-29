import settings from "./stackedAreaSettings.js";
// import drawBubbles from "./drawbubbles.js";

const data = {};
let selectedRegion = "ATR";
let selectedComm = "meat";

// const regions = ["ATR", "QC", "ON", "MB", "SK", "AB", "BC"];
const regions = ["ATR", "ON"];
const remainingRegions = regions.filter(item => item !== selectedRegion);

const formatNumber = d3.format(","); // d3.format(".2f");
const format = function(d) {
  return formatNumber(d);
};

// ---------------------------------------------------------------------
/* globals areaChart */
const chartPair1 = d3.select("#pair1")
    .append("svg");
const chartPair2 = d3.select("#pair2")
    .append("svg");

// ---------------------------------------------------------------------
// global variables for drawBubbles fn
const rankedCommData = [];
let count = 0;
let years;
let maxVal;
let rankedCommNames; // temp

// ---------------------------------------------------------------------
function uiHandler(event) {
  if (event.target.id === "commodity") {
    selectedComm = document.getElementById("commodity").value;
  }
  if (event.target.id === "region") {
    selectedRegion= document.getElementById("region").value;
  }
  selectedRegion = selectedComm + "_from_" + selected;
  commToRegion = selectedComm + "_to_" + selected;

  if (!data[selectedRegion]) {
    // Read in chosen region as ORIGIN
    d3.json("data/rail/rail_" + selectedComm + "_orig" + selectedRegion+ "_all_dest.json", function(err, fileorig) {
      data[selectedRegion] = fileorig;
    });
  } else {
    showArea();
  }
}

// ---------------------------------------------------------------------
function showArea() {
  areaChart(chartPair1, settings, data[selectedRegion]);
}


// ---------------------------------------------------------------------
// Landing page displays
i18n.load(["src/i18n"], function() {
  // display total regional tonnages
  // showRadar();
  d3.json("data/rail/" + selectedComm + "_" + selectedRegion + ".json", function(err, json1) {
    data[selectedRegion] = json1;
    console.log("json1: ", json1);
    const numYears = json1.length;

    for (let idx = 0; idx < remainingRegions.length; idx++) {
      let thisReg = remainingRegions[idx]; // ON
      d3.json("data/rail/" + selectedComm + "_" + thisReg + ".json", function(err, json2) {
        console.log("thisReg: ", thisReg);
        data[thisReg] = json2;

        // Construct data object pair to send to stacked area chart
        const arrPair = [];
        for (let idx = 0; idx < numYears; idx++) {
          arrPair.push({
              year: data[thisReg][idx].year,
              [selectedRegion + "to" + thisReg]: data[selectedRegion][idx][thisReg],
              [thisReg + "to" + selectedRegion]: data[thisReg][idx][selectedRegion]
          });
        }
        console.log("arrPair: ", arrPair);

        // display annual tonnages for selectedRegion and thisReg pairs
        areaChart(chartPair1, settings, arrPair);

      }); // inner d3.json
    } // for loop
  }); // outer d3.json


});

$(document).on("change", uiHandler);
