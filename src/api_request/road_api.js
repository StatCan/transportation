export default function() {
  $.support.cors = true;

  const myData = [{"productId": 35100003, "coordinate": "1.12.0.0.0.0.0.0.0.0", "latestN":3}];



  $.ajax({
    type: "post",
    url: "https://www150.statcan.gc.ca/t1/wds/rest/getDataFromCubePidCoordAndLatestNPeriods",
    data: JSON.stringify( myData ),
    dataType: "json",
    contentType: "application/json",
    success: function( data, textStatus, jQxhr ) {
      debugger
      alert(data);
    },
    error: function( jqXhr, textStatus, errorThrown ) {
      debugger

      alert( errorThrown );
    }
  });
}
