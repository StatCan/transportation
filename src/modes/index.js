import makeSankey from "./makeSankey.js";
import tableSettingsInit from "./tableSettings.js";
import CopyButton from "../copyButton.js";
import NodesTree from "./nodesTree.js";
import dropdownCheck from "../dropdownCheck.js";

/* Copy Button and DataTree*/
// -----------------------------------------------------------------------------
const cButton = new CopyButton();
const dataTree = new NodesTree();

// -----------------------------------------------------------------------------
// Add number formatter to stackedArea settings file
const thisLang = document.getElementsByTagName("html")[0].getAttribute("lang");
const settingsAux = {
  formatNum: function() {
    let formatNumber;
    if (thisLang === "fr") {
      const locale = d3.formatLocale({
        decimal: ",",
        thousands: " ",
        grouping: [3]
      });
      formatNumber = locale.format(",d");
    } else {
      formatNumber = d3.format(",d");
    }

    const format = function(d) {
      if (Number(d)) {
        return formatNumber(d);
      } else {
        return d;
      }
    };
    return format;
  }
};

const tableSettings = {...tableSettingsInit, ...settingsAux};

// -----------------------------------------------------------------------------
let selectedRegion = "Canada";
let selectedMonth;
let selectedYear;
let dateRange;
const data = {};

// global used on sankey
const sankeyNodes = dataTree.toArray();
// ------------


const loadData = function(selectedYear, selectedMonth, cb) {
  if (!data[selectedYear + "-" + selectedMonth]) {
    d3.json("data/modes/" + selectedYear + "-" + selectedMonth + ".json", function(err, json) {
      if (err) {
        console.log("file does not exist");
      }
      data[selectedYear + "-" + selectedMonth] = json;
      cb();
    });
  } else {
    cb();
  }
};

// SVGs
const sankeyChart = d3.select("#sankeyGraph")
    .append("svg")
    .attr("id", "svg_sankeyChart");

const table = d3.select(".tabledata");

function uiHandler(event) {
  // clear any tooltips
  d3.selectAll(".tooltip").style("opacity", 0);

  if (event.target.id === "groups" || event.target.id === "month" || event.target.id === "year") {
    selectedRegion = document.getElementById("groups").value;
    selectedMonth = document.getElementById("month").value;
    selectedYear = document.getElementById("year").value;

    // clear any zeroFlag message
    if (d3.select("#zeroFlag").text() !== "") d3.select("#zeroFlag").text("");

    loadData(selectedYear, selectedMonth, () => {
      createDropdown();
      showData();
    });
  }
}

function showData() {
  const thisMonth = i18next.t(selectedMonth, {ns: "months"});
  const thisRegion = i18next.t(selectedRegion, {ns: "modesTable"});
  const thisData = data[selectedYear + "-" + selectedMonth][selectedRegion];

  // Check that the sum of all nodes is not zero
  const travellerTotal = () => thisData.map((item) => item.value).reduce((prev, next) => prev + next);
  if (travellerTotal() === 0) {
    d3.selectAll("svg > *").remove();
    d3.select("#zeroFlag")
        .text(`${i18next.t("noData", {ns: "modes_sankey"})} ${thisRegion},
          ${thisMonth} ${selectedYear}`);
  } else {
    d3.selectAll("svg > *").remove();

    makeSankey(sankeyChart, settingsAux, {
      nodes: sankeyNodes,
      links: data[selectedYear + "-" + selectedMonth][selectedRegion]
    });
  }

  const dataTable = data[selectedYear + "-" + selectedMonth][selectedRegion];

  dataTree.setData(dataTable);
  const auxArray = dataTree.toArray();
  auxArray.forEach(function(item) {
  });

  drawTable(table, tableSettings, auxArray);
  $( ".wb-fnote" ).trigger( "wb-init.wb-fnote" );

  updateTitles();
  // ------------------copy button---------------------------------
  cButton.appendTo(document.getElementById("copy-button-container"));

  dataCopyButton();
  // ---------------------------------------------------------------
}

/* -- update table title -- */
function updateTitles() {
  const thisGeo = i18next.t(selectedRegion, {ns: "modesTable"});
  const thisMonth = i18next.t(selectedMonth, {ns: "months"});
  const thisTitle = i18next.t("tableTitle", {ns: "modesTable"}) + " " + thisGeo
  + ", " + thisMonth + " " + selectedYear + ", " + i18next.t("byType", {ns: "modesTable"});

  d3.select("#only-dt-tbl").text(thisTitle);
  d3.select("#table-caption").text(thisTitle);
}
// create year dropdown based on data
function createDropdown() {
  const yearId = `#${"year"}`;
  const monthId = `#${"month"}`;

  dropdownCheck(yearId, monthId, dateRange, selectedYear);
}

// -----------------------------------------------------------------------------
/* Copy Button*/
function dataCopyButton() {
  const geo = i18next.t(selectedRegion, {ns: "modesTable"});
  const month = i18next.t(selectedMonth, {ns: "months"});
  const title = i18next.t("tableTitle", {ns: "modesTable"}) + geo
  + ", " + month + " " + selectedYear + ", " + i18next.t("byType", {ns: "modesTable"});

  const columns = [i18next.t("name", {ns: "modes_sankey"}), i18next.t("value", {ns: "modes_sankey"})];
  cButton.data = dataTree.toLines(title, columns);
}

// -----------------------------------------------------------------------------
/* Initial page load */
i18n.load(["src/i18n"], function() {
  d3.queue()
      .defer(d3.json, "data/modes/dateRange.json")
      .await(function(error, dataDateRange) {
        dateRange = dataDateRange;
        selectedMonth = dateRange.max.substring(5, 7);
        selectedYear = dateRange.max.substring(0, 4);

        createDropdown();
        d3.select("#year")._groups[0][0].value = selectedYear;
        d3.select("#month")._groups[0][0].value = selectedMonth;
        // copy button options
        const cButtonOptions = {
          pNode: document.getElementById("copy-button-container"),
          title: i18next.t("CopyButton_Title", {ns: "CopyButton"}),
          msgCopyConfirm: i18next.t("CopyButton_Confirm", {ns: "CopyButton"}),
          accessibility: i18next.t("CopyButton_Title", {ns: "CopyButton"})
        };
        // build nodes on copy button
        cButton.build(cButtonOptions);
        loadData(selectedYear, selectedMonth, showData);
      });
});

$(document).on("change", uiHandler);
