const PassengerId = 23100253;
const TotalCoordinate = 1;
const EnplanedCoordinate = 2;
const DeplanedCoordinate = 3;
const DomesticCoordinate = 5;
const TransborderCoordinate = 6;
const OtherIntCoordinate = 7;

const proxy = "https://cors-anywhere.herokuapp.com/";
const webAPI = "https://www150.statcan.gc.ca/t1/wds/rest/getDataFromCubePidCoordAndLatestNPeriods";
const numToGeographyPassenger = {
  100000: "CANADA",
  101000: "NL",
  102000: "PE",
  103000: "NS",
  104000: "NB",
  105000: "QC",
  106000: "ON",
  107000: "MB",
  108000: "SK",
  109000: "AB",
  110000: "BC",
  111000: "YT",
  112000: "NT",
  113000: "NU"
};
const geoToNumPassenger = {
  "AB": "109000",
  "BC": "110000",
  "CANADA": "100000",
  "MB": "107000",
  "NB": "104000",
  "NL": "101000",
  "NS": "103000",
  "NT": "112000",
  "NU": "113000",
  "ON": "106000",
  "PE": "102000",
  "QC": "105000",
  "SK": "108000"
};

const numToAirportPassenger = {
  72: "YDF",
  27: "YQX",
  117: "YYT",
  63: "YYG",
  21: "YHZ",
  37: "YFC",
  91: "YQM",
  87: "YUL",
  141: "YQB",
  120: "YZV",
  23: "YHM",
  96: "YXU",
  76: "YOW",
  179: "YSB",
  178: "YQT",
  161: "YYZ",
  160: "YQG",
  180: "YTS",
  163: "YWG",
  136: "YQR",
  126: "YXE",
  13: "YYC",
  52: "YEG",
  43: "YMM",
  1: "YXX",
  68: "YXC",
  36: "YXJ",
  100: "YLW",
  153: "YXS",
  169: "YVR",
  171: "YYJ",
  187: "YZF"
};
const geoToAirportPassenger = {
  "YDF": "72",
  "YEG": "52",
  "YFC": "37",
  "YHM": "23",
  "YHZ": "21",
  "YLW": "100",
  "YMM": "43",
  "YOW": "76",
  "YQB": "141",
  "YQG": "160",
  "YQM": "91",
  "YQR": "136",
  "YQT": "178",
  "YQX": "27",
  "YSB": "179",
  "YT": "111000",
  "YTS": "180",
  "YUL": "87",
  "YVR": "169",
  "YWG": "163",
  "YXC": "68",
  "YXE": "126",
  "YXJ": "36",
  "YXS": "153",
  "YXU": "96",
  "YXX": "1",
  "YYC": "13",
  "YYG": "63",
  "YYJ": "171",
  "YYT": "117",
  "YYZ": "161",
  "YZF": "187",
  "YZV": "120"
};
const numToIndicator = {
  1: "total",
  2: "enplaned",
  3: "deplaned",
  5: "domestic",
  6: "transborder",
  7: "international"
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


export default function(selectedDateRange, selectedRegion) {
  return new Promise((resolve, reject) => {
    // get coordinates for data
    let coordinateArray;

    if (selectedRegion === "all") {
      coordinateArray = coordinateTranslate(selectedRegion);
    } else {
      coordinateArray.push(`${geoToNumPassenger[selectedRegion]}.${TotalCoordinate}.0.0.0.0.0.0.0.0`);
      coordinateArray.push(`${geoToNumPassenger[selectedRegion]}.${EnplanedCoordinate}.0.0.0.0.0.0.0.0`);
      coordinateArray.push(`${geoToNumPassenger[selectedRegion]}.${DeplanedCoordinate}.0.0.0.0.0.0.0.0`);
      coordinateArray.push(`${geoToNumPassenger[selectedRegion]}.${DomesticCoordinate}.0.0.0.0.0.0.0.0`);
      coordinateArray.push(`${geoToNumPassenger[selectedRegion]}.${TransborderCoordinate}.0.0.0.0.0.0.0.0`);
      coordinateArray.push(`${geoToNumPassenger[selectedRegion]}.${OtherIntCoordinate}.0.0.0.0.0.0.0.0`);
    }
    const yearRange = Number(selectedDateRange.max) - Number(selectedDateRange.min) +1;
    let returnObject = {};
    const myData = [];
    for (let i =0; i< coordinateArray.length; i++ ) {
      myData.push({"productId": PassengerId, "coordinate": coordinateArray[i], "latestN": yearRange});
    }

    $.support.cors = true;
    $.ajax({
      type: "post",
      url: proxy + webAPI,
      data: JSON.stringify(myData),
      dataType: "json",
      contentType: "application/json",
      success: function(data, textStatus, jQxhr) {
        returnObject = rebuild(data, selectedDateRange, selectedRegion);
        resolve(returnObject);
      },
      error: function(jqXhr, textStatus, errorThrown) {
        reject(errorThrown);
      }
    });
  });
}

function rebuild(data, selectedDateRange, selectedRegion) {
  const dataByProvince = {};
  const returnObject = {};

  for (let i = 0; i < data.length; i++) {
    const provinceCode = data[i].object.coordinate.split(".", 1);
    if (!dataByProvince.hasOwnProperty(provinceCode)) {
      dataByProvince[provinceCode] = [];
    }
    dataByProvince[provinceCode].push(data[i]);
  }
  for (const province in dataByProvince) {
    if (Object.prototype.hasOwnProperty.call(dataByProvince, province)) {
      returnObject[province] = rebuildData(dataByProvince[province], selectedDateRange);
    }
  }
  return returnObject;
}

function rebuildData(data, selectedDateRange) {
  const returnObject = {};
  for (let i = 0; i < selectedDateRange.numPeriods; i++) {
    for (const j in data) {
      const datapoint = data[j].object.vectorDataPoint[i];
      const date = datapoint.refPer.substring(0, 7);
      if (!returnObject.hasOwnProperty(date)) {
        returnObject[date] = {};
      }

      const indicator = data[j].object.coordinate.split(".", 2)[1];
      if (datapoint.value == null) {
        returnObject[date][numToIndicator[indicator]] = "x";
      } else if (datapoint.statusCode != 1 && datapoint.securityLevelCode == 0 && datapoint.statusCode != qi_F) {
        returnObject[date][numToIndicator[indicator]] = datapoint.value;
      } else {
        returnObject[date][numToIndicator[indicator]] = statusCodes[datapoint.statusCode];
      }
    }
  }
  return returnObject;
}

function coordinateTranslate(geography) {
  const numGeo = geoToNumPassenger[geography];
  const returnArray = [];
  for (const i in numToGeographyPassenger) {
    returnArray.push(`${i}.${TotalCoordinate}.0.0.0.0.0.0.0.0`);
    returnArray.push(`${i}.${EnplanedCoordinate}.0.0.0.0.0.0.0.0`);
    returnArray.push(`${i}.${DeplanedCoordinate}.0.0.0.0.0.0.0.0`);
    returnArray.push(`${i}.${DomesticCoordinate}.0.0.0.0.0.0.0.0`);
    returnArray.push(`${i}.${TransborderCoordinate}.0.0.0.0.0.0.0.0`);
    returnArray.push(`${i}.${OtherIntCoordinate}.0.0.0.0.0.0.0.0`);
  }
  return returnArray;
}
