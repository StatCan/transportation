import settings from "./stackedAreaSettings.js";
import mapColourScaleFn from "../mapColourScaleFn.js";
import fillMapFn from "../fillMapFn.js";

const data = {};
let mapData = {};
let selected = "CANADA";
let selectedYear = "2017";
const units = "millions of dollars";
const xaxisLabeldy = "2.5em";
const mapScaleLabel = "Total (" + units + ")";
const formatComma = d3.format(",d");

// -----------------------------------------------------------------------------
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
const width = 510 - margin.left - margin.right;
const height = 150 - margin.top - margin.bottom;
const svgCB = d3.select("#mapColourScale")
    .select("svg")
    .attr("width", width)
    .attr("height", height)
    .style("vertical-align", "middle");

// -----------------------------------------------------------------------------
/* tooltip */
const div = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);
const divArea = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


// -----------------------------------------------------------------------------
/* Map interactions */
map.on("mouseover", () => {
  if (d3.select(d3.event.target).attr("class")) {
    // const classes = d3.event.target.classList;
    const classes = (d3.select(d3.event.target).attr("class") || "").split(" "); // IE-compatible

    // Highlight map region
    d3.select(".dashboard .map")
        .select("." + classes[0])
        .classed("roadMapHighlight", true);
    // Tooltip
    const key = i18next.t(classes[0], {ns: "roadGeography"});
    const value = formatComma(mapData[selectedYear][classes[0]]);
    div.transition()
       .style("opacity", .9);
    div.html(
        "<b>" + key + "</b>"+ "<br><br>" +
          "<table>" +
            "<tr>" + 
              "<td><b>$" + value  + "</td>" +
              // "<td>" + " (" + units + ")</td>" +
            "</tr>" +
          "</table>"
        )
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY) + "px");
  }
}).on("mouseout", () => {
  div.transition()
     .style("opacity", 0);

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

  if (d3.select(d3.event.target).attr("class") &&
        d3.select(d3.event.target).attr("class").indexOf("svg-shimmed") === -1) {
    const classes = (d3.select(d3.event.target).attr("class") || "").split(" "); // IE-compatible

    selected = classes[0];
    d3.select(".dashboard .map")
        .select("." + classes[0])
        .classed("roadMapHighlight", true);

    // Display selected region in stacked area chart
    if (!data[selected]) {
      d3.json("data/road/" + selected + ".json", function(err, filedata) {
        data[selected] = filedata;
           console.log("showData 3")
        showData();
      });
    } else {
         console.log("showData 4")
      showData();
    }
    // update region displayed in dropdown menu
    d3.select("#groups")._groups[0][0].value = selected;
  } else {
    // reset area chart to Canada
    selected = "CANADA";
       console.log("showData 5")
    showData();

    // update region displayed in dropdown menu
    d3.select("#groups")._groups[0][0].value = selected;
  }
  // Chart titles
  updateTitles();
});

/*  areaChart interactions */
// vertical line to help orient the user while exploring the streams
const vertical = d3.select("#annualTimeseries")
    .append("div")
    .attr("class", "remove")
    .style("position", "absolute")
    .style("z-index", "0")
    .style("width", "2px")
    .style("height", "310px")
    .style("top", "60px")
    .style("bottom", "70px")
    .style("left", "0px")
    .style("background", "#ccc");

let idx;
let thisValue;
d3.select("#annualTimeseries")
  .on("mousemove", function() {
    // const xref = [0.0782, 137.114, 274.150, 411.560, 548.60, 685.630, 822.670];
    const xref = [62, 149, 234, 321, 404, 491, 576];
    const xrefMid = [xref[0] + (xref[1] - xref[0])/2, xref[1] + (xref[1] - xref[0])/2,
    xref[2] + (xref[1] - xref[0])/2, xref[3] + (xref[1] - xref[0])/2,
    xref[4] + (xref[1] - xref[0])/2, xref[5] + (xref[1] - xref[0])/2,
    xref[6] + (xref[1] - xref[0])/2];
    const mouse = d3.mouse(this);
    const mousex = mouse[0];
    vertical.style("left", mousex + "px" );
    console.log("mouse: ", mouse);

    if ( mousex < xrefMid[0] ) {
      idx = 0;
      console.log("2010: ", idx)
    } else if (  mousex < xrefMid[1]  ) {
      idx = 1;
      console.log("2011: ", idx)
    } else if (  mousex < xrefMid[2]  ) {
      idx = 2;
      console.log("2012: ", idx)
    } else if (  mousex < xrefMid[3]  ) {
      idx = 3;
      console.log("2013: ", idx)
    } else if (  mousex < xrefMid[4]  ) {
      idx = 4;
      console.log("2014: ", idx)
    } else if (  mousex < xrefMid[5]  ) {
      idx = 5;
      console.log("2015: ", idx)
    } else if (  mousex < xrefMid[6]  ) {
      idx = 6;
      console.log("2016: ", idx)
    } else if (  mousex > xrefMid[6]  ) {
      idx = 7;
      console.log("2017: ", idx)
    }


    chart
      .on("mouseover", (d) => {
        // Tooltip
        const root = d3.select(d3.event.target);

        if (root._groups[0][0].__data__) {
          const thisArray = root._groups[0][0].__data__;
          const thisYear = thisArray[idx];
          thisValue = formatComma(thisYear[1] - thisYear[0]);
        }
      
    });

    if (thisValue) {
      divArea.transition()
        .style("opacity", .9);
      divArea.html(
        "<b>" + "TYPE" + "</b>"+ "<br><br>" +
          "<table>" +
            "<tr>" + 
              "<td><b>$" + thisValue  + "</td>" +
              // "<td>" + " (" + units + ")</td>" +
            "</tr>" +
          "</table>"
        )
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY) + "px");

    }


  })
  // .on("mouseover", function() {
  //   const mouse = d3.mouse(this);
  //   const mousex = mouse[0] + 5;
  //   vertical.style("left", mousex + "px");
  //   console.log("mouseover mousex: ", mousex)
  // });

