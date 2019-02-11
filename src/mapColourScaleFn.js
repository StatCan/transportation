export default function(svgCB, colourArray, dimExtent) {
  const scalef = 1e3; // scale factor; MUST BE SAME AS IN AREA CHART SETTINGS
  const rectDim = 20;
  const formatComma = d3.format(",d");

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
        return 215 + i * 85;
      })
      .attr("fill", function(d, i) {
        return colourArray[i];
      });

  // define rect text labels (calculate cbValues)
  const delta =(dimExtent[1] - dimExtent[0] ) / colourArray.length;
  const cbValues=[];
  cbValues[0] = dimExtent[0];
  for (let idx=1; idx < colourArray.length; idx++) {
    cbValues.push(Math.round((0.5 + (idx - 1)) * delta + dimExtent[0]));
  }

  // add text node to rect g
  rects.append("text");

  // Display text in text node
  let updateText;
  d3.select("#mapColourScale")
      .selectAll("text")
      .text(function(i, j) {
        const s0 = formatComma(cbValues[j] / scalef);
        const s2 = cbValues[j + 1] ? formatComma(cbValues[j + 1] / scalef) : s0 + "+";
        updateText = cbValues[j + 1] ? "< " + s2 : s2;
        return updateText;
      })
      .attr("y", 18)
      .attr("x", function(d, i) {
        let xpos;
        if (svgCB.attr("class") === "airCB") {
          xpos = [167, 246, 331, 419];
        } else {
          xpos = [167, 253, 331, 419];
        } 
        return xpos[i];
      })
      .style("display", function() {
        return "inline";
      });

  // Text label for scale bar
  if (d3.select("#cbID").empty()) {
    const label = svgCB.append("g").append("text");
    label
        .attr("id", "cbID")
        .attr("y", 18)
        .attr("x", 0);
  }
}
