const ProductId = 24100041;
const proxy = "https://cors-anywhere.herokuapp.com/";
const webAPI = "https://www150.statcan.gc.ca/t1/wds/rest/getDataFromCubePidCoordAndLatestNPeriods";

const outputFormat = {
  "nodes": [
    {"node":0,"name": "intl"},
    {"node":1,"name": "USres"},
    {"node":2,"name": "nonUSres"},
    {"node":3,"name": "cdnFromUS"},
    {"node":4,"name": "cdnFromOther"},
    {"node":5,"name": "USres_air"},
    {"node":6,"name": "USres_marine"},
    {"node":7,"name": "USres_land"},//must be derived
    {"node":8,"name": "nonUSres_air"},
    {"node":9,"name": "nonUSres_marine"},
    {"node":10,"name": "nonUSres_land"},
    {"node":11,"name": "cdnFromUS_air"},
    {"node":12,"name": "cdnFromUS_marine"},
    {"node":13,"name": "cdnFromUS_land"},//must be derrived
    {"node":14,"name": "cdnFromOther_air"},
    {"node":15,"name": "cdnFromOther_marine"},
    {"node":16,"name": "cdnFromOther_land"},
    {"node":17,"name": "USres_car"},
    {"node":18,"name": "USres_bus"},
    {"node":19,"name": "USres_train"},
    {"node":20,"name": "USres_other"},
    {"node":21,"name": "cdnFromUS_car"},
    {"node":22,"name": "cdnFromUS_bus"},
    {"node":23,"name": "cdnFromUS_train"},
    {"node":24,"name": "cdnFromUS_other"}
    ]
}
const namesToNode = {
    "intl": 0,
    "USres":1,
    "nonUSres":2,
    "cdnFromUS":3,
    "cdnFromOther":4,
    "USres_air":5,
    "USres_marine":6,
    "USres_land":7,
    "nonUSres_air":8,
    "nonUSres_marine":9,
    "nonUSres_land":10,
    "cdnFromUS_air":11,
    "cdnFromUS_marine":12,
    "cdnFromUS_land":13,
    "cdnFromOther_air":14,
    "cdnFromOther_marine":15,
    "cdnFromOther_land":16,
    "USres_car":17,
    "USres_bus":18,
    "USres_train":19,
    "USres_other":20,
    "cdnFromUS_car":21,
    "cdnFromUS_bus":22,
    "cdnFromUS_train":23,
    "cdnFromUS_other":24
}
const namesToSource = {
    "USres":0,
    "nonUSres":0,
    "cdnFromUS":0,
    "cdnFromOther":0,
    "USres_air":1,
    "USres_marine":1,
    "USres_land":1,
    "nonUSres_air":2,
    "nonUSres_marine":2,
    "nonUSres_land":2,
    "cdnFromUS_air":3,
    "cdnFromUS_marine":3,
    "cdnFromUS_land":3,
    "cdnFromOther_air":4,
    "cdnFromOther_marine":4,
    "cdnFromOther_land":4,
    "USres_car":7,
    "USres_bus":7,
    "USres_train":7,
    "USres_other":7,
    "cdnFromUS_car":13,
    "cdnFromUS_bus":13,
    "cdnFromUS_train":13,
    "cdnFromUS_other":13
}
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
  "NU": 266
}
const numToProvince = {
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
  266:"NU"
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

let output = {};
const qi_F = 8;

export default function(numPeriods) {
  return new Promise((resolve, reject) => {
    // get coordinates for data


    const coordinateArray = coordinateTranslate();
    const yearRange = numPeriods;
    let returnObject;
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
        returnObject = buildSankeyNodes(data,yearRange);
        resolve(returnObject);
      },
      error: function(jqXhr, textStatus, errorThrown) {
        reject(errorThrown);
      }
    });
  });
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

