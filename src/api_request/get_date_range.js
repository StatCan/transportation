// this is needed until we get a proper api call for range
export default function(minYear, frequency, productID) {
  let mostRecentDate;
  let numberOfPeriods;
  let returnObject = {};
  const myData = [
    {"productId": productID, "coordinate": `1.1.0.0.0.0.0.0.0.0`, "latestN":1}]
  $.support.cors = true;

  $.ajax({
    type: "post",
    url: "https://www150.statcan.gc.ca/t1/wds/rest/getDataFromCubePidCoordAndLatestNPeriods",
    data: JSON.stringify(myData),
    dataType: "json",
    contentType: "application/json",
    success: function(data, textStatus, jQxhr) {
      mostRecentDate = data[0].object.vectorDataPoint[0].refPer.substring(0,4);
      numberOfPeriods =  ((Number(mostRecentDate) - minYear +1) * frequency);
      returnObject.max = mostRecentDate;
      returnObject.numPeriods = numberOfPeriods;
      return returnObject;
    },
    error: function(jqXhr, textStatus, errorThrown) {
      console.log(errorThrown);
      alert("An error occured");
    }
  });

}
