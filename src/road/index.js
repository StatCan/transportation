import settings from "./stackedAreaSettings.js";

const data = {};
const mapData = {};
let selected = "CANADA";
let selectedYear = "2017";
const units = "$";
const xaxisLabeldy = "2.5em";

const map = d3.select(".dashboard .map")
    .append("svg");
getCanadaMap(map).on("loaded", function() {
  d3.select(".dashboard .map").selectAll("path").style("stroke", "black");

  // Read map data
  if (!mapData[selectedYear]) {
    d3.json("data/road/canada_fuelSales_" + selectedYear + ".json", function(err, filedata) {
      mapData[selectedYear] = filedata;
      showChloropleth(mapData[selectedYear]);
    });
  } else {
    showChloropleth(mapData[selectedYear]);
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

    // clear any map region that is highlighted
    d3.select(".map").selectAll("path").classed("roadMapHighlight", false);

    if (!data[selected]) {
      d3.json("data/road/" + selected + ".json", function(err, filedata) {
        data[selected] = filedata;
        showData();
      });
    } else {
      showData();
    }
  }
  if (event.target.id === "year") {
    selectedYear = document.getElementById("year").value;
    if (!mapData[selectedYear]) {
      d3.json("data/road/canada_fuelSales_" + selectedYear + ".json", function(err, filedata) {
        mapData[selectedYear] = filedata;
        showChloropleth(mapData[selectedYear]);
      });
    } else {
      showChloropleth(mapData[selectedYear]);
    }
  }
}

function showChloropleth(data) {
  const thisData = data[0];
  let dimExtent = [];
  let totArray = [];

  totArray = Object.values(thisData);

  // https://d3js.org/colorbrewer.v1.js
  const colourArray= ["#eff3ff", "#bdd7e7", "#6baed6", "#3182bd", "#08519c"];

  totArray.sort(function(a, b) {
    return a-b;
  });

  dimExtent = d3.extent(totArray);

  // colour map to take data value and map it to the colour of the level bin it belongs to
  const colourMap = d3.scaleLinear()
      .domain([dimExtent[0], dimExtent[1]])
      .range(colourArray);

  for (const key in thisData) {
    if (thisData.hasOwnProperty(key)) {
      d3.select(".dashboard .map")
          .select("." + key).style("fill", colourMap(thisData[key]));
    }
  }

  // colour bar scale
  mapColourScaleFn(colourArray, dimExtent, units);
}

function showData() {
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
