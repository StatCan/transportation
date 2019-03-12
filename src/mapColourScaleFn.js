export default function(svgCB, colourArray, dimExtent, numLevels, scalef) {
  const rectDim = 35;
  const formatComma = d3.format(",d");
  // text labels (calculate cbValues)
  const delta =(dimExtent[1] - dimExtent[0] ) / numLevels;
  const cbValues=[];
  cbValues[0] = dimExtent[0];
  for (let idx=1; idx < numLevels; idx++) {
    cbValues.push(Math.round(( idx ) * delta + dimExtent[0]));
  }
  const getFill = function(d, i) {
    return colourArray[i];
  };
  const getText = function(i, j) {
    if (i < numLevels) {
      const s0 = formatComma(cbValues[j] / scalef);
      return s0 + "+";
    } else if (i === numLevels + 1) {
      return i18next.t("NaNbox", {ns: "airUI"});
    }
  };

  // Create the g nodes
  const rectGroups = svgCB
      .attr("class", "mapCB")
      .selectAll(".legend")
      .data(Array.from(Array(colourArray.length).keys()));

  // Append rects onto the g nodes and fill
  const newGroup = rectGroups
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("id", function(d, i) {
        return `cb${i}`;
      });

  newGroup
      .append("rect")
      .attr("width", rectDim)
      .attr("height", rectDim)
      .attr("y", 5)
      .attr("x", function(d, i) {
        return 160 + i * rectDim;
      })
      .attr("fill", getFill)
      .attr("class", function(d, i) {
        if (i === numLevels + 1) {
          return "classNaN";
        }
      });

  newGroup
      .append("text")
      .text(getText)
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

  rectGroups.select("rect")
      .attr("fill", getFill);

  rectGroups.select("text")
      .text(getText);

  rectGroups.exit().remove();
}
