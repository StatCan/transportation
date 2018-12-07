const data = {};
let selected = "CANADA";

const map = d3.select(".dashboard .map")
    .append("svg");

getCanadaMap(map); // .on("loaded", function() {});

// global variables for drawBubbles fn
const rankedCommData = [];
let count = 0;
let years;
let maxVal;
let rankedCommNames; // temp

/* globals areaChart */
const chart = d3.select(".data")
    .append("svg")
    .attr("id", "demo");
const id = "year";
const settings = {
  alt: i18next.t("alt", {ns: "area"}),
  datatable: {
    title: i18next.t("datatableTitle", {ns: "area"})
  },
  filterData: function(data) {
    return data.tonnage;
  },
  x: {
    getValue: function(d) {
      return new Date(d[id] + "-01");
    },
    getText: function(d) {
      return d[id];
    },
    ticks: 7
  },
  y: {
    label: i18next.t("y_label", {ns: "area"}),
    getValue: function(d, key) {
      if (typeof d[key] === "string" || d[key] instanceof String) {
        return 0;
      } else return d[key] * 1.0/ 1000;
    },
    getText: function(d, key) {
      if (typeof d[key] === "string" || d[key] instanceof String) {
        return d[key];
      } else return d[key] * 1.0/ 1000;
    }
  },
  z: {
    label: i18next.t("z_label", {ns: "area"}),
    getId: function(d) {
      return d.key;
    },
    getKeys: function(object) {
      const sett = this;
      const keys = Object.keys(object[0]);
      keys.splice(keys.indexOf(id), 1);
      if (keys.indexOf(sett.y.totalProperty) !== -1) {
        keys.splice(keys.indexOf(sett.y.totalProperty), 1);
      }
      return keys;
    },
    getClass: function(d) {
      return this.z.getId.apply(this, arguments);
    },
    getText: function(d) {
      return i18next.t(d.key, {ns: "regions"});
    }
  },
  width: 900
};

function uiHandler(event) {
  if (event.target.id === "groups") {
    selected = document.getElementById("groups").value;
    if (!data[selected]) {
      d3.json("data/rail/rail_meat_origATR_ON_BC_dest" + selected + ".json", function(err, filedata) {
        data[selected] = filedata;
        showData();
      });
    } else {
      showData();
    }
  }
}

function showData() {
  areaChart(chart, settings, data[selected]);
}

function showComm() {
  // change area chart title to match selected province
  d3.select(".commTable h4")
      .text("Annual tonnages for all commodities, sorted by volume in 2016: " +
            i18next.t("ATR", {ns: "regions"}) +
            " to " + i18next.t("QC", {ns: "regions"}));

  // var rawCommData = [];
  d3.csv("data/rail/test_commdata_origATR_destQC_SUBSET.csv", function(error, rows) {
    const rawCommData = [];
    rows.forEach(function(d) {
      const x = d[""];
      delete d[""];
      for (prop in d) {
        const y = prop,
          value = d[prop];
        rawCommData.push({
          x: y,
          y: x,
          value: +value
        });
      }
    });

    // //Extract data for only year 2016
    // var filterYear = rawCommData.filter(item => item.x === "2016");

    // //Sort these 2016 values
    // filterYear.sort((a,b) => (a.value > b.value) ? -1 : ((b.value > a.value) ? 1 : 0));
    // console.log("filterYear: ", filterYear)

    // //Save sorted commodities in array
    // var sortedCommArray = filterYear.map(item => item.y);
    // console.log("sortedCommArray: ", sortedCommArray)

    // //sort rawCommData according to string order in sortedCommArray
    // //??????????

    years = rawCommData.filter((item) => item.y === "wheat").map((item) => item.x);
    rawCommData.sort((a, b) => (a.value > b.value) ? -1 : ((b.value > a.value) ? 1 : 0));
    maxVal = rawCommData[0].value;
    console.log("maxVal: ", maxVal);

    // console.log("sorted Comm: ", rawCommData)
    // Commodities in descending order of yr 2016 value
    rankedCommNames = rawCommData.filter((item) => item.x === "2016").map((item) => item.y);
    // console.log("rankedCommNames: ", rankedCommNames)

    // var rankedCommData = [];
    for (let idx = 0; idx < rankedCommNames.length; idx++) {
      for (let jdx = 0; jdx < years.length; jdx++) {
        const thisVal = rawCommData.filter((item) => item.x === years[jdx] &&
                      item.y === rankedCommNames[idx]).map((item) => item.value)[0];
        rankedCommData.push( {"x": years[jdx], "y": rankedCommNames[idx], "value": thisVal} );
      }
    }

    // // List of all variables and number of them
    // var domain = d3.set(rankedCommData.map(function(d) { return d.x })).values()
    // var num = Math.sqrt(rankedCommData.length)

    drawBubbles(rankedCommData, years, maxVal, count);
  }); // end d3.csv
}

