import settingsBar from "./settings_barChart.js";
import settBubble from "./settings_bubbleTable.js";
import mapColourScaleFn from "../mapColourScaleFn.js";
import fillMapFn from "../fillMapFn.js";
// import createLegend from "./createLegend.js";

const allCommArr = []; // passed into bubbleTable()
let selectedOrig = "AT";
let selectedDest = "QC";
let selectedComm = "chems";
let dataTag; // stores `${selectedOrig}_${selectedComm}`;
const scalef = 1e3;

const data = {}; // stores data for barChart
let selectedYear = "2016"
let domain; // Stores domain of flattened origJSON
let bar; // stores barChart() call
let mapData = {};
let canadaMap;



// ---------------------------------------------------------------------
/* SVGs */
// Canada map
const map = d3.select(".dashboard .map")
    .append("svg");

// Map colour bar
const margin = {top: 20, right: 0, bottom: 10, left: 20};
const width = 570 - margin.left - margin.right;
const height = 150 - margin.top - margin.bottom;
const svgCB = d3.select("#mapColourScale")
    .select("svg")
    .attr("class", "mapCB")
    .attr("width", width)
    .attr("height", height)
    .style("vertical-align", "middle");

/* -- shim all the SVGs (chart is already shimmed in component) -- */
d3.stcExt.addIEShim(map, 387.1, 457.5);
const div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

const chart = d3.select(".data.raildata")
    .append("svg")
    .attr("id", "svgBar");

const commTable = d3.select("#commgrid")
    .append("svg")
    .attr("id", "svg_commgrid");

// ---------------------------------------------------------------------
/* load data fn */
const loadBarData = function(selectedOrig, selectedComm, cb) {
  if (!data[dataTag]) {
    d3.json("data/rail/" + selectedOrig + "_" + selectedComm + ".json", function(err, filedata) {
      data[dataTag] = filedata;
      const s = {
        ...settingsBar,
        filterData: filterDataBar
      };
      cb(s);
    });
  } else {
    const s = {
      ...settingsBar,
      filterData: filterDataBar
    };
    cb(s);
  }
};
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

  dataTag = `${selectedOrig}_${selectedComm}`;
  updateTitles();

  loadBarData( selectedOrig, selectedComm, (s) => {
    showBarChartData(s);
  });
}
// -----------------------------------------------------------------------------
/* -- Map interactions -- */
// map.on("mousemove", () => {
//   if (d3.select(d3.event.target).attr("class")) {
//     // const classes = d3.event.target.classList;
//     const classes = (d3.select(d3.event.target).attr("class") || "").split(" "); // IE-compatible
//
//     if (classes[0] !== "svg-shimmed") {
//       // Highlight map region
//       const selectedPath = d3.select(".dashboard .map")
//           .select("." + classes[0]);
//
//       selectedPath.classed("roadMapHighlight", true);
//       selectedPath.moveToFront();
//       // Tooltip
//       const key = i18next.t(classes[0], {ns: "roadGeography"});
//       const value = formatComma(mapData[selectedYear][classes[0]] / scalef);
//       div
//           .style("opacity", .9);
//       div.html(
//           "<b>" + key + " (" + i18next.t("units", {ns: "road"}) + ")</b>"+ "<br><br>" +
//             "<table>" +
//               "<tr>" +
//                 "<td><b>" + value + "</td>" +
//               "</tr>" +
//             "</table>"
//       );
//
//       div
//           .style("left", ((d3.event.pageX +10) + "px"))
//           .style("top", ((d3.event.pageY +10) + "px"));
//     } else {
//       // clear tooltip for IE
//       div
//           .style("opacity", 0);
//     }
//   }
// });
//
// map.on("mouseout", () => {
//   div.transition()
//       .style("opacity", 0);
//
//   if (selectedRegion) {
//     d3.select(".map")
//         .selectAll("path:not(." + selectedRegion + ")")
//         .classed("roadMapHighlight", false);
//   } else {
//     d3.select(".map")
//         .selectAll("path")
//         .classed("roadMapHighlight", false);
//   }
// });
//
// map.on("click", () => {
//   // clear any previous clicks
//   d3.select(".map")
//       .selectAll("path")
//       .classed("roadMapHighlight", false);
//
//   if (d3.select(d3.event.target).attr("class") &&
//         d3.select(d3.event.target).attr("class").indexOf("svg-shimmed") === -1) {
//     const classes = (d3.select(d3.event.target).attr("class") || "").split(" "); // IE-compatible
//
//     selectedRegion = classes[0];
//     d3.select(".dashboard .map")
//         .select("." + classes[0])
//         .classed("roadMapHighlight", true)
//         .moveToFront();
//     updateTitles();
//
//     // Display selected region in stacked area chart
//     loadData(selectedRegion, () => {
//       showAreaData();
//     });
//
//     // update region displayed in dropdown menu
//     d3.select("#groups")._groups[0][0].value = selectedRegion;
//   } else {
//     // reset area chart to Canada
//     selectedRegion = "CANADA";
//     updateTitles();
//     showAreaData();
//
//     // update region displayed in dropdown menu
//     d3.select("#groups")._groups[0][0].value = selectedRegion;
//   }
// });

