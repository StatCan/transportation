import makeSankey from "./makeSankey.js";
import tableSettings from "./tableSettings.js";

let selectedGeo = "Canada";
let selectedMonth = "11";
let selectedYear = "2018";
let data = {};

const sankeyChart = d3.select("#sankeyGraph")
    .append("svg")
    .attr("id", "svg_sankeyChart");

const table = d3.select(".tabledata")
    .attr("id", "modesTable");

function uiHandler(event) {
  if (event.target.id === "groups" || event.target.id === "month" || event.target.id === "year") {
    selectedGeo = document.getElementById("groups").value;
    selectedMonth = document.getElementById("month").value;
    selectedYear = document.getElementById("year").value;

    if (!data[selectedYear + "-" + selectedMonth]) {
      d3.json("data/modes/" + selectedYear + "-" + selectedMonth + ".json", function(err, filedata) {
        data[selectedYear + "-" + selectedMonth] = filterZeros(filedata);
        showData();
      });
    } else {
      showData();
    }
  }
}

function showData() {
  d3.selectAll("svg > *").remove();
  makeSankey(sankeyChart, data[selectedYear + "-" + selectedMonth][selectedGeo]);
}

function filterZeros(d){
  var returnObject = {}
  for (var geo in d){
    returnObject[geo] = {}
    returnObject[geo].links = []
    for (var val of d[geo]){
      if (val.value !==0){
        returnObject[geo].links.push(val)
      }
    }
  }
  return returnObject;
}

i18n.load(["src/i18n"], function() {
  tableSettings.tableTitle = i18next.t("tableTitle", {ns: "modes"}),
  d3.queue()
      .defer(d3.json,"data/modes/" + selectedYear + "-" + selectedMonth  + ".json")
      .await(function(error, json) {
        data[selectedYear + "-" + selectedMonth] = filterZeros(json);
        makeSankey(sankeyChart, data[selectedYear + "-" + selectedMonth][selectedGeo]);
      });
});

$(document).on("change", uiHandler);
