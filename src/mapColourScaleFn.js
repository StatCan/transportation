export default function(svgCB, colourArray, dimExtent, numLevels, settings) {
  // Definitions
  // ---------------------------------------------------------------------------
  const rectDim = 35;
  const yRect = 20;
  const yText = 65;
  const yNaNText = yText + 7;

  // text labels (calculate cbValues)
  const delta =(dimExtent[1] - dimExtent[0] ) / numLevels;
  const cbValues=[];
  cbValues[0] = dimExtent[0];
  for (let idx=1; idx < numLevels; idx++) {
    cbValues.push(Math.round(( idx ) * delta + dimExtent[0]));
  }

  // rect fill fn
  const getFill = function(d, i) {
    return colourArray[i];
  };

  // text fn
  const getText = function(i, j) {
    if (i < numLevels) {
      const s0 = settings.formatNum()(cbValues[j]);
      return s0 + "+";
    } else if (i === numLevels + 1) {
      return "x";
    }
  };

  // tooltip for NaN box
  const divNaN = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  // -----------------------------------------------------------------------------
  // g node for colourbar title (text is set in index.js)
  svgCB.append("g")
      .attr("class", "colourbarTitle")
      .attr("id", "cbTitle")
      .append("text")
      // .text("test")
      .attr("transform", function(d, i) {
        return "translate(225, 15)";
      })
      .style("display", function() {
        return "inline";
      });

  // Create the umbrella group
  const rectGroups = svgCB
      .attr("class", "mapCB")
      .selectAll(".legend")
      .data(Array.from(Array(colourArray.length).keys()));

  // Append g nodes (to be filled with a rect and a text) to umbrella group
  const newGroup = rectGroups
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("id", function(d, i) {
        return `cb${i}`;
      });

  // add rects
  newGroup
      .append("rect")
      .attr("width", rectDim)
      .attr("height", rectDim)
      .attr("y", yRect)
      .attr("x", function(d, i) {
        return 135 + i * rectDim;
      })
      .attr("fill", getFill)
      .attr("class", function(d, i) {
        if (i === numLevels + 1) {
          return "classNaN";
        }
      });

  // hover over NaN rect only
  newGroup
      .selectAll(".legend rect")
      .on("mouseover", function(d, i) {
        if (d3.select(this).attr("class") === "classNaN") {
          const line1 = i18next.t("NaNhover1", {ns: "airUI"});
          const line2 = i18next.t("NaNhover2", {ns: "airUI", escapeInterpolation: false});

          divNaN
              .style("opacity", 0.9)
              .html(
                  "<br>" +
                  line1 + "<br>" +
                  line2 + "<br><br>"
              )
              .style("left", ((d3.event.pageX + 10) + "px"))
              .style("top", ((d3.event.pageY + 10) + "px"));
        }
      })
      .on("mouseout", function() {
        divNaN.style("opacity", 0);
      });

  // add text
  newGroup
      .append("text")
      .text(getText)
      .attr("text-anchor", "end")
      .attr("transform", function(d, i) {
        if (i < numLevels) {
          return `translate(${140 + (i * (rectDim + 0))}, ${yText}) rotate(-45)`;
        } else if (i === numLevels + 1) { // NaN box in legend
          return `translate(${156 + (i * (rectDim + 0))}, ${yNaNText}) `;
        }
      })
      .style("display", function() {
        return "inline";
      });

  // Update rect fill for any new colour arrays passed in
  rectGroups.select("rect")
      .attr("fill", getFill);

  // Update rect text for different year selections
  rectGroups.select("text")
      .text(getText);

  rectGroups.exit().remove();
}
