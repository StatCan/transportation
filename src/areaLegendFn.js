export default function(svgLegend, classArray) {
  const rectDim = 35;

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
        return 57 + i * rectDim*5.2;
      })
      .attr("class", function(d, i) {
        return classArray[i];
      });


  // add text node to rect g
  rects.append("text");

  // Display text in text node
  d3.select("#areaLegend")
      .selectAll("text")
      .attr("y", 48)
      .attr("x", function(d, i) {
        return 57 + i * rectDim*5.2 + 40;
      })
      .style("display", function() {
        return "inline";
      });
}
