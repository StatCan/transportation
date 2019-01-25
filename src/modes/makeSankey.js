// function makeSankey(svgID, graph) {
const defaults = {
  aspectRatio: 16 / 14,
  width: 1100,
  margin: {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  }
};

export default function(svg, graph) {
  const colourDict = {
  // level 1
    "intl": "#607890",
    // level 2
    "USres": "#CC982A",
    "nonUS": "#928941",
    "cdnFromUS": "#FFDC68",
    "cdnFromOther": "#FAB491",
    // level 3
    "USres_land": "#CC982A",
    "USres_air": "#CC982A",
    "USres_marine": "#CC982A",
    // level 4 of level 3 USres
    "USres_car": "#CC982A",
    "USres_bus": "#CC982A",
    "USres_train": "#CC982A",
    "USres_other": "#CC982A",

    "nonUS_land": "#928941",
    "nonUS_air": "#928941",
    "nonUS_marine": "#928941",

    "cdnFromUS_land": "#FFDC68",
    "cdnFromUS_air": "#FFDC68",
    "cdnFromUS_marine": "#FFDC68",
    // level 4 of level 3 cdnFromUS
    "cdnFromUS_car": "#FFDC68",
    "cdnFromUS_bus": "#FFDC68",
    "cdnFromUS_train": "#FFDC68",
    "cdnFromUS_other": "#FFDC68",

    "cdnFromOther_land": "#FAB491",
    "cdnFromOther_air": "#FAB491",
    "cdnFromOther_marine": "#FAB491"
  };

  // set the dimensions and margins of the graph
  const mergedSettings = defaults;
  const outerWidth = mergedSettings.width;
  const outerHeight = Math.ceil(outerWidth / mergedSettings.aspectRatio);
  const innerHeight = mergedSettings.innerHeight = outerHeight - mergedSettings.margin.top - mergedSettings.margin.bottom;
  const innerWidth = mergedSettings.innerWidth = outerWidth - mergedSettings.margin.left - mergedSettings.margin.right;
  let chartInner = svg.select("g.margin-offset");
  let dataLayer = chartInner.select(".data");

mergedSettings.innerHeight = outerHeight - mergedSettings.margin.top - mergedSettings.margin.bottom;

  // format variables
  const formatNumber = d3.format(",.0f"); // zero decimal places
  const format = function(d) {
    return formatNumber(d);
  };

  // append the svg object to the body of the page
  // var svg = d3.select(svgID).append("svg")
  //     .attr("width", width + margin.left + margin.right)
  //     .attr("height", height + margin.top + margin.bottom)
  //   .append("g")
  //     .attr("transform",
  //           "translate(" + margin.left + "," + margin.top + ")");

  // Set the sankey diagram properties
  const sankey = d3.sankey()
      .nodeWidth(36)
      .nodePadding(40)
      .size([innerWidth, innerHeight]);

  var path = sankey.link();


  // d3.json("data/modes/canada_modes_test.json", function(error, graph) {
  function make(graph) {
    sankey
        .nodes(graph.nodes)
        .links(graph.links)
        .layout(32);

    if (dataLayer.empty()) {
      dataLayer = chartInner.append("g")
          .attr("class", "data");
    }

    // add in the links
    const link = dataLayer.append("g").selectAll(".link")
        .data(graph.links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", path)
        .style("stroke-width", function(d) {
          return Math.max(1, d.dy);
        })
        .style("opacity", function(d) {
          if (d.value === 0) return 0;
        })
        .sort(function(a, b) {
          return b.dy - a.dy;
        });

    // add the link titles
    link.append("title")
        .text(function(d) {
          return d.source.name + "_to_" +
                  d.target.name + "\n" + format(d.value);
        });

    // add in the nodes
    const node = dataLayer.append("g").selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        })
        .call(d3.drag()
            .subject(function(d) {
              return d;
            })
            .on("start", function() {
              this.parentNode.appendChild(this);
            })
            .on("drag", dragmove));

    // add the rectangles for the nodes
    node.append("rect")
        .attr("height", function(d) {
          return d.dy;
        })
        .attr("width", sankey.nodeWidth())
        .style("fill", function(d) {
          return d.color = colourDict[d.name];
          // return d.color = color(d.name.replace(/ .*/, ""));
        })
        .style("stroke", function(d) {
          return d3.rgb(d.color).darker(2);
        })
        .append("title")
        .text(function(d) {
          return d.name + "\n" + format(d.value);
        });

    // add in the title for the nodes
    node.append("text")
        .attr("x", -6)
        .attr("y", function(d) {
          return d.dy / 2;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function(d) {
          // return i18next.t(d.name, {ns: "modes"});
          if (d.value != 0) return d.name;
        })
        .filter(function(d) {
          return d.x < innerWidth / 2;
        })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");

    // the function for moving the nodes
    function dragmove(d) {
      d3.select(this)
          .attr("transform",
              "translate("
                 + d.x + ","
                 + (d.y = Math.max(
                     0, Math.min(innerHeight - d.dy, d3.event.y))
                 ) + ")");
      sankey.relayout();
      link.attr("d", path);
    }
  } // end make()

  svg
      .attr("viewBox", "0 0 " + outerWidth + " " + outerHeight)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("role", "img")
      .attr("aria-label", mergedSettings.altText);

  if (chartInner.empty()) {
    chartInner = svg.append("g")
        .attr("class", "margin-offset")
        .attr("transform", "translate(" + mergedSettings.margin.left + "," + mergedSettings.margin.top + ")");
  }

  make(graph);
} // end makeSankey()