// -----------------------------------------------------------------------------
/* FNS */
function colorMap() {
  // store map data in array and plot colour
  const thisTotalArray = [];
  thisTotalArray.push(data[selectedOrig][selectedYear]);

  const colourArray = ["#AFE2FF", "#72C2FF", "#bc9dff", "#894FFF", "#5D0FBC"];
  const numLevels = colourArray.length;

  // colour map with fillMapFn and output dimExtent for colour bar scale
  const dimExtent = fillMapFn(thisTotalArray, colourArray, numLevels);

  // colour bar scale and add label
  mapColourScaleFn(svgCB, colourArray, dimExtent, colourArray.length, scalef);

  // Colourbar label (need be plotted only once)
  const mapScaleLabel = i18next.t("units", {ns: "rail"});
  d3.select("#cbTitle")
      .select("text")
      .text(mapScaleLabel)
      .attr("transform", function(d, i) {
        return "translate(203, 15)";
      });
}

// ---------------------------------------------------------------------
/* -- display barChart -- */
function filterDataBar() {
  const d = data[dataTag];
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

function showBarChartData(s) {
  barChart(chart, {...s, selectedOrig, selectedDest});
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

  settingsBar.tableTitle = i18next.t("tableTitle", {ns: "railTable",
    comm: thisComm, orig: thisOrig, dest: thisDest});
}

// ---------------------------------------------------------------------
// Landing page displays
i18n.load(["src/i18n"], function() {
  settingsBar.x.label = i18next.t("x_label", {ns: "railBar"}),
  settingsBar.y.label = i18next.t("y_label", {ns: "railBar"}),
  settingsBar.z.label = i18next.t("z_label", {ns: "railTable"}),
  d3.queue()
      .defer(d3.json, "data/rail/All_coal.json")
      .defer(d3.json, "data/rail/All_mixed.json")
      .defer(d3.json, "data/rail/All_wheat.json")
      .defer(d3.json, "data/rail/All_ores.json")
      .defer(d3.json, "data/rail/All_potash.json")
      .defer(d3.json, "data/rail/All_lumber.json")
      .defer(d3.json, "data/rail/All_canola.json")
      .defer(d3.json, "data/rail/All_oils.json")
      .defer(d3.json, "data/rail/All_chems.json")
      .defer(d3.json, "data/rail/All_pulp.json")
      .defer(d3.json, "data/road/CANADA.json")
      // .defer(d3.json, "data/rail/All_other.json")
      .await(function(error, allcoal, allmixed, allwheat, allores, allpotash, alllumber, allcanola, alloils, allchems, allpulp) {
        allCommArr.push({"coal": allcoal});
        allCommArr.push({"mixed": allmixed});
        allCommArr.push({"wheat": allwheat});
        allCommArr.push({"ores": allores});
        allCommArr.push({"potash": allpotash});
        allCommArr.push({"lumber": alllumber});
        allCommArr.push({"canola": allcanola});
        allCommArr.push({"oils": alloils});
        allCommArr.push({"chems": allchems});
        allCommArr.push({"pulp": allpulp});
        // allCommArr.push({"other": allother});

        canadaMap = getCanadaMap(map)
            .on("loaded", function() {
              colorMap();
            });
        d3.select("#mapTitleRail")
            .text(i18next.t("mapTitle", {ns: "rail"}));


        showBubbleTable();


        d3.json("data/rail/" + selectedOrig + "_" + selectedComm + ".json", function(err, origJSON) {
          dataTag = `${selectedOrig}_${selectedComm}`;
          data[dataTag] = origJSON;

          const s = {
            ...settingsBar,
            filterData: filterDataBar
          };
          showBarChartData(s, data);
        }); // outer d3.json


        updateTitles();
      });
});

$(document).on("change", uiHandler);
$(document).on("change", uiHandler);
d3.selection.prototype.moveToFront = function() {
  return this.each(function() {
    this.parentNode.appendChild(this);
  });
};
d3.selection.prototype.moveToBack = function() {
  return this.each(function() {
    const firstChild = this.parentNode.firstChild;
    if (firstChild) {
      this.parentNode.insertBefore(this, firstChild);
    }
  });
};
