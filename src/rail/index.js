import settings from "./settings_barChart.js";
import settBubble from "./settings_bubbleTable.js";
import createLegend from "./createLegend.js";

let allCommArr = []; // passed into bubbleTable()
let selectedRegion = "ON";
let selectedComm = "chems"; // "coal";
let commodityGrid; // stores bubbleTable() call

// const regions = ["AT", "QC", "ON", "MB", "SK", "AB", "BC", "US-MEX"];
const regions = ["AT", "ON", "QC", "MB", "SK", "AB", "BC"];
const remainingRegions = regions.filter((item) => item !== selectedRegion);
const commList = ["coal", "mixed", "wheat", "ores", "lumber", "canola", "oils", "chems", "pulp", "other"];

// ---------------------------------------------------------------------
/* globals lineChart */
const chartPair1 = d3.select("#pair1")
    .append("svg")
    .attr("id", "svg_pair1");

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
  commodityGrid = bubbleTable(commTable, settBubble, allCommArr);
}

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


        // const coalTot = getCommTot(allcoal, "coal");

        let allCommArr = [];
        allCommArr.push({"coal": allcoal});
        allCommArr.push({"mixed": allmixed});
        console.log(allCommArr)
        // getCommTot(allcoal, "coal");
        console.log(getCommTot(allCommArr))


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

function getCommTot(object) {
  let totComm = [];
  const years = Object.keys(object[0]["coal"]);
  for (let idx = 0; idx < years.length; idx++) {
    const eachObj = {
      "year": years[idx],
      [thisComm]: thisComm
    };

    for (let jdx = 0; jdx < object.length; jdx++) {
      let thisComm = Object.keys(object[jdx])[0];
      const eachObj = {
        "year": years[idx],
        [thisComm]: thisComm
      };
      console.log(eachObj)
    }

    // totComm.push({keys[idx]: })
  }

  // let all = 0;
  // for (let idx = 0; idx < Object.keys(object).length; idx++) {
  //   all = all + object[Object.keys(object)[idx]].All;
  // }
  // return all;
}