chart
  .on("mouseover", (d) => {

    // const mouseCoords = [d3.event.pageX, d3.event.pageY];
    // console.log("X: ", mouseCoords)
    // // Tooltip
    // const root = d3.select(d3.event.target);

    // if (root._groups[0][0].__data__) {
    //   const thisArray = root._groups[0][0].__data__;
    //   console.log("thisArray: ", thisArray)

    //   divArea.transition()
    //      .style("opacity", .9);
    //   divArea.html(
    //       "<b>" + "TYPE" + "</b>"+ "<br><br>" +
    //         "<table>" +
    //           "<tr>" + 
    //             "<td><b>$" + 1000  + "</td>" +
    //             // "<td>" + " (" + units + ")</td>" +
    //           "</tr>" +
    //         "</table>"
    //       )
    //       .style("left", (d3.event.pageX) + "px")
    //       .style("top", (d3.event.pageY) + "px");
    // }
  
});

// -----------------------------------------------------------------------------
/* FNS */
function colorMap() {
  // store map data in array and plot colour
  const thisTotalArray = [];
  thisTotalArray.push(mapData[selectedYear]);

  const colourArray = ["#bdd7e7", "#6baed6", "#3182bd", "#08519c"];

  // colour map with fillMapFn and output dimExtent for colour bar scale
  const dimExtent = fillMapFn(thisTotalArray, colourArray);

  // colour bar scale and add label
  mapColourScaleFn(svgCB, colourArray, dimExtent);
  d3.select("#cbID").text(mapScaleLabel);
}

function showData() {
     console.log("showData fn")
  areaChart(chart, settings, data[selected]);
  d3.select("#svgFuel").select(".x.axis")
      .select("text")
      .attr("dy", xaxisLabeldy)
      .attr("display", "none");

  // Highlight region selected from menu on map
  d3.select(".dashboard .map")
      .select("." + selected)
      .classed("roadMapHighlight", true);
}

function updateTitles() {
  const geography = i18next.t(selected, {ns: "roadGeography"});
  d3.select("#mapTitleRoad")
      .text("Total fuel sales, " + geography + ", " + selectedYear);
  d3.select("#areaTitleRoad")
      .text("Type of fuel sales, " + geography);
}

// -----------------------------------------------------------------------------
/* uiHandler*/
function uiHandler(event) {
  if (event.target.id === "groups") {
    selected = document.getElementById("groups").value;

    // clear any map region that is highlighted
    d3.select(".map").selectAll("path").classed("roadMapHighlight", false);
    // Chart titles
    updateTitles();

    if (!data[selected]) {
      d3.json("data/road/" + selected + ".json", function(err, filedata) {
        data[selected] = filedata;
        console.log("showData 1")
        showData();
      });
    } else {
         console.log("showData 2")
      showData();
    }
  }
  if (event.target.id === "year") {
    selectedYear = document.getElementById("year").value;
    updateTitles(); // update to reflect new menu selections for all charts
    colorMap();
  }
}

// -----------------------------------------------------------------------------
/* Initial page load */
i18n.load(["src/i18n"], () => {
  settings.x.label = i18next.t("x_label", {ns: "roadArea"}),
  settings.y.label = i18next.t("y_label", {ns: "roadArea"}),
  settings.tableTitle = i18next.t("tableTitle", {ns: "roadArea"}),
  d3.queue()
      .defer(d3.json, "data/road/Annual_Totals.json")
      .defer(d3.json, "data/road/CANADA.json")
      .await(function(error, mapfile, areafile) {
        mapData = mapfile;
        data[selected] = areafile;

        getCanadaMap(map)
            .on("loaded", function() {
              d3.stcExt.addIEShim(map, 377, 457);
              colorMap();
            });

        // Area chart and x-axis position
        console.log("areaChart 1: ", data[selected])
        areaChart(chart, settings, data[selected]);
        d3.select("#svgFuel").select(".x.axis")
            .select("text")
            .attr("dy", xaxisLabeldy)
            .attr("display", "none");

        // Show chart titles based on default menu options
        updateTitles();
      });
});

$(document).on("change", uiHandler);
