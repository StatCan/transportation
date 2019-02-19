export default function(svgCB, colourArray, dimExtent) {
  const scalef = 1e3; // scale factor; MUST BE SAME AS IN AREA CHART SETTINGS
  const rectDim = 35;
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
        return 105 + i * rectDim;
      })
      .attr("fill", function(d, i) {
        return colourArray[i];
      });

  // define rect text labels (calculate cbValues)
  const delta =(dimExtent[1] - dimExtent[0] ) / colourArray.length;
  const cbValues=[];
  cbValues[0] = dimExtent[0];
  for (let idx=1; idx < colourArray.length; idx++) {
    // cbValues.push(Math.round((0.5 + (idx - 1)) * delta + dimExtent[0]));
    cbValues.push(Math.round(( idx ) * delta + dimExtent[0]));
  }

  // add text node to rect g
  rects.append("text");

  // Display text in text node
  let updateText;
  d3.select("#mapColourScale")
      .selectAll("text")
      .text(function(i, j) {
        const s0 = formatComma(cbValues[j] / scalef);
        const s1 = cbValues[j + 1] ? formatComma(cbValues[j + 1] / scalef) : s0 + "+";
        console.log("s0, : ", s0, s1);
        // updateText = cbValues[j + 1] ? "> " + s0 : s0 + "+";
        updateText = s0 + "+";
        return updateText;
      })
      .attr("text-anchor", "end")
      .attr("transform",function(d, i) { 
        return "translate(" + (110 + (i * (rectDim + 0))) + ", 50) " + "rotate(-45)";
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
