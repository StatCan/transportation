const data = {};
let selected = "CANADA";

/* globals sankeyChart */
const margin = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};

const width = 460 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;

const sankeyChart = d3.select(".data")
    .append("svg")
    .attr("id", "sankey")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const sankey = d3.sankey()
    .nodeWidth(20)
    .nodePadding(10)
    .size([width, height]);

function uiHandler(event) {
  if (event.target.id === "groups") {
    selected = document.getElementById("groups").value;
    if (!data[selected]) {
      d3.json("data/modes/" + selected + "_modes.json", function(err, filedata) {
        console.log("filedata: ", filedata)
        data[selected] = filedata;
        showData();
      });
    } else {
      showData();
    }
  }
}

function showData() {
  makeSankey(sankeyChart, width, height, sankey, data[selected]);
}

i18n.load(["src/i18n"], function() {
  d3.queue()
      .defer(d3.json, "data/modes/canada_modes.json")
      .await(function(error, data) {
        console.log("data: ", data)
        makeSankey(sankeyChart, width, height, sankey, data);
      });
});

$(document).on("change", uiHandler);
