export default function(svgCB, colourArray, dimExtent) {
  const scalef = 1e3; // scale factor; MUST BE SAME AS IN AREA CHART SETTINGS
  const rectDim = 35;
  const formatComma = d3.format(",d");

  // Create the g nodes
  const rects = svgCB
      .attr("class", "mapCB")
      .selectAll("rect")
      .data(colourArray)
      .enter()
      .append("g");

  // Append rects onto the g nodes and fill
  rects.append("rect")
      .attr("width", rectDim)
      .attr("height", rectDim)
      .attr("y", 5)
      .attr("x", function(d, i) {
        return 175 + i * rectDim;
      })
      .attr("fill", function(d, i) {
        return colourArray[i];
      });

  // define rect text labels (calculate cbValues)
  const delta =(dimExtent[1] - dimExtent[0] ) / colourArray.length;
  const cbValues=[];
  cbValues[0] = dimExtent[0];
  for (let idx=1; idx < colourArray.length; idx++) {
    cbValues.push(Math.round(( idx ) * delta + dimExtent[0]));
  }

  // add text node to rect g
  rects.append("text");

  // Display text in text node
  let updateText;
  d3.select("#mapColourScale .mapCB")
      .selectAll("text")  
      .text(function(i, j) {
        const s0 = formatComma(cbValues[j] / scalef);
        updateText = s0 + "+";
        return updateText;
      })
      .attr("text-anchor", "end")
      .attr("transform", function(d, i) {
        return "translate(" + (180 + (i * (rectDim + 0))) + ", 50) " + "rotate(-45)";
      })
      .style("display", function() {
        return "inline";
      });
}
