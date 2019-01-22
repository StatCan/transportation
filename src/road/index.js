import settings from "./stackedAreaSettings.js";

const data = {};
let selected = "CANADA";
const xaxisLabeldy = "2.5em";

const map = d3.select(".dashboard .map")
    .append("svg");
getCanadaMap(map).on("loaded", function() {
  d3.select(".dashboard .map").selectAll("path").style("stroke", "black");

  const totalDict = {
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
    "YT": 72077
  };

  const totArr = [];
  for (var key in totalDict) {
    totArr.push(totalDict[key])
  }

  // https://d3js.org/colorbrewer.v1.js
  const colourArray= ["#eff3ff", "#bdd7e7", "#6baed6", "#3182bd", "#08519c"];
  mapColourScaleFn(colourArray);

  totArr.sort(function(a, b) {
    return a-b;
  });

  const dimExtent = d3.extent(totArr);

  // colour map to take data value and map it to the colour of the level bin it belongs to
  const colourMap = d3.scaleLinear()
      .domain([dimExtent[0], dimExtent[1]])
      .range(colourArray);

  for (const key in totalDict) {
    if (totalDict.hasOwnProperty(key)) {
      d3.select(".dashboard .map")
          .select("." + key).style("fill", colourMap(totalDict[key]));
    }
  }
}); // end map

map.on("mouseover", () => {
  const classes = d3.event.target.classList;

  d3.select(".dashboard .map")
      .select("." + classes[0])
      .classed("roadMapHighlight", true);
}).on("mouseout", () => {
  if (selected) {
    d3.select(".map")
        .selectAll("path:not(." + selected + ")")
        .classed("roadMapHighlight", false);
  } else {
    d3.select(".map")
        .selectAll("path")
        .classed("roadMapHighlight", false);
  }
});
map.on("click", () => {
  // clear any previous clicks
  d3.select(".map")
      .selectAll("path")
      .classed("roadMapHighlight", false);

  const classes = d3.event.target.classList;
  selected = classes[0];

  d3.select(".dashboard .map")
      .select("." + classes[0])
      .classed("roadMapHighlight", true);

  // Display selected region in stacked area chart
  if (!data[selected]) {
    d3.json("data/road/" + selected + ".json", function(err, filedata) {
      data[selected] = filedata;
      showData();
    });
  } else {
    showData();
  }
  // update region displayed in dropdown menu
  d3.select("#groups")._groups[0][0].value = selected;
});

/* globals areaChart */
const chart = d3.select(".data")
    .append("svg")
    .attr("id", "svgFuel");

function uiHandler(event) {
  if (event.target.id === "groups") {
    selected = document.getElementById("groups").value;
    if (!data[selected]) {
      d3.json("data/road/" + selected + ".json", function(err, filedata) {
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
  d3.select("#svgFuel").select(".x.axis").select("text").attr("dy", xaxisLabeldy);
}

i18n.load(["src/i18n"], () => {
  settings.x.label = i18next.t("x_label", {ns: "roadArea"}),
  settings.y.label = i18next.t("y_label", {ns: "roadArea"}),
  d3.queue()
      .defer(d3.json, "data/road/CANADA.json")
      .await(function(error, data) {
        areaChart(chart, settings, data);
        d3.select("#svgFuel").select(".x.axis").select("text").attr("dy", xaxisLabeldy);
      });
});

$(document).on("change", uiHandler);