function drawBubbles(rankedCommData, years, maxVal, count) {
  // ---------------------------------------
  // diplay-related
  const numPerPage = 5; // number of commodities to display per page
  const numCommodities = rankedCommNames.length;
  const numPages = Math.ceil(numCommodities/numPerPage);

  // Page counter display
  d3.select("#pageNum")
      .text(`Page ${count + 1}/${numPages}`);

  d3.select("#commgrid").select("svg").remove(); // clear for next display
  if (count >= numPages - 1) d3.select("#nextButton").classed("inactive", true);
  else d3.select("#nextButton").classed("inactive", false);
  const s0 = count*numPerPage;
  const s1 = (count + 1) * numPerPage;

  // ---------------------------------------
  // svg params
  // Adapted from: https://www.d3-graph-gallery.com/graph/correlogram_basic.html
  // Graph dimension
  const margin = {top: 20, right: 0, bottom: 20, left: 150};
  const width = 1230 - margin.left - margin.right;
  const height = 370 - margin.top - margin.bottom;

  // Create the svg area
  const svg = d3.select("#commgrid")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // ---------------------------------------
  // bubble table params

  // Create a color scale
  // var color = d3.scaleLinear()
  //   .domain([1, 5, 10])
  //   .range(["#B22222", "#fff", "#000080"]);

  // Create a size scale for bubbles on top right. Watch out: must be a rootscale!
  const size = d3.scaleSqrt()
      .domain([0, 1])
      .range([0, .1]);

  // X scale
  const x = d3.scaleLinear()
      .domain([2001, 2016])
      .range([0, width/1.1]);

  // var color = d3.scaleLinear()
  //   .domain([1, 5, 10])
  //   .range(["#B22222", "#fff", "#000080"]);

  // ---------------------------------------
  // Slice the data to diplay n commodities at a time
  let displayData = [];
  displayData = rankedCommData.filter((item) => rankedCommNames.slice(s0, s1).indexOf(item.y) != -1);
  console.log("displayData: ", displayData);

  // ---------------------------------------
  // Diplay slice
  // Create one 'g' element for each cell of the correlogram
  let comm0; let idx;
  let y0; let ycoord; let delta;
  const cor = svg.attr("class", "rankplot")
      .selectAll(".cor")
      .data(displayData)
      .enter()
      .append("g")
      .attr("class", "cor")
      .attr("transform", function(d, i) {
        if (i===0) {
          comm0 = d.y;
          idx = 0;
        }
        y0 = 40;
        delta = 2*size(maxVal); // 35;
        if (d.y !== comm0) {
          comm0 = d.y;
          if (i%years.length === 0) idx++; // only increment idx when i is divisible by the number of years
        }
        ycoord = y0 + idx*delta;

        return "translate(" + x(d.x) + "," + ycoord + ")";
      });

  // add circles
  cor
      .append("circle")
      .attr("class", function(d) {
        return "comm_gen";
      })
      .attr("r", function(d) {
        return size(Math.abs(d.value));
        // return size(Math.log( Math.abs(d.value)) );
      });

  // label columns by year
  cor.append("text")
      .attr("dx", function(d) {
        return -20;
      })
      .attr("dy", function(d) {
        return -30;
      })
      .attr("class", "comm_yr")
      .text(function(d) {
        if (d.y === rankedCommNames[s0]) return d.x;
      });

  // label rows by commdity name
  cor.append("text")
      .attr("dx", function(d) {
        return -150;
      })
      .attr("dy", function(d) {
        return 4;
      })
      .attr("class", "comm_type")
      .text(function(d) {
        if (d.x === "2001") return d.y;
      });

  // label circle by value
  cor.append("text")
      .attr("dx", function(d) {
        return -2;
      })
      .attr("dy", function(d) {
        return 4;
      })
      .attr("class", "comm_value")
      .text(function(d) {
        if (d.value === 0) return d.value;
      });
} // .drawBubbles

i18n.load(["src/i18n"], function() {
  d3.queue()
      .defer(d3.json, "data/rail/rail_meat_origATR_ON_BC_destQC.json")
      .await(function(error, data) {
        areaChart(chart, settings, data);
        showComm(); // display sorted commodity bubble table

        d3.select("#prevButton").classed("inactive", true);

        d3.select("#nextButton")
            .on("click", function() {
              count++;
              count === 0 ? d3.select("#prevButton").classed("inactive", true) :
                        d3.select("#prevButton").classed("inactive", false);

              drawBubbles(rankedCommData, years, maxVal, count);
            });

        d3.select("#prevButton")
            .on("click", function() {
              count--;
              count === 0 ? d3.select("#prevButton").classed("inactive", true) :
                            d3.select("#prevButton").classed("inactive", false);

              drawBubbles(rankedCommData, years, maxVal, count);
            });
      });
});

$(document).on("change", uiHandler);
