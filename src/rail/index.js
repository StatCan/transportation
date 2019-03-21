import settingsBar from "./settings_barChart.js";
import settBubble from "./settings_bubbleTable.js";
// import createLegend from "./createLegend.js";

const allCommArr = []; // passed into bubbleTable()
let selectedOrig = "ON";
let selectedDest = "QC";
let selectedComm = "chems";
const scalef = 1e3;

// const regions = ["AT", "QC", "ON", "MB", "SK", "AB", "BC", "US-MEX"];

const data = {}; // stores data for barChart
let domain; // Stores domain of flattened origJSON
let bar; // stores barChart() call

// ---------------------------------------------------------------------
/* SVGs */
const chart = d3.select(".data.raildata")
    .append("svg")
    .attr("id", "svgBar");

const commTable = d3.select("#commgrid")
    .append("svg")
    .attr("id", "svg_commgrid");

// ---------------------------------------------------------------------
function uiHandler(event) {
  if (event.target.id === "commodity") {
    selectedComm = document.getElementById("commodity").value;
  }
  if (event.target.id === "originGeo") {
    selectedOrig = document.getElementById("originGeo").value;
  }
  if (event.target.id === "destGeo") {
    selectedDest = document.getElementById("destGeo").value;
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
/* -- display barChart -- */
function filterDataBar(data) {
  const d = data[selectedOrig];
  return [{
    category: `${this.selectedOrig}`,
    values: Object.keys(d).map((p) => {
      return {
        year: p,
        value: d[p][this.selectedDest] / scalef
      };
    })
  }];
}

function showBarChartData(s, data) {
  bar = barChart(chart, {...s, selectedOrig, selectedDest}, data);
  d3.select("#svgBar").select(".x.axis")
      .select("text")
      .attr("display", "none");
  d3.select("#svgBar").select(".x.axis").selectAll(".tick text").attr("dy", "0.85em");

  // createOverlay(stackedArea, data[selectedRegion], (d) => {
  //   areaTooltip(stackedArea.settings, divArea, d);
  // }, () => {
  //   divArea.style("opacity", 0);
  // });

  // // Highlight region selected from menu on map
  // d3.select(".dashboard .map")
  //     .select("." + selectedRegion)
  //     .classed("roadMapHighlight", true)
  //     .moveToFront();

  updateTitles();
  // plotLegend();
  // cButton.appendTo(document.getElementById("copy-button-container"));
  // dataCopyButton(data[selectedRegion]);
}

/* -- display areaChart -- */
function showBubbleTable() {
  const thisText = i18next.t("tableTitle", {ns: "railBubbleTable"});
  d3.select("#commTableTitle")
      .text(thisText);

  bubbleTable(commTable, settBubble, allCommArr);
}

/* -- update map and areaChart titles -- */
function updateTitles() {
  const thisComm = i18next.t(selectedComm, {ns: "commodities"});
  const thisOrig = i18next.t(selectedOrig, {ns: "railGeography"});
  const thisDest = i18next.t(selectedDest, {ns: "railGeography"});
  d3.select("#railTitleBarChart")
      .text(`${thisComm} from ${thisOrig} to ${thisDest}`);
}

// ---------------------------------------------------------------------
// Landing page displays
i18n.load(["src/i18n"], function() {
  settingsBar.x.label = i18next.t("x_label", {ns: "railBar"}),
  settingsBar.y.label = i18next.t("y_label", {ns: "railBar"}),
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


        d3.json("data/rail/" + selectedOrig + "_" + selectedComm + ".json", function(err, origJSON) {
          console.log("json1: ", origJSON);
          data[selectedOrig] = origJSON;

          domain = [0, 65]; // TEMP!!!

          const s = {
            ...settingsBar,
            filterData: filterDataBar
          };
          settingsBar.y.getDomain = () => {
            return domain;
          };

          showBarChartData(s, data);
        }); // outer d3.json


        updateTitles();
      });
});

$(document).on("change", uiHandler);
