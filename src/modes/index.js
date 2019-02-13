import makeSankey from "./makeSankey.js";
import tableSettings from "./tableSettings.js";

let selectedGeo = "Canada"; // "Canada";
let selectedMonth = "01";
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
        console.log("new uiHandler data: ", data)
        showData();
      });
    } else {
      console.log("old uiHandler data: ", data)
      console.log("old uiHandler selectedGeo: ", selectedGeo)
      const thisData = data[selectedYear + "-" + selectedMonth];
      const thisMonth = i18next.t(selectedMonth, {ns: "modesMonth"});
     
      if (thisData[selectedGeo].links.length === 0) {
        console.log("zero data[selectedGeo]: ", thisData[selectedGeo])
        d3.selectAll("svg > *").remove();
        d3.select("#zeroFlag")
            .text(`Zero international travellers for ${selectedGeo}, 
              ${thisMonth} ${selectedYear}`);
      }
      else {
        console.log("no zero links")
        showData();
      }
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
  console.log("returnObject: ", returnObject)
  console.log("keys: ", Object.keys(returnObject))
  const keys = Object.keys(returnObject);

  // Loop through keys and check if all keys.links.length > 0
  keys.map((d) => {
    if (returnObject[d].links.length === 0) {
      console.log("d key: ", d)
      console.log("returnObject in here: ",returnObject)
      console.log(returnObject[d].links)
      console.log(returnObject[d].links.length)

    }
    
  });
  

  // if (returnObject.filter(e => e.name === 'Magenic').length > 0) {
  // }
  return returnObject;
}

i18n.load(["src/i18n"], function() {
  tableSettings.tableTitle = i18next.t("tableTitle", {ns: "modes"}),
  d3.queue()
      .defer(d3.json,"data/modes/" + selectedYear + "-" + selectedMonth  + ".json")
      .await(function(error, json) {
        console.log("load data: ", data)
        data[selectedYear + "-" + selectedMonth] = filterZeros(json);
        console.log("load data after filterZeros: ", data)
        console.log("selectedGeo: ", selectedGeo)
        makeSankey(sankeyChart, data[selectedYear + "-" + selectedMonth][selectedGeo]);
      });
});

$(document).on("change", uiHandler);
