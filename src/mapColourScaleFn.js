export default function(svgCB, colourArray, dimExtent, numLevels, scalef) {
  const rectDim = 35;
  // const formatComma = d3.format(",d");

  // text labels (calculate cbValues)
  const delta = (dimExtent[1] - dimExtent[0] ) / numLevels;
  const cbValues = [{"quantile": 1, "value": dimExtent[0]}];

  for (let idx=1; idx < numLevels; idx++) {
    cbValues.push({"quantile": idx + 1, "value": Math.round(( idx ) * delta + dimExtent[0])});
  }

  if (colourArray.length > numLevels) {
    for (let idx=1; idx < colourArray.length - numLevels + 1; idx++) {
      cbValues.push({"quantile": -999, "value": -999});
    }
  }

  const node = svgCB.selectAll(".node")
      .data([0], String); // There is only one umbrella g node

  node
      .attr("class", "update");

  // update
  node
      .enter()
      .append("g")
      .attr("id", "wheat")
      .attr("class", "wheat")
      .each(function(d, i) {
        const single = d3.select(this);

        const bubbles = single.selectAll(".bubble")
            .data(cbValues);

        const newBubbles = bubbles
            .enter()
            .append("g")
            .attr("class", "bubble");

        newBubbles.exit().remove();

        // Append a rect to each g
        newBubbles
            .append("rect")
            .attr("width", rectDim)
            .attr("height", rectDim)
            .attr("y", 5)
            .attr("x", function(d, i) {
              return 160 + i * rectDim;
            })
            .attr("fill", function(d, i) {
              return colourArray[i];
            });

        // Append a text to each rects// Append bubble text to bubble g node
        newBubbles
            .append("text")
            .attr("dx", function(d) {
              return 0;
            })
            .attr("dy", function(d) {
              return 0;
            })
            .attr("class", "bubble-text")
            .merge(newBubbles)
            .text(function(d) {
              return "some text";
            })
            .attr("dominant-baseline", "central");

        newBubbles.exit().remove();
      });

  // node
  //     .exit()
  //     .remove();
}
