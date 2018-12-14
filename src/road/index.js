import settings from "./settings.js";

const data = {};
let selected = "CANADA";

const map = d3.select(".dashboard .map")
    .append("svg");
getCanadaMap(map).on("loaded", function() {
  d3.select(".dashboard .map").selectAll("path").style("stroke", "black");

  const fakeTotDict = {
    "BC": 4935834,
    "AB": 6368800,
    "SK": 1730149,
    "MB": 1614445,
    "ON": 16669930,
    "QC": 8820509,
    "NB": 1128764,
    "NS": 1252000,
    "PE": 216552,
    "NL": 749758,
    "NT": 42568,
    "NU": 15507,
    "YK": 72077
  };

  let totArr = [];
  for (var key in fakeTotDict) {
    totArr.push(fakeTotDict[key])
  }

  // https://d3js.org/colorbrewer.v1.js
  const colourArray= ['#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c'];

  totArr.sort(function(a, b){return a-b});

  const dimExtent = d3.extent(totArr);

  // colour map to take data value and map it to the colour of the level bin it belongs to
  const colourMap = d3.scaleLinear()
      .domain([dimExtent[0], dimExtent[1]])
      .range(colourArray);

  for (let key in fakeTotDict) {
    if (fakeTotDict.hasOwnProperty(key)) {
      d3.select(".dashboard .map")
          .select("." + key).style("fill", colourMap(fakeTotDict[key]));
    }
  }
}); // end map

map.on("mouseover", () => {
  const classes = d3.event.target.classList;

  d3.select(".dashboard .map")
      .select("." + classes[0])
      // .classed("roadMapClassed", true);
      .style("stroke", "#467B8D")
      .style("stroke-width", 0.5);
}).on("mouseout", () => {
  d3.select(".map")
      .selectAll("path")
      .style("stroke", "black")
      .style("stroke-width", 0.03);
});
map.on("click", () => {
  const classes = d3.event.target.classList;
  console.log("on click: ", classes[0]);
  selected = classes[0];
  if (selected === "YK") selected = "YT";
  console.log("selected: ", selected);
  console.log("data: ", data);

  d3.select(".dashboard .map")
      .select("." + classes[0])
      // .classed("roadMapClassed", true);
      .style("stroke", "#467B8D")
      .style("stroke-width", 0.5);

  // Display selected region in stacked area chart
  if (!data[selected]) {
    d3.json("data/road/" + selected + "_FuelSales.json", function(err, filedata) {
      data[selected] = filedata;
      showData();
    });
  } else {
    showData();
  }

  // update form menu
  console.log("menu", document.getElementById("groups").value);
});

/* globals areaChart */
const chart = d3.select(".data")
    .append("svg")
    .attr("id", "demo");

function uiHandler(event) {
  console.log("event: ", event)
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
      .defer(d3.json, "data/road/CANADA_FuelSales.json")
      .await(function(error, data) {
        areaChart(chart, settings, data);
      });
});

$(document).on("change", uiHandler);
