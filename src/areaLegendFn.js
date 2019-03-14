export default function(svgLegend, classArray) {
  const rectDim = 15;
  const x0 = 50;
  const scaling = 9.5;

  // Create the g nodes
  const rects = svgLegend.selectAll("rect")
      .data(classArray)
      .enter()
      .append("g");

  // Append rects onto the g nodes and fill
  rects.append("rect")
      .attr("width", rectDim)
      .attr("height", rectDim)
      .attr("y", 25)
      .attr("x", function(d, i) {
        return x0 + i * rectDim*scaling;
      })
      .attr("class", function(d, i) {
        return classArray[i];
      });


  // add text node to rect g
  rects.append("text");

  // Display text in text node
  d3.select("#areaLegend")
      .selectAll("text")
      .attr("y", 38)
      .attr("x", function(d, i) {
        return x0 + i * rectDim*scaling + 20;
      })
      .style("display", function() {
        return "inline";
      });
}
