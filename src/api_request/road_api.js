const NetGas = 1;
const NetDiesel = 3;
const NetLPG = 4;
const RoadProductId = 23100066;
const proxy = "https://cors-anywhere.herokuapp.com/";
const webAPI = "https://www150.statcan.gc.ca/t1/wds/rest/getDataFromCubePidCoordAndLatestNPeriods";
const numToProvince = {
  1: "CANADA",
  2: "NL",
  3: "PE",
  4: "NS",
  5: "NB",
  6: "QC",
  7: "ON",
  8: "MB",
  9: "SK",
  10: "AB",
  11: "BC",
  12: "YT",
  14: "NT",
  15: "NU"};

const qi_F = 8;

export default function(maxYear, selectedYear, geography) {
  return new Promise((resolve, reject) => {
    // get coordinates for data

    if (geography === "ALL") {
      const coordinateArray = coordinateTranslate(geography);
      const yearRange = Number(maxYear) - Number(selectedYear) + 1;
      let returnArray = [];
      const returnedCounter = 0;
      const myData = [];
      for (let i =0; i< coordinateArray.length; i++ ) {
        myData.push({"productId": RoadProductId, "coordinate": coordinateArray[i], "latestN": yearRange});
      }

      $.support.cors = true;

      $.ajax({
        type: "post",
        url: proxy + webAPI,
        data: JSON.stringify(myData),
        dataType: "json",
        contentType: "application/json",
        success: function(data, textStatus, jQxhr) {
          returnArray = rebuildAll(data);
          resolve(returnArray);
        },
        error: function(jqXhr, textStatus, errorThrown) {
          reject(errorThrown);
        }
      });
    } else {
      const coordinateArray = coordinateTranslate(geography);
      const yearRange = maxYear - selectedYear + 1;


      const myData = [
        {"productId": RoadProductId, "coordinate": coordinateArray[0], "latestN": yearRange},
        {"productId": RoadProductId, "coordinate": coordinateArray[1], "latestN": yearRange},
        {"productId": RoadProductId, "coordinate": coordinateArray[2], "latestN": yearRange}
      ];


      $.ajax({
        type: "post",
        url: proxy + webAPI,
        data: JSON.stringify(myData),
        dataType: "json",
        contentType: "application/json",
        success: function(data, textStatus, jQxhr) {
          resolve(rebuildProvinceData(data, geography, yearRange));
        },
        error: function(jqXhr, textStatus, errorThrown) {
          reject(errorThrown);
          alert("An error occured");
        }
      });
    }
  });
}

function rebuildAll(data) {
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
    returnArray.push(rebuildData(dataByProvince[province], numToProvince[province], 0));
  }
  return returnArray;
}

function rebuildProvinceData(data, geography, yearRange) {
  const returnArray = [];
  for (let i = 0; i < yearRange; i++) {
    returnArray.push(rebuildData(data, geography, i));
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
      returnValue = datapoint.status;
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
  returnObject.annualTotal = returnObject.lpg + returnObject.diesel + returnObject.gas;

  return returnObject;
}

function coordinateTranslate(geography) {
  let numGeo;
  switch (geography) {
    case "CANADA":
      numGeo = 1;
      break;
    case "NL":
      numGeo = 2;
      break;
    case "PE":
      numGeo = 3;
      break;
    case "NS":
      numGeo = 4;
      break;
    case "NB":
      numGeo = 5;
      break;
    case "QC":
      numGeo = 6;
      break;
    case "ON":
      numGeo = 7;
      break;
    case "MB":
      numGeo = 8;
      break;
    case "SK":
      numGeo = 9;
      break;
    case "AB":
      numGeo = 10;
      break;
    case "BC":
      numGeo = 11;
      break;
    case "YT":
      numGeo = 12;
      break;
    case "NT":
      numGeo = 14;
      break;
    case "NU":
      numGeo = 15;
      break;
    case "ALL":
      return [`${2}.${NetGas}.0.0.0.0.0.0.0.0`, `${2}.${NetDiesel}.0.0.0.0.0.0.0.0`, `${2}.${NetLPG}.0.0.0.0.0.0.0.0`,
        `${3}.${NetGas}.0.0.0.0.0.0.0.0`, `${3}.${NetDiesel}.0.0.0.0.0.0.0.0`, `${3}.${NetLPG}.0.0.0.0.0.0.0.0`,
        `${4}.${NetGas}.0.0.0.0.0.0.0.0`, `${4}.${NetDiesel}.0.0.0.0.0.0.0.0`, `${4}.${NetLPG}.0.0.0.0.0.0.0.0`,
        `${5}.${NetGas}.0.0.0.0.0.0.0.0`, `${5}.${NetDiesel}.0.0.0.0.0.0.0.0`, `${5}.${NetLPG}.0.0.0.0.0.0.0.0`,
        `${6}.${NetGas}.0.0.0.0.0.0.0.0`, `${6}.${NetDiesel}.0.0.0.0.0.0.0.0`, `${6}.${NetLPG}.0.0.0.0.0.0.0.0`,
        `${7}.${NetGas}.0.0.0.0.0.0.0.0`, `${7}.${NetDiesel}.0.0.0.0.0.0.0.0`, `${7}.${NetLPG}.0.0.0.0.0.0.0.0`,
        `${8}.${NetGas}.0.0.0.0.0.0.0.0`, `${8}.${NetDiesel}.0.0.0.0.0.0.0.0`, `${8}.${NetLPG}.0.0.0.0.0.0.0.0`,
        `${9}.${NetGas}.0.0.0.0.0.0.0.0`, `${9}.${NetDiesel}.0.0.0.0.0.0.0.0`, `${9}.${NetLPG}.0.0.0.0.0.0.0.0`,
        `${10}.${NetGas}.0.0.0.0.0.0.0.0`, `${10}.${NetDiesel}.0.0.0.0.0.0.0.0`, `${10}.${NetLPG}.0.0.0.0.0.0.0.0`,
        `${11}.${NetGas}.0.0.0.0.0.0.0.0`, `${11}.${NetDiesel}.0.0.0.0.0.0.0.0`, `${11}.${NetLPG}.0.0.0.0.0.0.0.0`,
        `${12}.${NetGas}.0.0.0.0.0.0.0.0`, `${12}.${NetDiesel}.0.0.0.0.0.0.0.0`, `${12}.${NetLPG}.0.0.0.0.0.0.0.0`,
        `${14}.${NetGas}.0.0.0.0.0.0.0.0`, `${14}.${NetDiesel}.0.0.0.0.0.0.0.0`, `${14}.${NetLPG}.0.0.0.0.0.0.0.0`,
        `${15}.${NetGas}.0.0.0.0.0.0.0.0`, `${15}.${NetDiesel}.0.0.0.0.0.0.0.0`, `${15}.${NetLPG}.0.0.0.0.0.0.0.0`];
  }

  return [`${numGeo}.${NetGas}.0.0.0.0.0.0.0.0`, `${numGeo}.${NetDiesel}.0.0.0.0.0.0.0.0`, `${numGeo}.${NetLPG}.0.0.0.0.0.0.0.0`];
}
