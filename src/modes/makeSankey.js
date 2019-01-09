function makeSankey(sankeyChart, width, height, sankey, graph) {
  const levelDict = {
  // level 1
    "intl": "level1",
    // level 2
    "USres": "level2",
    "nonUS": "level2",
    "cdnFromUS": "level2",
    "cdnFromOther": "level2",
    // level 3
    "USres_land": "level3",
    "USres_air": "level3",
    "USres_marine": "level3",
    "USres_land": "level3",
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

  console.log("width: ", width);
  // set the sankey diagram properties
  const path = sankey.link();
  // load the data
  // d3.json(jsonFile, function(error, graph) {
  //   make(graph);
  // });
  make(graph);

  function make(graph) {
    const nodeMap = {};
    graph.nodes.forEach(function(x) {
      nodeMap[x.name] = x;
    });
    graph.links = graph.links.map(function(x) {
      console.log("x: ", x)
      return {
        source: nodeMap[x.source],
        target: nodeMap[x.target],
        value: x.value
      };
    });

    graph.nodes.sort(function(a, b) {
      return d3.descending(a.value, b.value);
    });

    sankey
        .nodes(graph.nodes)
        .links(graph.links)
        .layout(32);

    // tooltip div
    const div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    const link = sankeyChart.append("g").selectAll(".link")
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
        .sort(function(a, b) {
          return b.dy - a.dy;
        });
        // .style("stroke", function(d) {
        //   return "#E8E8E8"; // colourDict[d.source.name];
        // });

    // add in the nodes
    const node = sankeyChart.append("g").selectAll(".node")
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
        .call(d3.drag() //moves nodes with mouse drag
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
        .attr("transform", null)
        .text(function(d) {
          return d.name;
        })
        .filter(function(d) {
          return d.x < width / 2;
        })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");

      // the function for moving the nodes
      function dragmove(d) {
        d3.select(this).attr("transform",
          "translate(" + (
            d.x
          ) + "," + (
            d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
          ) + ")");

        //move the attached links
        sankey.relayout();
        link.attr("d", path);
      }
  } // end make()
} // end makeSankey()
