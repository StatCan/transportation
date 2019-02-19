export default function(svgLegend, colourArray, legendText) {
  const scalef = 1e3; // scale factor; MUST BE SAME AS IN AREA CHART SETTINGS
  const rectDim = 35;
  const formatComma = d3.format(",d");

  // Create the g nodes
  const rects = svgLegend.selectAll("rect")
      .data(colourArray)
      .enter()
      .append("g");

  // Append rects onto the g nodes and fill
  rects.append("rect")
      .attr("width", rectDim)
      .attr("height", rectDim)
      .attr("y", 5)
      .attr("x", function(d, i) {
        return 55 + i * rectDim*4;
      })
      .attr("fill", function(d, i) {
        return colourArray[i];
      });


  // add text node to rect g
  rects.append("text");

  // Display text in text node
  d3.select("#areaLegend")
      .selectAll("text")
      .text(function(d, i) {
        return i18next.t(legendText[i], {ns: "roadArea"});
      })
      .attr("y", 28)
      .attr("x", function(d, i) {
        const xpos = [55 + rectDim + 5, 237, 375];
        return  xpos[i];
      })
      .style("display", function() {
        return "inline";
      });

  // Text label for scale bar
  // if (d3.select("#cbID").empty()) {
  //   const label = svgCB.append("g").append("text");
  //   label
  //       .attr("id", "cbID")
  //       .attr("y", 18)
  //       .attr("x", 0);
  // }
}
