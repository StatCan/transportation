export default function(data, settings, origin) {
  var sett = settings;
  var thisSVG = d3.select("#railTable"); // .select("svg");

  var summaryId = "table"; // "chrt-dt-tbl";
  // const filteredData = (sett.filterData && typeof sett.filterData === "function") ?
  //     sett.filterData(data, "table") : data;
  // use original data, not array returned by filteredData which may contain inserted year-end datapts

  var filteredData = filterData(data)
  var details = thisSVG.select(".chart-data-table");
  let keys = ["AT", "QC", "ON", "MB", "SK", "AB", "BC", "USA-MX", "All"]
  var table;
  var header;
  var body;
  var dataRows;
  var dataRow;
  var k;

  if (sett.dataTableTotal) {
    keys.push("total");
  }

  if (!details.empty()) {
    // details.remove();
    details.remove();
  } // if (details.empty()) {


  details = thisSVG.append("div").attr("class", "chart-data-table"); // ----Copy Button Container ---------------------------------------------

  var copyButtonId = "copy-button-container"; // let copyButton = document.createElement("div");
  // copyButton.setAttribute("id", copyButtonId);
  // details.append(copyButton);

  details.append("div") // .attr("id", summaryId)
  .attr("id", function () {
    if (d3.select("#chrt-dt-tbl").empty()) return summaryId;else return summaryId + "1"; // allow for a second table
    // return summaryId;
  }) // .text(sett.datatable.title);
  .text(sett.tableTitle); // ------------------------------------------------------------------------

  details.append("div").attr("id", copyButtonId);
  table = details.append("table").attr("class", "table");
  table.append("caption") // .text(sett.datatable.title);
  .attr("class", "wb-inv").text(sett.tableTitle);
  header = table.append("thead").attr("id", "tblHeader").append("tr").attr("id", "tblHeaderTR");
  body = table.append("tbody").attr("id", "tblBody");
  header.append("td").attr("id", "thead_h0").text(filterYear(sett.x.label));
//  debugger

  for (k = 0; k < keys.length; k++) {
    header.append("th").attr("id", "thead_h" + (k + 1))
    .style("text-align", "right")
    .text(sett.z.getHeaderText.bind(sett)({key: [origin, keys[k]] }));
  }

  dataRows = body.selectAll("tr").data(filteredData);

  dataRow = dataRows.enter().append("tr").attr("id", function (d, i) {
    return "row" + i;
  });
  dataRow.append("th").attr("id", function (d, i) {
    return "row" + i + "_h0";
  }).text((sett.x.getText || sett.x.getValue).bind(sett));

  for (k = 0; k < keys.length; k++) {
    dataRow.append("td").attr("headers", function (d, i) {
      return "row" + i + "_h0" + " thead_h" + (k + 1);
    }).text(function(d) {
      return sett.formatNum(d[keys[k]]);
    }).style("text-align", "right");
  }

  if ($ || wb) {
    $(".chart-data-table summary").trigger("wb-init.wb-details");
  }

};

function filterYear(key) {
  if (key !== "Year") {
    return key;
  } else {
    return "";
  }
}


function filterData(originalData) {
  let returnArray = [];
  for (let year in originalData) {
    let entry = {};
    entry.year = year;
    for (let geo in originalData[year]){
      entry[geo] = originalData[year][geo];
    }
    returnArray.push(entry);
  }
  return returnArray;
}
