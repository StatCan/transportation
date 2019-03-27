export default function(chartObj, data, onMouseOverCb, onMouseOutCb) {
  // TEMP
  chartObj.svg.datum(chartObj);
  chartObj.data = data;

  const bisect = d3.bisector((d) => {
    return chartObj.settings.x.getValue(d);
  }).left;

  let overlay = chartObj.svg.select(".data .overlay");
  let rect;
  let line;

  if (overlay.empty()) {
    overlay = chartObj.svg.select(".data")
        .append("g")
        .attr("class", "overlay");

    rect = overlay
        .append("rect")
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr("class", "overlay");

    line = overlay.append("line")
        .attr("class", "hoverLine")
        .style("display", "inline")
        .style("visibility", "hidden");
  } else {
    rect = overlay.select("rect");
    line = overlay.select("line");
  }

  rect
      .attr("width", chartObj.settings.innerWidth)
      .attr("height", chartObj.settings.innerHeight)
      .on("mousemove", function(e) {
        const chartObj = d3.select(this.ownerSVGElement).datum();
        const x = d3.mouse(this)[0];
        const xD = chartObj.x.invert(x);
        const i = bisect(chartObj.data, xD);
        const d0 = chartObj.data[i - 1];
        const d1 = chartObj.data[i];

        let d;
        if (d0 && d1) {
          d = xD - chartObj.settings.x.getValue(d0) > chartObj.settings.x.getValue(d1) - xD ? d1 : d0;
        } else if (d0) {
          d = d0;
        } else {
          d = d1;
        }
        chartObj.data.filter((item) => {
          if (item.isLast) d = d1;
        });

        line.attr("x1", chartObj.x(chartObj.settings.x.getValue(d)));
        line.attr("x2", chartObj.x(chartObj.settings.x.getValue(d)));
        line.style("visibility", "visible");

        if (onMouseOverCb && typeof onMouseOverCb === "function") {
          onMouseOverCb(d);
        }
      })
      .on("mouseout", function() {
        line.style("visibility", "hidden");
        if (onMouseOutCb && typeof onMouseOutCb === "function") {
          onMouseOutCb();
        }
      });

  line
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", 0)
      .attr("y2", chartObj.settings.innerHeight);
}
