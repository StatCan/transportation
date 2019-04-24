export default function(data, colourArray, numLevels) {
  //const nullColour = colourArray.slice(-1)[0];

  // data is an Array
  const thisData = data[0]; // Object
  let dimExtent = [];
  let totArray = [];
  let levels = numLevels;


  totArray = Object.values(thisData);

  totArray.sort(function(a, b) {
    return a-b;
  });

  dimExtent = d3.extent(totArray);
  if (dimExtent[1] === 0) {
    levels = 1;
  }

  // colour map to take data value and map it to the colour of the level bin it belongs to
  const colourMap = d3.scaleQuantize()
      .domain([dimExtent[0], dimExtent[1]])
      .range(colourArray.slice(0, levels));

  for (const key in thisData) {
    if (thisData.hasOwnProperty(key)) {
      d3.select(".dashboard .map")
          .selectAll("." + key)
          .style("fill", function() {
            return colourMap(thisData[key]);
          })
		  // Bruno : Unused code removed following no data message modification
    }
  }

  return dimExtent;
}