function buildSankeyNodes(data, yearRange){
  for (let entry of data){
    for (let year = 0; year < yearRange; year++){
      var item ={};
      var datapoint = entry.object.vectorDataPoint[year];
      let returnValue;
      if (datapoint.statusCode != 1 && datapoint.securityLevelCode == 0 && datapoint.statusCode != qi_F) {
        returnValue = datapoint.value;
      } else {
        returnValue = statusCodes[datapoint.statusCode];
      }

      item.value = returnValue;

      var date = datapoint.refPer.substring(0, 7);
      var geo = numToProvince[entry.object.coordinate.split(".", 2)[0]];
      var characteristic = numToChar[entry.object.coordinate.split(".", 2)[1]];
      item.target = namesToNode[characteristic]
      item.source = namesToSource[characteristic]
      if(item.target !== 0){
      if(output.hasOwnProperty(date)){
        if(output[date].hasOwnProperty(geo)){
          if(item.source === namesToNode["USres_land"]){
            if(output[date][geo].hasOwnProperty(namesToNode["USres_land"]) && !isNaN(Number(item.value))){
              if(isNaN(output[date][geo][namesToNode["USres_land"]].value)){
                output[date][geo][namesToNode["USres_land"]].value = item.value;
              }
              else{
                output[date][geo][namesToNode["USres_land"]].value += item.value;
              }
            }
            else{
              output[date][geo][namesToNode["USres_land"]] = {};
              output[date][geo][namesToNode["USres_land"]].target = namesToNode["USres_land"];
              output[date][geo][namesToNode["USres_land"]].source = namesToNode["USres"];
              output[date][geo][namesToNode["USres_land"]].value = item.value;
            }
            output[date][geo][item.target] = item;
          }
          if(item.source === namesToNode["cdnFromUS_land"]){
            if(output[date][geo].hasOwnProperty(namesToNode["cdnFromUS_land"]) && !isNaN(Number(item.value))){
              if(isNaN(output[date][geo][namesToNode["cdnFromUS_land"]].value)){
                output[date][geo][namesToNode["cdnFromUS_land"]].value = item.value;
              }else{
                output[date][geo][namesToNode["cdnFromUS_land"]].value += item.value;
              }
            }
            else{
              output[date][geo][namesToNode["cdnFromUS_land"]] = {};
              output[date][geo][namesToNode["cdnFromUS_land"]].target = namesToNode["cdnFromUS_land"];
              output[date][geo][namesToNode["cdnFromUS_land"]].source = namesToNode["cdnFromUS"];
              output[date][geo][namesToNode["cdnFromUS_land"]].value = item.value;
            }
            output[date][geo][item.target] = item;
          }
          output[date][geo][item.target] = item;

        }
        else{
          output[date][geo] ={};
          output[date][geo][item.target] = item;

        }
      }
      else{
        output[date] = {};
        output[date][geo] ={};
        output[date][geo][item.target] = item;

      }}
    }
  }
  for(var date in output){
    for (var geo in output[date]){
      output[date][geo] = Object.values(output[date][geo])

    }
    output[date]["nodes"] = [
    {"node":0,"name": "intl"},
    {"node":1,"name": "USres"},
    {"node":2,"name": "nonUSres"},
    {"node":3,"name": "cdnFromUS"},
    {"node":4,"name": "cdnFromOther"},
    {"node":5,"name": "USres_air"},
    {"node":6,"name": "USres_marine"},
    {"node":7,"name": "USres_land"},
    {"node":8,"name": "nonUSres_air"},
    {"node":9,"name": "nonUSres_marine"},
    {"node":10,"name": "nonUSres_land"},
    {"node":11,"name": "cdnFromUS_air"},
    {"node":12,"name": "cdnFromUS_marine"},
    {"node":13,"name": "cdnFromUS_land"},
    {"node":14,"name": "cdnFromOther_air"},
    {"node":15,"name": "cdnFromOther_marine"},
    {"node":16,"name": "cdnFromOther_land"},
    {"node":17,"name": "USres_car"},
    {"node":18,"name": "USres_bus"},
    {"node":19,"name": "USres_train"},
    {"node":20,"name": "USres_other"},
    {"node":21,"name": "cdnFromUS_car"},
    {"node":22,"name": "cdnFromUS_bus"},
    {"node":23,"name": "cdnFromUS_train"},
    {"node":24,"name": "cdnFromUS_other"}
  ];
  }
  return output;
}
