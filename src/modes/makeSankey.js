// function makeSankey(sankeyChart, width, height, sankey, graph) {
function makeSankey(svgID, graph) {
  const defaults = {
    // aspectRatio: 16 / 9,
    // width: 1000,
    aspectRatio: 1/1,
    margin: {
      top: 25,
      right: 20,
      bottom: 120,
      left: 50
    }
  };
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


  // format variables
  var formatNumber = d3.format(",.0f"),    // zero decimal places
      format = function(d) { return formatNumber(d); },
      color = d3.scaleOrdinal(d3.schemeCategory20);

  // append the svg object to the body of the page
  var svg = d3.select(svgID).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // Set the sankey diagram properties
  var sankey = d3.sankey()
      .nodeWidth(36)
      .nodePadding(40)
      .size([width, height]);

  var path = sankey.link();
  make(graph);

  // d3.json("data/modes/canada_modes_test.json", function(error, graph) {
  function make(graph) {
    console.log("width: ", width)

    sankey
        .nodes(graph.nodes)
        .links(graph.links)
        .layout(32);

    // add in the links
    const link = svg.append("g").selectAll(".link")
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
    const node = svg.append("g").selectAll(".node")
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
          return d.x < width / 2;
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
                     0, Math.min(height - d.dy, d3.event.y))
                 ) + ")");
      sankey.relayout();
      link.attr("d", path);
    }
  } // end make()
} // end makeSankey()
