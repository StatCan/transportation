import settings from "./settings.js";
import settingsBubbleTable from "./settings_bubbleTable.js";

const map = d3.select(".dashboard .map")
    .append("svg");
const chart = d3.select(".data")
    .append("svg")
    .attr("id", "svg_areaChart");
const rankChart = d3.select("#rankTable") // .select(".data")
    .append("svg")
    .attr("id", "svg_rankChart");
// !!!!!!! WIP !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const data = {};
let selected = "CANADA"; // default region for areaChart

let selectedAirpt;
let selectedProv;
const rankData = {};

/* canada map */
const heading = d3.select(".dashboard h4");

function uiHandler(event) {
  if (event.target.id === "groups") {
    selected = document.getElementById("groups").value; // clear any previous airport title
    d3.select(".dashboard h4").text("");
    showAreaData();
  }
}

function showAreaData() {
  const showChart = () => {
    areaChart(chart, settings, data[selected]);
  };
  // change area chart title to match selected province
  if (d3.select(".dashboard h4").text().indexOf("contribution from airport") === -1) {
    d3.select(".dashboard h4").text(i18next.t(selected, {ns: "provinces"}));
  }

  if (!data[selected]) {
    return d3.json(`data/air/${selected}_numMovements.json`, (ptData) => {
      data[selected] = ptData;
      showChart();
    });
  }
  showChart();
}

function showAirport() {
  const fname = `data/air/combo_${selectedProv}_${selectedAirpt}_numMovements.json`;

  // Load airport data containing remaining provincial totals
  d3.json(fname, function(err, filedata) {
    selected = `${selectedProv}_${selectedAirpt}`; // "ON_YYZ";
    data[selected] = filedata;
    showAreaData();
  });

  // call re-useable component bubbleTable
  if (!rankData[selectedAirpt]) {
    return d3.json(`data/air/rankdata_${selectedAirpt}.json`, (aptData) => {
      rankData[selectedAirpt] = aptData;
      bubbleTable(rankChart, settingsBubbleTable, rankData[selectedAirpt]);
    });
  }
  bubbleTable(rankChart, settings_bubbleTable, rank_data[selected_airpt]);
}

getCanadaMap(map).on("loaded", function() {
  d3.json("geojson/testairport.geojson", (error, airports) => {
    if (error) throw error;

    const airportGroup = map.append("g");
    const path = d3.geoPath().projection(this.settings.projection)
        .pointRadius(2);

    airportGroup.selectAll("path")
        .data(airports.features)
        .enter().append("path")
        .attr("d", path)
        .attr("id", (d, i) => {
          return "airport" + d.id;
        })
        .attr("class", "airport")
        .style("fill", "#7E0C33")
        .on("mouseover", (d) => {
          selectedAirpt = d.id;
          selectedProv = d.province;
          // change area chart title to match selected province
          heading.text(`${selectedProv} and contribution from airport ${selectedAirpt}`);
          showAirport();
        });
  });
});

i18n.load(["src/i18n"], showAreaData);
$(document).on("change", uiHandler);
