import makeSankey from "./makeSankey.js";

let selected = "CANADA";
let data;

const sankeyChart = d3.select("#sankeyGraph")
    .append("svg")
    .attr("id", "svg_sankeyChart");

function uiHandler(event) {
  if (event.target.id === "groups") {
    selected = document.getElementById("groups").value;
    if (!data[selected]) {
      console.log("selected: ", selected);
      d3.json("data/modes/" + selected + "_modes.json", function(err, filedata) {
        data[selected] = filedata;
        console.log("data/modes/" + selected + "_modes.json");
        console.log("filedata: ", filedata);
        console.log(data);
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
  d3.queue()
      .defer(d3.json, "data/modes/canada_modes.json")
      .await(function(error, json) {
        data = json;
        makeSankey(sankeyChart, data);
      });
});

$(document).on("change", uiHandler);
