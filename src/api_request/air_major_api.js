const MajorStationsId = 23100015;
const MajorTowersId = 23100008;

const proxy = "https://cors-anywhere.herokuapp.com/";
const webAPI = "https://www150.statcan.gc.ca/t1/wds/rest/getDataFromCubePidCoordAndLatestNPeriods";

const numToGeographyMajorStations = {
  "58": "YBK",
  "2": "YBR",
  "3": "YBL",
  "4": "YCG",
  "59": "YCL",
  "5": "YYG",
  "6": "YYQ",
  "7": "YXC",
  "8": "YDQ",
  "9": "YDF",
  "11": "YYE",
  "12": "YXJ",
  "60": "YFS",
  "61": "YSM",
  "62": "YGP",
  "14": "YQU",
  "63": "YHY",
  "15": "YOJ",
  "16": "YGR",
  "17": "YEV",
  "18": "YFB",
  "19": "YKA",
  "20": "YQK",
  "21": "YGK",
  "22": "YVP",
  "23": "YGW",
  "24": "YGL",
  "25": "YVC",
  "26": "YQL",
  "27": "YLL",
  "28": "YXH",
  "29": "YYY",
  "30": "YCD",
  "31": "YVQ",
  "33": "YND",
  "34": "YPE",
  "35": "YYF",
  "36": "YZT",
  "37": "YPA",
  "38": "YPR",
  "39": "YRT",
  "40": "YQF",
  "64": "YRB",
  "41": "YRJ",
  "42": "YUY",
  "43": "YSJ",
  "66": "YKL",
  "45": "YXL",
  "46": "YYD",
  "47": "YAY",
  "48": "YCM",
  "49": "YQY",
  "50": "YXT",
  "51": "YTH",
  "52": "YTS",
  "53": "YVO",
  "54": "YWH",
  "55": "YWK",
  "56": "YZU",
  "57": "YWL",
  "65": "QYI"
};
const geoToNumMajorStations = {
  "QYI": "65",
  "YAY": "47",
  "YBK": "58",
  "YBL": "3",
  "YBR": "2",
  "YCD": "30",
  "YCG": "4",
  "YCL": "59",
  "YCM": "48",
  "YDF": "9",
  "YDQ": "8",
  "YEV": "17",
  "YFB": "18",
  "YFS": "60",
  "YGK": "21",
  "YGL": "24",
  "YGP": "62",
  "YGR": "16",
  "YGW": "23",
  "YHY": "63",
  "YKA": "19",
  "YKL": "66",
  "YLL": "27",
  "YND": "33",
  "YOJ": "15",
  "YPA": "37",
  "YPE": "34",
  "YPR": "38",
  "YQF": "40",
  "YQK": "20",
  "YQL": "26",
  "YQU": "14",
  "YQY": "49",
  "YRB": "64",
  "YRJ": "41",
  "YRT": "39",
  "YSJ": "43",
  "YSM": "61",
  "YTH": "51",
  "YTS": "52",
  "YUY": "42",
  "YVC": "25",
  "YVO": "53",
  "YVP": "22",
  "YVQ": "31",
  "YWH": "54",
  "YWK": "55",
  "YWL": "57",
  "YXC": "7",
  "YXH": "28",
  "YXJ": "12",
  "YXL": "45",
  "YXT": "50",
  "YYD": "46",
  "YYE": "11",
  "YYF": "35",
  "YYG": "5",
  "YYQ": "6",
  "YYY": "29",
  "YZT": "36",
  "YZU": "56"
};
const numToGeographyMajorTowers = {
  "2": "YXX",
  "3": "YDT",
  "4": "YYC",
  "5": "1YSB",
  "6": "YRC",
  "7": "YXD",
  "8": "YEG",
  "9": "CZVL",
  "46": "YMM",
  "47": "YFC",
  "10": "YQX",
  "11": "YHZ",
  "12": "YHM",
  "13": "YLW",
  "14": "YKF",
  "15": "YLY",
  "16": "YXU",
  "17": "YQM",
  "18": "YMX",
  "19": "YUL",
  "20": "YHU",
  "44": "YYB",
  "21": "YOO",
  "22": "YOW",
  "23": "YPK",
  "24": "YXS",
  "25": "YQB",
  "26": "YQR",
  "27": "YXE",
  "28": "YAM",
  "45": "YZV",
  "29": "YYT",
  "30": "YJN",
  "31": "YSB",
  "32": "YQT",
  "34": "YTZ",
  "33": "YKZ",
  "35": "YYZ",
  "36": "CXH",
  "37": "YVR",
  "38": "YYJ",
  "39": "YXY",
  "40": "YQG",
  "41": "YWG",
  "42": "2DCI",
  "43": "YZF"
};
const geoToNumMajorTowers = {
  "1YSB": "5",
  "2DCI": "42",
  "CXH": "36",
  "CZVL": "9",
  "YAM": "28",
  "YDT": "3",
  "YEG": "8",
  "YFC": "47",
  "YHM": "12",
  "YHU": "20",
  "YHZ": "11",
  "YJN": "30",
  "YKF": "14",
  "YKZ": "33",
  "YLW": "13",
  "YLY": "15",
  "YMM": "46",
  "YMX": "18",
  "YOO": "21",
  "YOW": "22",
  "YPK": "23",
  "YQB": "25",
  "YQG": "40",
  "YQM": "17",
  "YQR": "26",
  "YQT": "32",
  "YQX": "10",
  "YRC": "6",
  "YSB": "31",
  "YTZ": "34",
  "YUL": "19",
  "YVR": "37",
  "YWG": "41",
  "YXD": "7",
  "YXE": "27",
  "YXS": "24",
  "YXU": "16",
  "YXX": "2",
  "YXY": "39",
  "YYB": "44",
  "YYC": "4",
  "YYJ": "38",
  "YYT": "29",
  "YYZ": "35",
  "YZF": "43",
  "YZV": "45"
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
