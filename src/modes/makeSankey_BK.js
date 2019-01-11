// function makeSankey(sankeyChart, width, height, sankey, graph) {
export default function(svg, graph) {
  const defaults = {
    // aspectRatio: 16 / 9,
    // width: 1000,
    aspectRatio: 1.5/1,
    width: 3000,
    margin: {
      top: 0,
      right: 0,
      bottom: 60,
      left: 0
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

    "nonUS_land": "#928941",
    "nonUS_air": "#928941",
    "nonUS_marine": "#928941",

    "cdnFromUS_land": "#FFDC68",
    "cdnFromUS_air": "#FFDC68",
    "cdnFromUS_marine": "#FFDC68",

    "cdnFromOther_land": "#FAB491",
    "cdnFromOther_air": "#FAB491",
    "cdnFromOther_marine": "#FAB491"
  };

  const mergedSettings = defaults;
  const outerWidth = mergedSettings.width;
  const outerHeight = Math.ceil(outerWidth / mergedSettings.aspectRatio);
  const innerHeight = mergedSettings.innerHeight = outerHeight - mergedSettings.margin.top - mergedSettings.margin.bottom;
  const innerWidth = mergedSettings.innerWidth = outerWidth - mergedSettings.margin.left - mergedSettings.margin.right;
  let chartInner = svg.select("g.margin-offset");
  let dataLayer = chartInner.select(".data");

  mergedSettings.innerHeight = outerHeight - mergedSettings.margin.top - mergedSettings.margin.bottom;

  const sankey = d3.sankey()
      .nodeWidth(20)
      .nodePadding(10)
      .size([innerWidth, innerHeight]); // [width, height]
      // .nodeSort(function(nodeA, nodeB) {
      //   console.log("nodeA: ", nodeA)
      //   if (nodeA.target.name < nodeB.target.name) return -1;
      //   if (nodeA.target.name > nodeB.target.name) return 1;
      //   return 0;
      // });

  // set the sankey diagram properties
  const path = sankey.link();

  function make(graph) {
    const nodeMap = {};
    graph.nodes.forEach(function(x) {
      nodeMap[x.name] = x;
    });
    graph.links = graph.links.map(function(x) {
      // console.log("x: ", x);
      return {
        source: nodeMap[x.source],
        target: nodeMap[x.target],
        value: x.value
      };
    });

    // graph.nodes.sort(function(a, b) {
    //   return d3.descending(a.value, b.value);
    // });

    sankey
        .nodes(graph.nodes)
        .links(graph.links)
        .layout(32);

    if (dataLayer.empty()) {
      dataLayer = chartInner.append("g")
          .attr("class", "data");
    }
    const link = dataLayer.selectAll(".link")
        .data(graph.links)
        .enter().append("path")
        .attr("class", function(d, i) {
          const fromName = "from_" + d.source.name.replace(/\s+/g, "");
          const toName = "to_" + d.target.name.replace(/\s+/g, "");
          return "link" + " " + fromName + " " + toName;
        })
        .attr("d", path)
        .attr("id", function(d, i) {
          d.id = i;
          return "link-" + i;
        })
        .style("stroke-width", function(d) {
          return Math.max(1, d.dy);
        })
        // .sort(function(a, b) {
        //   if (a.target.name.indexOf("land") !== -1) {
        //     console.log(a.target.name)
        //     console.log(a);
        //     console.log(b);
        //     return a.target.name - b.target.name;
        //   }
        //   // return a.dy - b.dy;
        // });
    // .style("stroke", function(d) {
    //   return "#E8E8E8"; // colourDict[d.source.name];
    // });

    // add in the nodes
    const node = svg.append("g").selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", function(d) {
          if (!d.y) {
            return "notDY";
          } else {
            return "node";
          }
        })
        .attr("transform", function(d) {
          // col_xcoord.push(d.x); //x-coord of each Sankey col
          if (!d.y) {
            console.log("NaN d: ", d);
            console.log("NaN d.y: ", d.y)
          }
          return "translate(" + d.x + "," + d.y + ")";
        })
        .style("cursor", function(d) {
          return "crosshair";
        })
        .call(d3.drag() // moves nodes with mouse drag
        // .origin(function(d) {
        //   return d;
        // })
            .on("drag", dragmove)
        );

    // apend rects to the nodes
    node.append("rect")
        .attr("height", function(d) {
          if (d.y == 0) {
            console.log("height d.y: ", d);
          }
          return d.dy;
        })
        .attr("width", sankey.nodeWidth())
        .style("fill", function(d, idx) {
          return colourDict[d.name];
        })
        .style("stroke-width", "2px")
        .style("stroke", "#555");

    // apend text to nodes
    node.append("text")
        .attr("x", -6)
        .attr("y", function(d) {
          return d.dy / 2;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("font-size", "10px")
        .attr("transform", null)
        .text(function(d) {
          return d.name;
        })
        .filter(function(d) {
          return d.x < innerWidth / 2;
        })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start")
        .attr("font-size", "10px");

    // the function for moving the nodes
    function dragmove(d) {
      d3.select(this).attr("transform",
          "translate(" + (
            d.x
          ) + "," + (
            d.y = Math.max(0, Math.min(innerHeight - d.dy, d3.event.y))
          ) + ")");
      // move the attached links
      sankey.relayout();
      link.attr("d", path);
    }
  } // end make(graph)()

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
