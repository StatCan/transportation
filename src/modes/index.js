import makeSankey from "./makeSankey.js";
import tableSettings from "./tableSettings.js";

let selected = "CANADA";
let data;

const sankeyChart = d3.select("#sankeyGraph")
    .append("svg")
    .attr("id", "svg_sankeyChart");

const table = d3.select(".tabledata")
    // .append("svg")
    .attr("id", "chartTable");

function uiHandler(event) {
  if (event.target.id === "groups") {
    selected = document.getElementById("groups").value;
    if (!data[selected]) {
      d3.json("data/modes/" + selected + "_modes.json", function(err, filedata) {
        data[selected] = filedata;
        showData();
      });
    } else {
      showData();
    }
  }
}

function showData() {
  makeSankey(sankeyChart, data[selected]);
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
