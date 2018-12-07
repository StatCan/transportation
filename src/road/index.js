import settings from "./settings.js";

const data = {};
let selected = "CANADA";

const map = d3.select(".dashboard .map")
    .append("svg");
getCanadaMap(map); // .on("loaded", function() {});

/* globals areaChart */
const chart = d3.select(".data")
    .append("svg")
    .attr("id", "demo");

function uiHandler(event) {
  if (event.target.id === "groups") {
    selected = document.getElementById("groups").value;
    console.log("selected: ", selected)
    if (!data[selected]) {
      d3.json("data/road/" + selected + "_FuelSales.json", function(err, filedata) {
        data[selected] = filedata;
        showData();
      });
    } else {
      showData();
    }
  }
}

function showData() {
  // change area chart title to match selected province
  d3.select(".dashboard h4").text(i18next.t(selected, {ns: "provinces"}));
  areaChart(chart, settings, data[selected]);
}

i18n.load(["src/i18n"], function() {
  d3.queue()
      .defer(d3.json, "data/road/BC_FuelSales.json")
      .await(function(error, data) {
        areaChart(chart, settings, data);
      });
});

$(document).on("change", uiHandler);
