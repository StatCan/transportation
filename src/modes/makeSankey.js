function makeSankey(sankeyChart, width, height, sankey, graph) {

  const colourDict = {
  // level 1
    "intl": "#607890",
    // level 2
    "USres": "#CC982A",
    "nonUS": "#928941",
    "cdnFromUS": "#FFDC68",
    "cdnFromOther": "#FAB491"
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
          return "node regions";
        })
        .attr("transform", function(d) {
          // col_xcoord.push(d.x); //x-coord of each Sankey col
          if (!d.y) console.log("NaN d.y: ", d)
          return "translate(" + d.x + "," + d.y + ")";
        })
        .style("cursor", function(d) {
          return "crosshair";
        });

    // apend rects to the nodes
    node.append("rect")
        .attr("height", function(d) {
          console.log("height d.y: ", d.y);
          return d.dy;
        })
        .attr("width", sankey.nodeWidth())
        .style("fill", function(d, idx) {
          console.log(d.name);
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
  } // end make()
} // end makeSankey()
