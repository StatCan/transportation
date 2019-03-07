export default function(data, colourArray, numLevels) {
  const nullColour = colourArray.slice(-1)[0];

  console.log(data)
  data.filter((item) => item !== "CANADA");
  console.log("data after filter: ", data)

  // data is an Array
  const thisData = data[0]; // Object
  let dimExtent = [];
  let totArray = [];

  totArray = Object.values(thisData);

  totArray.sort(function(a, b) {
    return a-b;
  });
  console.log("totArray: ", totArray)
  dimExtent = d3.extent(totArray);
  console.log(dimExtent)

  // colour map to take data value and map it to the colour of the level bin it belongs to
  const colourMap = d3.scaleQuantize()
      .domain([dimExtent[0], dimExtent[1]])
      .range(colourArray.slice(0, numLevels));

  for (const key in thisData) {
    if (thisData.hasOwnProperty(key)) {
      d3.select(".dashboard .map")
          .select("." + key)
          .style("fill", function() {
            console.log(key, thisData[key])
            return thisData[key] ? colourMap(thisData[key]) : nullColour;
          });
    }
  }

  return dimExtent;
}
