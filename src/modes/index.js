import makeSankey from "./makeSankey.js";
import tableSettings from "./tableSettings.js";

let selectedGeo = "Canada";

let selectedMonth = "01";
let selectedYear = "2018";
const data = {};

// global nodes
const nodes = [
  {
    "node": 0,
    "name": "intl"
  },
  {
    "node": 1,
    "name": "USres"
  },
  {
    "node": 2,
    "name": "nonUSres"
  },
  {
    "node": 3,
    "name": "cdnFromUS"
  },
  {
    "node": 4,
    "name": "cdnFromOther"
  },
  {
    "node": 5,
    "name": "USres_air"
  },
  {
    "node": 6,
    "name": "USres_marine"
  },
  {
    "node": 7,
    "name": "USres_land"
  },
  {
    "node": 8,
    "name": "nonUSres_air"
  },
  {
    "node": 9,
    "name": "nonUSres_marine"
  },
  {
    "node": 10,
    "name": "nonUSres_land"
  },
  {
    "node": 11,
    "name": "cdnFromUS_air"
  },
  {
    "node": 12,
    "name": "cdnFromUS_marine"
  },
  {
    "node": 13,
    "name": "cdnFromUS_land"
  },
  {
    "node": 14,
    "name": "cdnFromOther_air"
  },
  {
    "node": 15,
    "name": "cdnFromOther_marine"
  },
  {
    "node": 16,
    "name": "cdnFromOther_land"
  },
  {
    "node": 17,
    "name": "USres_car"
  },
  {
    "node": 18,
    "name": "USres_bus"
  },
  {
    "node": 19,
    "name": "USres_train"
  },
  {
    "node": 20,
    "name": "USres_other"
  },
  {
    "node": 21,
    "name": "cdnFromUS_car"
  },
  {
    "node": 22,
    "name": "cdnFromUS_bus"
  },
  {
    "node": 23,
    "name": "cdnFromUS_train"
  },
  {
    "node": 24,
    "name": "cdnFromUS_other"
  }
];
// ------------

// SVGs
const sankeyChart = d3.select("#sankeyGraph")
    .append("svg")
    .attr("id", "svg_sankeyChart");

const table = d3.select(".tabledata");
// .attr("id", "modesTable");

function uiHandler(event) {
  if (event.target.id === "groups" || event.target.id === "month" || event.target.id === "year") {
    selectedGeo = document.getElementById("groups").value;
    selectedMonth = document.getElementById("month").value;
    selectedYear = document.getElementById("year").value;

    if (!data[selectedYear + "-" + selectedMonth]) {
      d3.json("data/modes/" + selectedYear + "-" + selectedMonth + ".json", function(err, filedata) {
        data[selectedYear + "-" + selectedMonth] = filterZeros(filedata);
        showData();
      });
    } else {
      const thisMonth = i18next.t(selectedMonth, {ns: "modesMonth"});

      if (data[selectedYear + "-" + selectedMonth][selectedGeo].links.length === 0) {
        d3.selectAll("svg > *").remove();
        d3.select("#zeroFlag")
            .text(`Zero international travellers for ${selectedGeo},
              ${thisMonth} ${selectedYear}`);
      }
      showData();
    }
  }
}

function showData() {
  d3.selectAll("svg > *").remove();
  makeSankey(sankeyChart, nodes, data[selectedYear + "-" + selectedMonth][selectedGeo]);
  drawTable(table, tableSettings, nodes);
  updateTitles();
}

/* -- update table title -- */
function updateTitles() {
  const thisGeo = i18next.t(selectedGeo, {ns: "modesGeography"});
  const thisMonth = i18next.t(selectedMonth, {ns: "modesMonth"});
  const thisTitle = "International travellers entering or returning to" + " " + thisGeo
  + " in " + thisMonth + " " + selectedYear + ", by type of transport";

  d3.select("#only-dt-tbl").text(thisTitle);
}

function filterZeros(d) {
  const returnObject = {};
  for (const geo in d) {
    if (Object.prototype.hasOwnProperty.call(d, geo)) {
      returnObject[geo] = {};
      returnObject[geo].links = [];
      for (const val of d[geo]) {
        if (val.value !==0) {
          returnObject[geo].links.push(val);
        }
      }
    }
  }
  return returnObject;
}

i18n.load(["src/i18n"], function() {
  d3.queue()
      .defer(d3.json, "data/modes/" + selectedYear + "-" + selectedMonth + ".json")
      .await(function(error, json) {
        data[selectedYear + "-" + selectedMonth] = filterZeros(json);
        makeSankey(sankeyChart, nodes, data[selectedYear + "-" + selectedMonth][selectedGeo]);
        drawTable(table, tableSettings, nodes);
        updateTitles();
      });
});

$(document).on("change", uiHandler);
