import makeSankey from './makeSankey.js'
const data = {};
let selected = "CANADA";

/* globals sankeyChart */
// const sankeyChart = d3.select(".data")
//     .append("svg")
//     .attr("id", "sankey")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const sankeyChart = d3.select("#sankeyGraph")
    .append("svg")
    .attr("id", "svg_sankeyChart");

function uiHandler(event) {
  if (event.target.id === "groups") {
    selected = document.getElementById("groups").value;
    if (!data[selected]) {
      d3.json("data/modes/" + selected + "_modes.json", function(err, filedata) {
        console.log("filedata: ", filedata);
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
  d3.queue()
      .defer(d3.json, "data/modes/canada_modes.json")
      .await(function(error, data) {
        console.log("data: ", data)
        makeSankey(sankeyChart, data);
      });
});

$(document).on("change", uiHandler);
