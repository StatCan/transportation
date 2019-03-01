import makeSankey from "./makeSankey.js";
import tableSettings from "./tableSettings.js";
import CopyButton from "../copyButton.js";
import NodesTree from "./nodesTree.js";

/* Copy Button and DataTree*/
// -----------------------------------------------------------------------------
const cButton = new CopyButton();
const dataTree = new NodesTree();
// -----------------------------------------------------------------------------


let selectedRegion = "Canada";

let selectedMonth = "01";
let selectedYear = "2018";
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
// .attr("id", "modesTable");

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
      showData();
    });
  }
}

function showData() {
  const thisMonth = i18next.t(selectedMonth, {ns: "modesMonth"});
  const thisRegion = i18next.t(selectedRegion, {ns: "modesGeography"});
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

    makeSankey(sankeyChart, {}, {
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

  updateTitles();
  // ------------------copy button---------------------------------
  cButton.appendTo(document.getElementById("copy-button-container"));

  dataCopyButton();
  // ---------------------------------------------------------------
}

/* -- update table title -- */
function updateTitles() {
  const thisGeo = i18next.t(selectedRegion, {ns: "modesGeography"});
  const thisMonth = i18next.t(selectedMonth, {ns: "modesMonth"});
  const thisTitle = i18next.t("tableTitle", {ns: "modes_sankey"}) + " " + thisGeo
  + ", " + thisMonth + " " + selectedYear + ", " + i18next.t("byType", {ns: "modes_sankey"});

  d3.select("#only-dt-tbl").text(thisTitle);
}

// -----------------------------------------------------------------------------
/* Copy Button*/
function dataCopyButton() {
  const geo = i18next.t(selectedRegion, {ns: "modesGeography"});
  const month = i18next.t(selectedMonth, {ns: "modesMonth"});
  const title = i18next.t("tableTitle", {ns: "modes_sankey"}) + " " + geo
  + ", " + month + " " + selectedYear + ", " + i18next.t("byType", {ns: "modes_sankey"});

  const columns = [i18next.t("name", {ns: "modes_sankey"}), i18next.t("value", {ns: "modes_sankey"})];
  cButton.data = dataTree.toLines(title, columns);
}

// -----------------------------------------------------------------------------
/* Initial page load */
i18n.load(["src/i18n"], function() {
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

$(document).on("change", uiHandler);
