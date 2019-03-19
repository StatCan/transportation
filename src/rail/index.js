import settings from "./settings_barChart.js";
import settBubble from "./settings_bubbleTable.js";
// import createLegend from "./createLegend.js";

const allCommArr = []; // passed into bubbleTable()
let selectedRegion = "ON";
let selectedComm = "chems";

// const regions = ["AT", "QC", "ON", "MB", "SK", "AB", "BC", "US-MEX"];
const regions = ["AT", "ON", "QC", "MB", "SK", "AB", "BC"];
const remainingRegions = regions.filter((item) => item !== selectedRegion);

// ---------------------------------------------------------------------
const commTable = d3.select("#commgrid")
    .append("svg")
    .attr("id", "svg_commgrid");

// ---------------------------------------------------------------------
function uiHandler(event) {
  if (event.target.id === "commodity") {
    selectedComm = document.getElementById("commodity").value;
  }
  if (event.target.id === "originGeo") {
    selectedRegion= document.getElementById("originGeo").value;
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
/* -- display areaChart -- */
function showBubbleTable() {
  const thisText = "Total tonnage from all origins to all destinations (x 1M) for 10 commodities";
  d3.select("#commTableTitle")
      .text(thisText);

  bubbleTable(commTable, settBubble, allCommArr);
}

// ---------------------------------------------------------------------
// Landing page displays
i18n.load(["src/i18n"], function() {
  settings.x.label = i18next.t("x_label", {ns: "railArea"}),
  settings.y.label = i18next.t("y_label", {ns: "railArea"}),
  d3.queue()
      .defer(d3.json, "data/rail/All_coal.json")
      .defer(d3.json, "data/rail/All_mixed.json")
      .defer(d3.json, "data/rail/All_wheat.json")
      .defer(d3.json, "data/rail/All_ores.json")
      // .defer(d3.json, "data/rail/All_potash.json") // MISSING
      .defer(d3.json, "data/rail/All_lumber.json")
      .defer(d3.json, "data/rail/All_canola.json")
      .defer(d3.json, "data/rail/All_oils.json")
      .defer(d3.json, "data/rail/All_chems.json")
      .defer(d3.json, "data/rail/All_pulp.json")
      // .defer(d3.json, "data/rail/All_other.json")
      .await(function(error, allcoal, allmixed, allwheat, allores, alllumber, allcanola, alloils, allchems, allpulp) {
        allCommArr.push({"coal": allcoal});
        allCommArr.push({"mixed": allmixed});
        allCommArr.push({"ores": allores});
        // allCommArr.push({"potash": allpotash});
        allCommArr.push({"lumber": alllumber});
        allCommArr.push({"canola": allcanola});
        allCommArr.push({"oils": alloils});
        allCommArr.push({"chems": allchems});
        allCommArr.push({"pulp": allpulp});
        // allCommArr.push({"other": allother});

        showBubbleTable();


        d3.json("data/rail/" + selectedRegion + "_" + selectedComm + ".json", function(err, json1) {
          console.log("json1: ", json1);
          const numYears = Object.keys(json1).length;

          for (let idx = 0; idx < remainingRegions.length; idx++) {
            const targetRegion = remainingRegions[idx];
            d3.json("data/rail/" + targetRegion + "_" + selectedComm + ".json", function(err, json2) {
              // Construct data object pair to send to stacked area chart
              const arrPair = [];
              for (let idx = 0; idx < numYears; idx++) {
                const thisYear = Object.keys(json1)[idx];
                arrPair.push({
                  year: thisYear,
                  [selectedRegion + "to" + targetRegion]: json1[thisYear][targetRegion],
                  [targetRegion + "to" + selectedRegion]: json2[thisYear][selectedRegion]
                });
              }
            }); // inner d3.json
          } // for loop
        }); // outer d3.json

        // showComm(selectedRegion);
      });
});

$(document).on("change", uiHandler);
