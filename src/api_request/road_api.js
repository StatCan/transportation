const NetGas = 1;
const NetDiesel = 3;
const NetLPG = 4;
const RoadProductId = 23100066;

export default function(maxYear, selectedYear, geography) {
  return new Promise((resolve, reject) => {
    // get coordinates for data

    if (geography === "ALL") {
      const coordinateArray = coordinateTranslate(geography);
      const yearRange = maxYear - selectedYear + 1;
      const returnArray = [];
      for (let i =0; i< coordinateArray.length; i +=3 ) {
        const myData = [
          {"productId": RoadProductId, "coordinate": coordinateArray[i], "latestN": yearRange},
          {"productId": RoadProductId, "coordinate": coordinateArray[i+1], "latestN": yearRange},
          {"productId": RoadProductId, "coordinate": coordinateArray[i+2], "latestN": yearRange},
        ];

        $.support.cors = true;

        $.ajax({
          type: "post",
          url: "https://cors-anywhere.herokuapp.com/https://www150.statcan.gc.ca/t1/wds/rest/getDataFromCubePidCoordAndLatestNPeriods",
          data: JSON.stringify(myData),
          dataType: "json",
          contentType: "application/json",
          success: function(data, textStatus, jQxhr) {
            returnArray.push(rebuildData(data, geography));
            if (i = coordinateArray.length -1) {
              resolve(returnArray);
            }
          },
          error: function(jqXhr, textStatus, errorThrown) {
            reject(errorThrown);
          }
        });
      }
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
        url: "https://www150.statcan.gc.ca/t1/wds/rest/getDataFromCubePidCoordAndLatestNPeriods",
        data: JSON.stringify(myData),
        dataType: "json",
        contentType: "application/json",
        success: function(data, textStatus, jQxhr) {
          resolve(rebuildData(data, geography));
        },
        error: function(jqXhr, textStatus, errorThrown) {
          reject(errorThrown);
          alert("An error occured");
        }
      });
    }
  });
}

function rebuildData(data, geography) {
  const returnObject = {};
  for (let i = 0; i < data.length; i++) {
    const returnType = Number(data[i].object.coordinate.substring(2, 3));
    let returnValue;
    if (data[i].object.vectorDataPoint[0].value) {
      returnValue = data[i].object.vectorDataPoint[0].value;
    } else {
      returnValue = data[i].object.vectorDataPoint[0].status;
    }

    if (returnType === NetGas) {
      returnObject.gas = returnValue;
    } else if (returnType === NetDiesel) {
      returnObject.diesel = returnValue;
    } else if (returnType === NetLPG) {
      returnObject.lpg = returnValue;
    }
  }
  returnObject.date = data[0].object.vectorDataPoint[0].refPer.substring(0, 4);
  if (geography != "CANADA") {
    returnObject.annualTotal = returnObject.lpg + returnObject.diesel + returnObject.gas;
  }

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
