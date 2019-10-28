const ProductId = 23100062;
const proxy = "https://cors-anywhere.herokuapp.com/";
const webAPI = "https://www150.statcan.gc.ca/t1/wds/rest/getDataFromCubePidCoordAndLatestNPeriods";
const numToProvince = {
  1: "AT",
  2: "QC",
  3: "ON",
  4: "MB",
  5: "SK",
  6: "AB",
  7: "BC",
  8: "USA-MX"};

const numToComm = {
  1: "wheat",
  5: "canola",
  20: "ores",
  26: "coal",
  28: "oils",
  34: "chems",
  35: "potash",
  41: "lumber",
  43: "pulp"
  3: "mixed",
};

const statusCodes = {
  1: "..",
  2: "0s",
  3: "A",
  4: "B",
  5: "C",
  6: "D",
  7: "E",
  8: "F"
};

const qi_F = 8;

export default function(maxYear, selectedYear, geography) {
  return new Promise((resolve, reject) => {
    // get coordinates for data


    const coordinateArray = coordinateTranslate(geography);
    const yearRange = Number(maxYear) - Number(selectedYear) + 1;
    let returnArray = [];
    const returnedCounter = 0;
    const myData = [];
    for (let i =0; i< coordinateArray.length; i++ ) {
      for (let j =0; j< coordinateArray.length; j++ ) {
        for (let k =0; k< coordinateArray.length; k++ ) {

      myData.push({"productId": ProductId, "coordinate": coordinateArray[i], "latestN": yearRange});
    }

    $.support.cors = true;

    $.ajax({
      type: "post",
      url: proxy + webAPI,
      data: JSON.stringify(myData),
      dataType: "json",
      contentType: "application/json",
      success: function(data, textStatus, jQxhr) {
        returnArray = rebuildAll(data, yearRange);
        resolve(returnArray);
      },
      error: function(jqXhr, textStatus, errorThrown) {
        reject(errorThrown);
      }
    });
  });
}

function rebuildAll(data, yearRange) {
  const dataByProvince = {};
  const returnArray = [];
  let provinceCode;
  for (let i = 0; i < data.length; i++) {
    provinceCode = data[i].object.coordinate.split(".", 1)[0];
    if (!dataByProvince.hasOwnProperty(provinceCode)) {
      dataByProvince[provinceCode] = [];
    }
    dataByProvince[provinceCode].push(data[i]);
  }
  for (const province in dataByProvince) {
    for (let i = 0; i < yearRange; i++) {
      returnArray.push(rebuildData(dataByProvince[province], numToProvince[province], i));
    }
  }
  return returnArray;
}

function rebuildData(data, geography, year) {
  const returnObject = {};
  let datapoint;
  for (let i = 0; i < data.length; i++) {
    const returnType = Number(data[i].object.coordinate.split(".", 2)[1]);
    let returnValue;
    datapoint = data[i].object.vectorDataPoint[year];
    if (datapoint.statusCode != 1 && datapoint.securityLevelCode == 0 && datapoint.statusCode != qi_F) {
      returnValue = datapoint.value;
    } else {
      returnValue = statusCodes[datapoint.statusCode];
    }

    if (returnType === NetGas) {
      returnObject.gas = returnValue;
    } else if (returnType === NetDiesel) {
      returnObject.diesel = returnValue;
    } else if (returnType === NetLPG) {
      returnObject.lpg = returnValue;
    }
  }
  returnObject.date = datapoint.refPer.substring(0, 4);
  returnObject.province = geography;
  returnObject.annualTotal = (Number(returnObject.lpg) ? returnObject.lpg : 0) + (Number(returnObject.diesel) ? returnObject.diesel : 0)+
                             (Number(returnObject.gas) ? returnObject.gas : 0);

  return returnObject;
}

function coordinateTranslate(geography) {
  let numGeo;
  let returnArray;
       [
        `${1}.${NetGas}.0.0.0.0.0.0.0.0`, `${1}.${NetDiesel}.0.0.0.0.0.0.0.0`, `${1}.${NetLPG}.0.0.0.0.0.0.0.0`,
      ];
  return returnArray;
}
