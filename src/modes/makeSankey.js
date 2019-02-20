// function makeSankey(svgID, graph) {
const defaults = {
  aspectRatio: 16 / 14,
  width: 1090,
  margin: {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  }
};

export default function(svg, nodes, graph) {
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
  const tooltipShiftY = 90; // amount to raise tooltip in y-dirn

  // Set the sankey diagram properties
  const sankey = d3.sankey()
      .size([innerWidth, innerHeight]);

  const path = sankey.link();

  function make(graph) {
    sankey
        .nodes(nodes)
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
        })
        .on("mousemove", function(d) {
          // Tooltip
          const sourceName = d.source.name;
          div.transition()
              .style("opacity", .9);
          div.html(
              "<b>" + i18next.t(sourceName, {ns: "modes"}) + "</b>"+ "<br><br>" +
                "<table>" +
                  "<tr>" +
                    "<td>" + i18next.t(d.target.name, {ns: "modes"}) + ": </td>" +
                    "<td style='padding: 5px 10px 5px 5px;'><b>" + format(d.value) + " people</td>" +
                  "</tr>" +
                "</table>"
          )
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - tooltipShiftY) + "px");
        })
        .on("mouseout", function(d) {
          div.transition()
              .style("opacity", 0);
        });

    // add the link titles
    link.append("title")
        .text(function(d) {
          return i18next.t(d.target.name, {ns: "modes"}) + "\n" + format(d.value);
        });

    // DO NOT PLOT IF DATA IS COMPLETELY ZERO
    if (graph.links.length !== 0) {
      // add in the nodes
      const node = dataLayer.append("g").selectAll(".node")
          .data(nodes)
          .enter().append("g")
          .attr("class", function(d) {
            return "node " + d.name; // d.name to fill by class in css
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

      node
          .on("mousemove", function(d) {
            div.transition()
                .style("opacity", .9);
            div.html(
                "<b>" + i18next.t(d.name, {ns: "modes"}) + "</b>"+ "<br><br>" +
                "<table>" +
                  "<tr>" +
                  "<td>" + "Total:" + "</td>" +
                  "<td style='padding: 5px 10px 5px 5px;'><b>" + format(d.value) + " people</td>" +
                  "</tr>" +
                "</table>"
            )
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - tooltipShiftY) + "px");
          })
          .on("mouseout", function(d) {
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
            return d3.rgb(d.color).darker(2);
          })
          .text(function(d) {
            return i18next.t(d.name, {ns: "modes"}) + "\n" + format(d.value);
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
            if (d.value != 0) return i18next.t(d.name, {ns: "modes"});
          })
          .filter(function(d) {
            return d.x < innerWidth / 2;
          })
          .attr("x", 6 + sankey.nodeWidth())
          .attr("text-anchor", "start");
    }
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

  d3.stcExt.addIEShim(svg, outerHeight, outerWidth);
  make(graph);
} // end makeSankey()
