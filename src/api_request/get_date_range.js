// this is needed until we get a proper api call for range
var proxy = "https://cors-anywhere.herokuapp.com/"
var webAPI =  "https://www150.statcan.gc.ca/t1/wds/rest/getDataFromCubePidCoordAndLatestNPeriods";

export default function(minYear, frequency, productID) {

  return new Promise((resolve, reject) => {
    let mostRecentDate;
    let numberOfPeriods;
    const returnObject = {};

    const myData = [
      {"productId": productID, "coordinate": "1.1.0.0.0.0.0.0.0.0", "latestN": 1}];
    $.ajax({
      type: "post",
      url: proxy + webAPI,
      data: JSON.stringify(myData),
      dataType: "json",
      contentType: "application/json",
      success: function(data, textStatus, jQxhr) {
        mostRecentDate = data[0].object.vectorDataPoint[0].refPer.substring(0, 4);
        numberOfPeriods = ((Number(mostRecentDate) - minYear +1) * frequency);
        returnObject.max = mostRecentDate;
        returnObject.numPeriods = numberOfPeriods;
        resolve(returnObject);
      },
      error: function(jqXhr, textStatus, errorThrown) {
        reject(errorThrown);
      }
    });
  });
}
