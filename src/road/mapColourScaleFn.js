function mapColourScaleFn(colourArray) {
  // initialize SVG for legend rects, their g and text nodes

  // Rect SVG defined in index.html
  var svgCB = d3.select("#mapColourScale").select("svg")

  // Create the g nodes
  let rects = svgCB.selectAll('rect')
      .data(colourArray)
      .enter()
      .append('g');

  const rect_dim = 15;
  let appendedRects = rects.append("rect")
      .attr("width", rect_dim)
      .attr("height", rect_dim)
      .attr("y", 5)
      .attr("x", function (d, i) {
        return 41 + i * 80;
      })
      .attr("fill", function (d, i) {
        return colourArray[i];
      });

}
