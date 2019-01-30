export default function(colourArray, dimExtent, scaleLabel) {
  const rectDim = 20;
  const formatComma = d3.format(",");

  // initialize SVG for legend rects, their g and text nodes
  const margin = {top: 20, right: 0, bottom: 10, left: 20};
  const width = 600 - margin.left - margin.right;
  const height = 150 - margin.top - margin.bottom;

  // Rect SVG defined in index.html
  const svgCB = d3.select("#mapColourScale")
      .select("svg")
      .attr("width", width)
      .attr("height", height)
      .style("vertical-align", "middle");

  // Create the g nodes
  const rects = svgCB.selectAll("rect")
      .data(colourArray)
      .enter()
      .append("g");

  // Append rects onto the g nodes and fill
  rects.append("rect")
      .attr("width", rectDim)
      .attr("height", rectDim)
      .attr("y", 5)
      .attr("x", function(d, i) {
        return 160 + i * 90;
      })
      .attr("fill", function(d, i) {
        return colourArray[i];
      });

  // define rect text labels (calculate cbValues)
  console.log("dimExtent: ", dimExtent);
  let delta = ( dimExtent[1] - dimExtent[0] )/ colourArray.length;
  const cbValues=[];
  for (let idx=0; idx < colourArray.length; idx++) {
    delta = Math.round(delta/1000)*1000;
    cbValues.push(Math.round((dimExtent[0] + idx*delta)/1000)*1000);
  }

  // add text node to rect g
  rects.append("text");

  // Display text in text node
  let updateText;
  d3.select("#mapColourScale")
      .selectAll("text")
      .text(function(i, j) {
        const firstValue = cbValues[1];
        const nextValues = cbValues[j];
        if (j === 0) updateText = "< " + formatComma(firstValue / 1000);
        else updateText = "> " + formatComma(nextValues / 1000);
        return updateText;
      })
      .attr("y", 18)
      .attr("x", function(d, i) {
        const xpos = [112, 202, 293, 375, 466];
        return xpos[i];
      })
      .style("display", function() {
        return "inline";
      });

  // Text label for scale bar
  svgCB.append("g").append("text")
      .attr("y", 18)
      .attr("x", 0)
      .text(scaleLabel);
}
