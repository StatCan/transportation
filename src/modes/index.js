import makeSankey from "./makeSankey.js";
import tableSettings from "./tableSettings.js";

let selectedGeo = "CANADA";
let selectedMonth;
let selectedYear;
let data;

const sankeyChart = d3.select("#sankeyGraph")
    .append("svg")
    .attr("id", "svg_sankeyChart");

const table = d3.select(".tabledata")
    .attr("id", "modesTable");

function uiHandler(event) {
  if (event.target.id === "groups") {
    selectedGeo = document.getElementById("groups").value;
    selectedMonth = document.getElementById("month").value;
    selectedYear = document.getElementById("year").value;

    if (!data[selectedGeo]) {
      d3.json("data/modes/" + selectedMonth + "_" modes.json", function(err, filedata) {
        data[selectedGeo] = filedata;
        showData();
      });
    } else {
      showData();
    }
  }
}

function showData() {
  makeSankey(sankeyChart, data[selectedGeo]);
}

i18n.load(["src/i18n"], function() {
  tableSettings.tableTitle = i18next.t("tableTitle", {ns: "modes"}),
  d3.queue()
      .defer(d3.json, "data/modes/canada_modes.json")
      .await(function(error, json) {
        data = json;
        makeSankey(sankeyChart, data);
        drawTable(table, tableSettings, data);
      });
});

$(document).on("change", uiHandler);
