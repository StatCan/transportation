const defaults = {
  aspectRatio: 16 / 9,
  width: 1100,
  margin: {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  }
};

export default function(svg, graph) {console.log({...graph});
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
  const tooltipShiftY = 90; // amount to raise tooltip in y-dirn

  const formatNumber = d3.format(",.0f"); // zero decimal places
  const format = function(d) {
    return formatNumber(d);
  };
  const transition = d3.transition()
      .duration(1000);

  const classFn = function(d, i) {
    let cl = "link " + d.source.name + "_to_" + d.target.name;
    // let cl = "area area" + (i + 1);
    // if (sett.z && sett.z.getClass && typeof sett.z.getClass === "function") {
    //   cl += " " + sett.z.getClass.call(sett, d);
    // }
    // console.log("cl: ", cl)
    return cl;
  };

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

    // tooltip div
    const div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    if (dataLayer.empty()) {
      dataLayer = chartInner.append("g")
          .attr("class", "data");
    }

console.log(graph);

    // add in the links
    const link = dataLayer.append("g").attr("class", "links")
        .selectAll(".link")
        .data(graph.links, classFn);

    link.enter()
        .append("path")
        .attr("class", "link")
        .attr("class", classFn)
        .attr("id", function(d, i) {
          return "link" + i;
        })
        .attr("d", path)
        .style("stroke-width", function(d) {
          return Math.max(1, d.dy);
        })
        .style("opacity", function(d) {
          if (d.value === 0) return 0;
        })
        .sort(function(a, b) {
          return b.dy - a.dy;
        })
      .on("mouseover", function(d) {
        // Reduce opacity of all but link that is moused over
        d3.selectAll(".link:not(#" + this.id + ")").style("opacity", 0.5);
        // Tooltip
        const sourceName = d.source.name;
        div.transition()
            .style("opacity", .9);
        div.html(
            "<b>" + i18next.t(sourceName, {ns: "modes"}) + "</b>"+ "<br><br>" +
              "<table>" +
                "<tr>" +
                "<td>" + i18next.t(d.target.name, {ns: "modes"}) + ": </td>" +
                  "<td><b>" + format(d.value*1e4) + "</td>" +
                "</tr>" +
              "</table>"
        )
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - tooltipShiftY) + "px");

      })
      .on("mouseout", function(d) {   

        //Restore opacity
        d3.selectAll(".link:not(#" + this.id + ")").style("opacity", 1);

        div.transition()
          .style("opacity", 0);
      });

    link
        .transition(transition)
        .attr("d", path);

    // add the link titles
    link.append("title")
        .text(function(d) {
          return d.source.name + "_to_" +
                  d.target.name + "\n" + format(d.value);
        });

    link.exit().remove();

    // add in the nodes
    const node = dataLayer.append("g").attr("class", "nodes")
        .selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", function(d) {
          return "node" + " " + d.name;
        })
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
        
        node.on("mouseover", function(d) {

        //   //Make all links inactive
        //   d3.selectAll(".link").classed("inactive", true);

        //   //Remove inactive class to selected links and make them active
        //   if (d.sourceLinks.length > 0) { //rect acts as a source to next rect
        //     console.log("fromLink: ", d.name)
        //     var fromLink = d3.selectAll(".from" + d.name);
        //     fromLink.classed("inactive", !fromLink.classed("inactive"));

        //     fromLink.classed("active", true);
        //   }

        //   if (d.targetLinks.length > 0) { //rect acts as a target from previous rect
        //     var toLink = d3.selectAll(".to" + d.name);
        //     toLink.classed("inactive", !toLink.classed("inactive"));

        //     toLink.classed("active", true);
        //   }

          div.transition()
            .style("opacity", .9);
            div.html(
              "<b>" + i18next.t(d.name, {ns: "modes"}) + "</b>"+ "<br><br>" +
              "<table>" +
                "<tr>" + 
                "<td> Total: </td>" +
                  "<td><b>" + format(d.value*1e4)  + "</td>" +
                  "<td>" + " " + "</td>" +
                "</tr>" +
              "</table>"
            )
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - tooltipShiftY) + "px");
        })
        .on("mouseout", function(d) {
        //   //Remove active and inactive classes added on mouseover
        //   d3.selectAll(".inactive").classed("inactive", false);
        //   d3.selectAll(".active").classed("active", false);

          div.transition()
            .style("opacity", 0);
        });

    // add the rectangles for the nodes
    node.append("rect")
        .attr("height", function(d) {
          return d.dy;
        })
        .attr("width", sankey.nodeWidth())
        .style("stroke", function(d) {
          let this_fill = d3.select("." + d.name).select("rect").style("fill");
          return d3.rgb(this_fill).darker(2);
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
          if (d.value !== 0) return i18next.t(d.name, {ns: "modes"});
        })
        .filter(function(d) {
          return d.x < innerWidth / 2;
        })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");

    // node.exit().remove();

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
