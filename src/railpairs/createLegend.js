export default function(regPairs, legendID) {
  const rectDim = 20;

  // initialize SVG for legend rects, their g and text nodes
  const margin = {top: 0, right: 0, bottom: 0, left: 63};
  const width = 600 - margin.left - margin.right;
  const height = 30 - margin.top - margin.bottom;

  // Rect SVG defined in index.html
  const svg = d3.select(legendID)
      .select("svg")
      .attr("width", width)
      .attr("height", height)
      .style("vertical-align", "middle")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Create the g nodes
  const rects = svg.selectAll("rect")
      .data(regPairs)
      .enter()
      .append("g");

  // Append rects onto the g nodes and fill
  rects.append("rect")
      .attr("width", rectDim)
      .attr("height", rectDim)
      .attr("y", 5)
      .attr("x", function(d, i) {
        return 0 + i * 200;
      })
      .attr("class", function(d, i) {
        return regPairs[i] + "to";
      });

  // add text node to rect g
  rects.append("text");

  // Display text in text node
  d3.select(legendID)
      .selectAll("text")
      .text(function(d, i) {
        console.log(regPairs);
        console.log("leg d: ", d);
        return i === 0 ? regPairs[0] + " to " + regPairs[1] :
        regPairs[1] + " to " + regPairs[0];
      })
      .attr("y", 18)
      .attr("x", function(d, i) {
        const xpos = [25, 225];
        return xpos[i];
      })
      .style("display", function() {
        return "inline";
      });
}
