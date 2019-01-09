const data = {};
let selected = "CANADA";


/* globals areaChart */
const chart = d3.select(".data")
    .append("svg")
    .attr("id", "demo");

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
  makeSankey(chart, data[selected]);
}

i18n.load(["src/i18n"], function() {
  d3.queue()
      .defer(d3.json, "data/mode/CANADA.json")
      .await(function(error, data) {
        makeSankey(chart, data);
      });
});

$(document).on("change", uiHandler);
