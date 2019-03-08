export default function(svgCB, colourArray, dimExtent, numLevels, scalef) {
  // scale factor; MUST BE SAME AS IN AREA CHART SETTINGS
  const rectDim = 35;
  const formatComma = d3.format(",d");

  // Create the g nodes
  const rects = svgCB
      .attr("class", "mapCB")
      .selectAll("rect")
      .data(Array.from(Array(colourArray.length).keys()))
      .enter()
      .append("g")
      .attr("class", function(d, i) {
        if (i === numLevels + 1) {
          return "classNaN";
        }
      });

  // Append rects onto the g nodes and fill
  rects.append("rect")
      .attr("width", rectDim)
      .attr("height", rectDim)
      .attr("y", 5)
      .attr("x", function(d, i) {
        return 160 + i * rectDim;
      })
      .attr("fill", function(d, i) {
        return colourArray[i];
      });

  // define rect text labels (calculate cbValues)
  const delta =(dimExtent[1] - dimExtent[0] ) / numLevels;
  const cbValues=[];
  cbValues[0] = dimExtent[0];
  for (let idx=1; idx < numLevels; idx++) {
    cbValues.push(Math.round(( idx ) * delta + dimExtent[0]));
  }

  // add text node to rect g
  rects.append("text");

  // Display text in text node
  let updateText;
  d3.select("#mapColourScale .mapCB")
      .selectAll("text")
      .text(function(i, j) {
        if (i < numLevels) {
          const s0 = formatComma(cbValues[j] / scalef);
          updateText = s0 + "+";
          return updateText;
        } else if (i === numLevels + 1) {
          return i18next.t("NaNbox", {ns: "airUI"});
        }
      })
      .attr("text-anchor", "end")
      .attr("transform", function(d, i) {
        if (i < numLevels) {
          return "translate(" + (165 + (i * (rectDim + 0))) + ", 50) " + "rotate(-45)";
        } else if (i === numLevels + 1) { // NaN box in legend
          return "translate(" + (199 + (i * (rectDim + 0))) + ", 57) ";
        }
      })
      .style("display", function() {
        return "inline";
      });
}
