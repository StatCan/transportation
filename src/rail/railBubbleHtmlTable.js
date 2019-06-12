export default function(data, tableTitle, settings) {
  var sett = settings;
  var thisSVG = d3.select("#bubbleTableHtml"); // .select("svg");

  var summaryId = "table"; // "chrt-dt-tbl";
  // const filteredData = (sett.filterData && typeof sett.filterData === "function") ?
  //     sett.filterData(data, "table") : data;
  // use original data, not array returned by filteredData which may contain inserted year-end datapts

  var filteredData = data
  var details = thisSVG.select(".chart-data-table");
  let keys = ["coal", "mixed", "wheat", "potash", "ores", "oils", "canola", "lumber", "chems", "pulp"]
  var table;
  var header;
  var body;
  var dataRows;
  var dataRow;
  var k;

  if (!details.empty()) {
    details.remove();
  }
  details = thisSVG.append("div").attr("class", "chart-data-table"); // ----Copy Button Container ---------------------------------------------

  var copyButtonId = "copy-button-container-bubble";

  details.append("div").attr("id", function() {
    if (d3.select("#chrt-dt-tbl").empty()) return summaryId; else return summaryId + "2"; // allow for a second table
    // return summaryId;
  }).text(tableTitle); // ------------------------------------------------------------------------

  details.append("div").attr("id", copyButtonId);
  table = details.append("table").attr("class", "table");
  table.append("caption")
  .attr("class", "wb-inv").text(tableTitle);
  header = table.append("thead").attr("id", "tblHeader").append("tr").attr("id", "tblHeaderTR");
  body = table.append("tbody").attr("id", "tblBody");
  header.append("td").attr("id", "thead_h0").text(filterYear(sett.x.label));


  for (k = 0; k < keys.length; k++) {
    header.append("th").attr("id", "thead_h" + (k + 1))
    .style("text-align", "right")
    .text(sett.z.getTableText.bind(sett)({
      key: keys[k]
    }));
  }

  dataRows = body.selectAll("tr").data(filteredData);

  dataRow = dataRows.enter().append("tr").attr("id", function (d, i) {
    return "row" + i;
  });
  dataRow.append("th").attr("id", function (d, i) {
    return "row" + i + "_h0";
  }).text((sett.x.getText || sett.x.getValue).bind(sett));

  for (k = 0; k < keys.length; k++) {
    dataRow.append("td").attr("headers", function(d, i) {
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
