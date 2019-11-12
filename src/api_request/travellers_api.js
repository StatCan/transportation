const ProductId = 24100041;
const proxy = "https://cors-anywhere.herokuapp.com/";
const webAPI = "https://www150.statcan.gc.ca/t1/wds/rest/getDataFromCubePidCoordAndLatestNPeriods";

const provinceToNum = {
  "CANADA": 1,
  "NL": 2,
  "PE": 14,
  "NS": 17,
  "NB": 28,
  "QC": 54,
  "ON": 113,
  "MB": 175,
  "SK": 195,
  "AB": 213,
  "BC": 224,
  "YK": 260,
  "NU": 266;
}
const numToProcince = {
  1:"CANADA",
  2:"NL",
  14:"PE",
  17:"NS",
  28:"NB",
  54:"QC",
  113:"ON",
  175:"MB",
  195:"SK",
  213:"AB",
  224:"BC",
  260:"YK",
  266:"NU";
}
const charToNum = {
  "intl":1,
  "USres":3,
  "USres_car":4,
  "USres_train":8,
  "USres_bus":15,
  "USres_other":18,
  "USres_air":21,
  "USres_marine":28,
  "nonUSres":35,
  "nonUSres_land":36,
  "nonUSres_air":39,
  "nonUSres_marine":42,
  "cdnFromUS":46,
  "cdnFromUS_car":47,
  "cdnFromUS_train":51,
  "cdnFromUS_bus":58,
  "cdnFromUS_other":61,
  "cdnFromUS_air":64,
  "cdnFromUS_marine":71,
  "cdnFromOther":78,
  "cdnFromOther_land":79,
  "cdnFromOther_air":80,
  "cdnFromOther_marine":83
}
const numToChar = {
  1:"intl",
  3:"USres",
  4:"USres_car",
  8:"USres_train",
  15:"USres_bus",
  18:"USres_other",
  21:"USres_air",
  28:"USres_marine",
  35:"nonUSres",
  36:"nonUSres_land",
  39:"nonUSres_air",
  42:"nonUSres_marine",
  46:"cdnFromUS",
  47:"cdnFromUS_car",
  51:"cdnFromUS_train",
  58:"cdnFromUS_bus",
  61:"cdnFromUS_other",
  64:"cdnFromUS_air",
  71:"cdnFromUS_marine",
  78:"cdnFromOther",
  79:"cdnFromOther_land",
  80:"cdnFromOther_air",
  83:"cdnFromOther_marine"
}

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

export default function(maxYear, minYear) {
  return new Promise((resolve, reject) => {
    // get coordinates for data


    const coordinateArray = coordinateTranslate();
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

function coordinateTranslate() {
  const returnArray = [];
  for (const i in numToProvince) {
    for (const j in numToChar) {
      returnArray.push(`${i}.${j}.0.0.0.0.0.0.0.0`);
    }
  }
  return returnArray;
}
