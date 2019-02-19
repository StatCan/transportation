export default function(data, colourArray) {
  console.log("data: ", data)
  // data is an Array
  const thisData = data[0]; // Object
  console.log("thisData: ", thisData)
  let dimExtent = [];
  let totArray = [];

  totArray = Object.values(thisData);

  totArray.sort(function(a, b) {
    return a-b;
  });

  dimExtent = d3.extent(totArray);

  // colour map to take data value and map it to the colour of the level bin it belongs to
  const colourMap = d3.scaleQuantize()
      .domain([dimExtent[0], dimExtent[1]])
      .range(colourArray);

  for (const key in thisData) {
    if (thisData.hasOwnProperty(key)) {
      d3.select(".dashboard .map")
          .select("." + key).style("fill", colourMap(thisData[key]));
    }
  }

  return dimExtent;
}
