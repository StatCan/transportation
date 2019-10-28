const ProductId = 23100062;
const proxy = "https://cors-anywhere.herokuapp.com/";
const webAPI = "https://www150.statcan.gc.ca/t1/wds/rest/getDataFromCubePidCoordAndLatestNPeriods";
const numToProvince = {
  1: "All",
  2: "AT",
  3: "QC",
  4: "ON",
  5: "MB",
  6: "SK",
  7: "AB",
  8: "BC",
  11: "USA-MX"};
const provinceToNum = {
  "All": 1,
  "AT": 2,
  "QC": 3,
  "ON": 4,
  "MB": 5,
  "SK": 6,
  "AB": 7,
  "BC": 8,
  "USA-MX": 11};

const numToComm = {
  1: "total",
  2: "wheat",
  6: "canola",
  21: "ores",
  27: "coal",
  29: "oils",
  35: "chems",
  36: "potash",
  42: "lumber",
  44: "pulp",
  64: "mixed",
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

export default function(maxYear, minYear, origin) {
  return new Promise((resolve, reject) => {
    // get coordinates for data


    const coordinateArray = coordinateTranslate(origin);
    const yearRange = Number(maxYear) - Number(minYear) +1;
    let returnArray = [];
    const returnedCounter = 0;
    const myData = [];
    for (let i =0; i< coordinateArray.length; i++ ) {
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
        returnArray = rebuild(data, yearRange, origin);
        resolve(returnArray);
      },
      error: function(jqXhr, textStatus, errorThrown) {
        reject(errorThrown);
      }
    });
  });
}

function rebuild(data, yearRange, origin) {
  const dataByProvince = {};
  let returnArray = [];
  let provinceCode;
  for (let i = 0; i < data.length; i++) {
    provinceCode = data[i].object.coordinate.split(".", 2)[1];
    if (!dataByProvince.hasOwnProperty(provinceCode)) {
      dataByProvince[provinceCode] = [];
    }
    dataByProvince[provinceCode].push(data[i]);
  }
  for (const province in dataByProvince) {
    if (Object.prototype.hasOwnProperty.call(dataByProvince, province)) {
      for (let i = 0; i < yearRange; i++) {
        const allOtherCalculationArray = [];
        for (let j = 0; j < Object.keys(numToComm).length; j++) {
          allOtherCalculationArray.push(rebuildData(dataByProvince[province][j], origin, numToProvince[province], i));
        }
        const itemArray = calculateAllOther(allOtherCalculationArray);
        returnArray = returnArray.concat(itemArray);
      }
    }
  }
  return returnArray;
}

// because we need to show all other commodities, we must subtract
// the top 10 comodities from the total
function calculateAllOther(data) {
  let totalVal;
  let allOtherval;
  const returnArray = [];
  const allOtherObject = {};
  for (const item of data) {
    if (item.comm === "total") {
      totalVal = item.value;
      allOtherObject.comm = "other";
      allOtherObject.date = item.date;
      allOtherObject.origin = item.origin;
      allOtherObject.dest = item.dest;
    }
  }
  allOtherval = totalVal;
  for (const item of data) {
    if (item.comm !== "total") {
      allOtherval -= item.value;
      returnArray.push(item);
    }
  }
  allOtherObject.value = allOtherval;
  returnArray.push(allOtherObject);
  return returnArray;
}

function rebuildData(data, origin, desitination, year) {
  const returnObject = {};
  let datapoint;
  const returnType = Number(data.object.coordinate.split(".", 3)[2]);
  let returnValue;
  datapoint = data.object.vectorDataPoint[year];
  if (datapoint.statusCode != 1 && datapoint.securityLevelCode == 0 && datapoint.statusCode != qi_F) {
    returnValue = datapoint.value;
  } else {
    returnValue = statusCodes[datapoint.statusCode];
  }

  returnObject.value = returnValue;
  returnObject.comm = numToComm[returnType];
  returnObject.date = datapoint.refPer.substring(0, 4);
  returnObject.origin = origin;
  returnObject.dest = desitination;

  return returnObject;
}

function coordinateTranslate(geography) {
  const numGeo = provinceToNum[geography];
  const returnArray = [];
  for (const i in numToProvince) {
    for (const j in numToComm) {
      returnArray.push(`${numGeo}.${i}.${j}.0.0.0.0.0.0.0`);
    }
  }
  return returnArray;
}
