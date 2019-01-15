// import makeSankey from './makeSankey.js'
const data = {};
let selected = "CANADA";

// set the dimensions and margins of the graph
const margin = {top: 10, right: 10, bottom: 10, left: 10};
const width = 700 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom;

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
        makeSankey("#sankeyGraph", data, width);
      });
});

$(document).on("change", uiHandler);
