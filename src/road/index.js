import settings from "./stackedAreaSettings.js";
import mapColourScaleFn from "../mapColourScaleFn.js";
import fillMapFn from "../fillMapFn.js";

const data = {};
const mapData = {};
let selected = "CANADA";
let selectedYear = "2017";
const units = "million dollars";
const xaxisLabeldy = "2.5em";
const mapScaleLabel = "Total Sales (" + units + ")";

/* SVGs */
// fuel sales stacked area chart
const chart = d3.select(".data")
    .append("svg")
    .attr("id", "svgFuel");
// Canada map
const map = d3.select(".dashboard .map")
    .append("svg");
// map colour bar
const margin = {top: 20, right: 0, bottom: 10, left: 20};
const width = 600 - margin.left - margin.right;
const height = 150 - margin.top - margin.bottom;
const svgCB = d3.select("#mapColourScale")
    .select("svg")
    .attr("width", width)
    .attr("height", height)
    .style("vertical-align", "middle");

getCanadaMap(map).on("loaded", function() {
  // Load CANADA.json into data if not already there
  if (!data["CANADA"]) {
    d3.json("data/road/CANADA.json", function(err, filedata) {
      data[selected] = filedata;
    });
  }

  d3.select(".dashboard .map").selectAll("path").style("stroke", "black");

  // Read map data (total fuel sales in each region for each year in ref period)
  if (!mapData[selectedYear]) {
    d3.json("data/road/canada_fuelSales_allyears.json", function(err, filedata) {
      // Extract data for selected year from obj and save in array format
      const thisTotalArray = [];
      thisTotalArray.push(filedata[selectedYear]);
      mapData[selectedYear] = thisTotalArray;
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

  if (classes.length > 0) {
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
  } else {
    // reset area chart to Canada
    selected = "CANADA";
    showData();
    // update region displayed in dropdown menu
    d3.select("#groups")._groups[0][0].value = selected;
  }
});

function showChloropleth(data) {
  console.log(data)
  const colourArray= ["#bdd7e7", "#6baed6", "#3182bd", "#08519c"];

  // colour map with fillMapFn and output dimExtent for colour bar scale
  const dimExtent = fillMapFn(data, colourArray);

  // colour bar scale and add label
  mapColourScaleFn(svgCB, colourArray, dimExtent);
  d3.select("#cbID").text(mapScaleLabel);
}

function showData() {
  areaChart(chart, settings, data[selected]);
  d3.select("#svgFuel").select(".x.axis").select("text").attr("dy", xaxisLabeldy);

  // Highlight region selected from menu on map
  d3.select(".dashboard .map")
      .select("." + selected)
      .classed("roadMapHighlight", true);
}

// -----------------------------------------------------------------------------
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
// -----------------------------------------------------------------------------

i18n.load(["src/i18n"], () => {
  settings.x.label = i18next.t("x_label", {ns: "roadArea"}),
  settings.y.label = i18next.t("y_label", {ns: "roadArea"}),
  settings.tableTitle = i18next.t("tableTitle", {ns: "roadArea"}),
  d3.queue()
      .defer(d3.json, "data/road/CANADA.json")
      .await(function(error, data) {
        data[selected] = data;
        areaChart(chart, settings, data[selected]);
        d3.select("#svgFuel").select(".x.axis").select("text").attr("dy", xaxisLabeldy);
      });
});

$(document).on("change", uiHandler);
