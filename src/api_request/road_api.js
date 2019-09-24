const NetGas = 1;
const NetDiesel = 3;
const NetLPG = 4;
const RoadProductId = 23100066;

export default function(maxYear, selectedYear, geography) {
  $.support.cors = true;
  //get coordinates for data
  let coordinateArray = coordinateTranslate(geography)
  let yearRange = maxYear - selectedYear + 1;


  const myData = [
    {"productId": RoadProductId, "coordinate": coordinateArray[0], "latestN":yearRange},
    {"productId": RoadProductId, "coordinate": coordinateArray[1], "latestN":yearRange},
    {"productId": RoadProductId, "coordinate": coordinateArray[2], "latestN":yearRange}
  ];



  $.ajax({
    type: "post",
    url: "https://www150.statcan.gc.ca/t1/wds/rest/getDataFromCubePidCoordAndLatestNPeriods",
    data: JSON.stringify(myData),
    dataType: "json",
    contentType: "application/json",
    success: function(data, textStatus, jQxhr) {
      debugger
      return rebuildData(data, geography);
    },
    error: function(jqXhr, textStatus, errorThrown) {
      console.log(errorThrown);
      alert("An error occured");
    }
  });
}

function rebuildData(data, geography){
  let returnObject = {};
  for (let i = 0; i < data.length; i++){
    let returnType = Number(data[i].object.coordinate.substring(2,3));
    let returnValue = data[i].object.vectorDataPoint[0].value;
    if(returnType === NetGas){
        returnObject.gas = returnValue;
    }
    else if (returnType === NetDiesel){
        returnObject.diesel = returnValue;
    }
    else{
        returnObject.lpg = returnValue;
      }
    }
  returnObject.date = data[0].object.vectorDataPoint[0].refPer.substring(0,4)
  if(geography != "CANADA"){
    returnObject.annualTotal = returnObject.lpg + returnObject.diesel + returnObject.gas;
  }

  return returnObject

}

function coordinateTranslate(geography){
  let numGeo;
  switch(geography){
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
  }

  return [`${numGeo}.${NetGas}.0.0.0.0.0.0.0.0`,`${numGeo}.${NetDiesel}.0.0.0.0.0.0.0.0`,`${numGeo}.${NetLPG}.0.0.0.0.0.0.0.0`];

}
