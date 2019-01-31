export default function(regPairs, legendID) {
  // initialize SVG for legend lines, their g and text nodes
  const margin = {top: 0, right: 0, bottom: 0, left: 63};
  const width = 300 - margin.left - margin.right;
  const height = 30 - margin.top - margin.bottom;

  // Rect SVG defined in index.html
  const svg = d3.select(legendID)
      .select("svg")
      .attr("width", width)
      .attr("height", height)
      .style("vertical-align", "middle")
      // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      .attr("transform", "translate(" + 345 + "," + (30) + ")");

  // Create the g nodes
  const lines = svg.selectAll("rect")
      .data(regPairs)
      .enter()
      .append("g");

  // Append lines onto the g nodes and fill
  const xcoord1 = [0, 20];
  const xcoord2 = [130, 150];
  lines.append("line")
      .attr("x1", function(d, i) {
        return (i === 0 ? xcoord1[0] : xcoord2[0]);
      })
      .attr("x2", function(d, i) {
        return (i === 0 ? xcoord1[1] : xcoord2[1]);
      })
      .attr("y1", 13)
      .attr("y2", 13)
      .attr("class", function(d, i) {
        return "legendLine " + regPairs[i] + "to";
      });

  // add text node to rect g
  lines.append("text");

  // Display text in text node
  d3.select(legendID)
      .selectAll("text")
      .text(function(d, i) {
        return i === 0 ? regPairs[0] + " to " + regPairs[1] :
        regPairs[1] + " to " + regPairs[0];
      })
      .attr("y", 18)
      .attr("x", function(d, i) {
        const xpos = [25, 155];
        return xpos[i];
      })
      .style("display", function() {
        return "inline";
      });
}
