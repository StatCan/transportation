// import settings from "./stackedAreaSettings.js";
// import drawBubbles from "./drawbubbles.js";
//
// const data = {};
// let selectedRegion = "ATR";
// let selectedComm = "meat";
//
// // const regions = ["ATR", "QC", "ON", "MB", "SK", "AB", "BC", "USMEX"];
// const regions = ["ATR", "ON"];
//
// const formatNumber = d3.format(","); // d3.format(".2f");
// const format = function(d) {
//   return formatNumber(d);
// };
//
// // ---------------------------------------------------------------------
// /* globals areaChart */
// const chartPair1 = d3.select("#pair1")
//     .append("svg");
// // const areaChartToRegion = d3.select("#thisRegionFrom")
// //     .append("svg");
//
// // ---------------------------------------------------------------------
// // global variables for drawBubbles fn
// const rankedCommData = [];
// let count = 0;
// let years;
// let maxVal;
// let rankedCommNames; // temp
//
// // ---------------------------------------------------------------------
// function uiHandler(event) {
//   console.log("uiHandler");
// }
//
// // ---------------------------------------------------------------------
// function showArea() {
//   areaChart(chartPair1, settings, data[commFromRegion]);
//
// // ---------------------------------------------------------------------
// // Landing page displays
// i18n.load(["src/i18n"], function() {
//   for (let idx = 0; idx < regions.length; idx++) {
//     // d3.json("data/rail/" + selectedComm + regions[idx] + ".json", function(err, json) {
//     //   data[regions[idx]] = json;
//     //   let thisPair = "#pair" + idx + 1;
//     //   areaChart(thisPair, settings, data[regions[idx]]);
//     });
//   }
//
//
//     // display sorted commodity bubble table
//     // TO DO!!
//
// });
//
// $(document).on("change", uiHandler);
