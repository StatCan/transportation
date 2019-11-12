// this is needed until we get a proper api call for range
const proxy = "https://cors-anywhere.herokuapp.com/";
const webAPI = "https://www150.statcan.gc.ca/t1/wds/rest/getDataFromCubePidCoordAndLatestNPeriods";

export default function(minYear, frequency, productID, defaultCoord, granularity) {
  return new Promise((resolve, reject) => {
    let mostRecentDate;
    let numberOfPeriods;
    const returnObject = {};

    const myData = [
      {"productId": productID, "coordinate": defaultCoord, "latestN": 1}];
    $.ajax({
      type: "post",
      url: proxy + webAPI,
      data: JSON.stringify(myData),
      dataType: "json",
      contentType: "application/json",
      success: function(data, textStatus, jQxhr) {
        if(granularity === "year"){
          mostRecentDate = data[0].object.vectorDataPoint[0].refPer.substring(0, 4);
          numberOfPeriods = ((Number(mostRecentDate) - minYear +1) * frequency);
          returnObject.max = mostRecentDate;
          returnObject.numPeriods = numberOfPeriods;
        }
        else if(granularity === "month"){
          mostRecentDate = data[0].object.vectorDataPoint[0].refPer.substring(0, 7);
          numberOfPeriods = ((Number(mostRecentDate.substring(0, 4)))  - minYear) * frequency + Number(mostRecentDate.substring(5, 7));
          returnObject.max = mostRecentDate;
          returnObject.numPeriods = numberOfPeriods;
        }
        resolve(returnObject);
      },
      error: function(jqXhr, textStatus, errorThrown) {
        reject(errorThrown);
      }
    });
  });
}
