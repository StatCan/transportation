// function makeSankey(svgID, graph) {
const defaults = {
  aspectRatio: 16 / 10,
  width: 900,
  margin: {
    top: 30,
    right: 10,
    bottom: 30,
    left: 10
  }
};

export default function(svg, settings, data) {
  // set the dimensions and margins of the graph
  const mergedSettings = defaults;
  const outerWidth = mergedSettings.width;
  const outerHeight = Math.ceil(outerWidth / mergedSettings.aspectRatio);
  const innerHeight = mergedSettings.innerHeight = outerHeight - mergedSettings.margin.top - mergedSettings.margin.bottom;
  const innerWidth = mergedSettings.innerWidth = outerWidth - mergedSettings.margin.left - mergedSettings.margin.right;
  let chartInner = svg.select("g.margin-offset");
  let dataLayer = chartInner.select(".data");

  const nonZeroNodes = [];
  data = {
    links: data.links
        .map((d) => {
          return {...d};
        })
        .filter((d) => {
          if (d.value > 0) {
            nonZeroNodes.push(d.source, d.target);
            return true;
          }
          return false;
        }),
    nodes: data.nodes
        .map((d) => {
          return {...d};
        })
        .filter((d) => nonZeroNodes.includes(d.node))
  };

  function checkHasFourLevels() {
    let thisFlag;
    let hasFourLevels = false;
    const landNodes = ["USres_land", "cdnFromUS_land"];
    for (let idx = 0; idx < landNodes.length; idx++) {
      data.nodes.map(function(item) {
        if (item.name === landNodes[idx]) {
          if (item.sourceLinks.length > 0) {
            thisFlag = true;
          }
        }
      });
      hasFourLevels = hasFourLevels || thisFlag;
    }
    return hasFourLevels;
  }

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

  function make() {
    sankey
        .nodes(data.nodes)
        .links(data.links)
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
    // const link = dataLayer.append("g").selectAll(".link") // use only if dragmove is defined
    dataLayer.append("g").selectAll(".link")
        .data(sankey.links())
        .enter().append("path")
        .attr("class", "link")
        .attr("d", path)
        .style("stroke-width", function(d) {
          return Math.max(1, d.dy);
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
                    "<td style='padding: 5px 10px 5px 5px;'><b>" + format(d.value) + " " + i18next.t("units", {ns: "modes_sankey"}) + "</td>" +
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

    // add in the nodes
    const node = dataLayer.append("g").selectAll(".node")
        .data(sankey.nodes())
        .enter().append("g")
        .attr("class", function(d) {
          return "node " + d.name; // d.name to fill by class in css
        })
        .attr("transform", function(d) {
          return `translate(${d.x || 0}, ${d.y || 0})`;
        });
      // .call(d3.drag()
      //     .subject(function(d) {
      //       return d;
      //     })
      //     .on("start", function() {
      //       this.parentNode.appendChild(this);
      //     })
      //     .on("drag", dragmove));

    node
        .on("mousemove", function(d) {
          div.transition()
              .style("opacity", .9);
          div.html(
              "<b>" + i18next.t(d.name, {ns: "modes"}) + "</b>"+ "<br><br>" +
              "<table>" +
                "<tr>" +
                "<td>" + "Total:" + "</td>" +
                "<td style='padding: 5px 10px 5px 5px;'><b>" + format(d.value) + " " + i18next.t("units", {ns: "modes_sankey"}) + "</td>" +
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
        .attr("x", function(d) {
          const hasFourLevels = checkHasFourLevels();
          if (d.level === 2 && hasFourLevels === true) {
            return 40;
          } else {
            return -6;
          }
        })
        .attr("y", function(d) {
          return d.dy / 2;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) {
          const hasFourLevels = checkHasFourLevels();
          if (d.level === 2 && hasFourLevels === true) {
            return "start";
          } else {
            return "end";
          }
        })
        .attr("transform", null)
        .html(function(d) {
          return i18next.t(d.name, {ns: "modes"});
        })
        .filter(function(d) {
          return d.x < innerWidth / 2;
        })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start")
        .call(wrap, 200);

    // footnote
    addFootnote("USres_other");
    addFootnote("cdnFromUS_other");

    function addFootnote(name) {
      if (d3.select(`.${name}`)) {
        d3.select(`.${name}`)
            .select("text")
            .html("Other")
            .append("tspan")
            .html("1")
            // .html('<a href= "http://google.com">' + 1 + "</a>")
            .style("font-size", "9px")
            .attr("dx", ".01em")
            .attr("dy", "-.3em");
      }
    }

    // the function for moving the nodes
    // function dragmove(d) {
    //   d3.select(this)
    //       .attr("transform",
    //           "translate("
    //              + d.x + ","
    //              + (d.y = Math.max(
    //                  0, Math.min(innerHeight - d.dy, d3.event.y))
    //              ) + ")");
    //   sankey.relayout();
    //   link.attr("d", path);
    // }

    function wrap(text, width) {
      const xcoord = 40;
      text.each(function() {
        const text = d3.select(this);
        const words = text.text().split(/\s+/).reverse();
        let word;
        let line = [];
        let lineNumber = 0;
        const lineHeight = 1.1; // ems
        const y = text.attr("y");
        const dy = parseFloat(text.attr("dy")) - lineHeight / 2; // added this to shift all lines up
        let tspan = text.text(null)
            .append("tspan")
            .attr("class", "nowrap")
            .attr("x", xcoord)
            .attr("y", y)
            .attr("dy", dy + "em");
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            // console.log("dy: ", dy)
            tspan = text.append("tspan")
                .attr("class", "wordwrap")
                .attr("x", xcoord)
                .attr("y", y)
                .attr("dy", function() {
                  return ++lineNumber * lineHeight + dy + "em";
                })
                .text(word);
          }
        }
      });
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
  make();
} // end makeSankey()
