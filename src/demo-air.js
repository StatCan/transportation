data = {};
selected = "CANADA";

/* globals areaChart */
var chart = d3.select(".data")
    .append("svg")
      .attr("id", "demo"),
  id = "year",
  settings = {
      alt: i18next.t("alt", {ns: "area"}),
      datatable: {
        title: i18next.t("datatableTitle", {ns: "area"})
      },
      filterData: function(data) {
        return data.numMov;
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
          if (typeof d[key] === 'string' || d[key] instanceof String) {
            return 0;
          }
          else return d[key] * 1.0/ 1000;
        },
        getText: function(d, key) {
          if (typeof d[key] === 'string' || d[key] instanceof String) {
            return d[key];
          }
          else return d[key] * 1.0/ 1000;
        }
      },

      z: {
        label: i18next.t("z_label", {ns: "area"}),
        getId: function(d) {
          return d.key;
        },
        getKeys: function(object) {
          var sett = this,
          keys = Object.keys(object[0]);
          keys.splice(keys.indexOf(id),1);
          if (keys.indexOf(sett.y.totalProperty) !== -1) {
            keys.splice(keys.indexOf(sett.y.totalProperty),1);
          }
          return keys;
        },
        getClass: function(d) {
          return this.z.getId.apply(this, arguments);
        },
        getText: function(d) {
          return i18next.t(d.key, {ns: "area"});
        }
      },
      width: 900
    };

  uiHandler = function(event) {
    if (event.target.id === "groups"){
      selected = document.getElementById("groups").value;
      var labelsToClear = document.getElementsByClassName("area-label");
      var i;
      for (i = 0; i < labelsToClear.length; i++) {
          labelsToClear[i].innerHTML='';
      }
      if (!data[selected]) {
        d3.json("data/" + selected + "_numMovements.json", function(err, filedata) {
          data[selected] = filedata;
          showData();
         });
     } else {
       showData();
     }
    }
  }

  function showData() {
    //change area chart title to match selected province
    d3.select(".dashboard h4").text(i18next.t(selected, {ns: "provinces"}));

    areaChart(chart, settings, data[selected]);
  }

  function showAirport() {
    //clear area labels
    var labelsToClear = document.getElementsByClassName("area-label");
    var i;
    for (i = 0; i < labelsToClear.length; i++) {
        labelsToClear[i].innerHTML='';
    }

    //Load airport data containing remaining provincial totals
    d3.json("data/combo_ON_ONYOW_numMovements.json", function(err, filedata) {
       selected = "ON_YOW";
       data[selected] = filedata;

      showData();
      
    });

    //show airport rank
    selectedAirport = "YOW";
    showRank(selectedAirport);
  }

  function showRank(selected) {
    console.log("selected showRank: ", selected)
    //change area chart title to match selected province
    d3.select(".rank h4").text("Airport rank for " + i18next.t(selected, {ns: "airports"}));


    //Adapted from: https://www.d3-graph-gallery.com/graph/correlogram_basic.html
    // Graph dimension
    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = 1100 - margin.left - margin.right,
        height = 430 - margin.top - margin.bottom;
    console.log("height: ", height)

    var pad = 20, left_pad = 100;

    // Create the svg area
    var svg = d3.select("#my_dataviz")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var corrdata = [];
    d3.csv("data/data_correlogram_test.csv", function(error, rows) {
    //d3.csv("data/data_correlogram.csv", function(error, rows) {
      console.log("rows: ", rows)

      rows.forEach(function(d) {
      var x = d[""];
      delete d[""];
      for (prop in d) {
        var y = prop,
          value = d[prop];
        corrdata.push({//HUOM
          x: y, 
          y: x,
          value: +value
        });
      }
    });

    // // List of all variables and number of them
    var domain = d3.set(corrdata.map(function(d) { return d.x })).values()
    var num = Math.sqrt(corrdata.length)

    // Create a color scale
    var color = d3.scaleLinear()
      .domain([1, 5, 10])
      .range(["#B22222", "#fff", "#000080"]);

    // Create a size scale for bubbles on top right. Watch out: must be a rootscale!
    var size = d3.scaleSqrt()
      .domain([0, 1])
      .range([0, 5]);
    console.log("size(5): ", size(5))
    console.log("size(8): ", size(8))
    console.log("size(15): ", size(15))

    // X scale
    // var x = d3.scalePoint()
    //   .range([0, width])
    //   .domain(domain)
    var x = d3.scaleLinear()
        .domain([1997,2017])
        .range([0, width/1.1]);

    // Y scale
    // var y = d3.scalePoint()
      // .range([0, height])
      // .domain(domain);
    var  y = d3.scaleLinear()
          .domain([1, 20])
          .range([0, height/1.2]);

    // Create one 'g' element for each cell of the correlogram
    var cor = svg.attr("class", "rankplot")
        .selectAll(".cor")
      .data(corrdata)
      .enter()
      .append("g")
        .attr("class", "cor")
        .attr("transform", function(d,i) {
          console.log("i: ", i)
          console.log("d: ", d)
          console.log("x(d.x): ", x(d.x))
          console.log("d.value: ", d.value)
          console.log("y(d.value): ", y(d.value))
          var ycoord;
          if (d.y === "tot") ycoord = 40;
          else if (d.y === "it") ycoord = 40 + 80;
          else if (d.y === "loc") ycoord = 40 + 2*80;
          // return "translate(" + x(d.x) + "," + y(d.y) + ")";
          // return "translate(" + x(d.x) + "," + y(d.value) + ")";
          return "translate(" + x(d.x) + "," + ycoord + ")";
          });

    // add circles
    cor
      .append("circle")
          .attr("class", function(d) {
            console.log("class d: ", d.y)
            return "rank_" + d.y;
          })
          .attr("r", function(d){
            return size(Math.abs(d.value));
          })
          .style("fill", function(d){

              // return color(d.value);
              //return "red";
            })
    //     .style("opacity", 0.8)

    }) //end d3.csv
  

  }




i18n.load(["src/i18n"], function() {
  d3.queue()
    // .defer(d3.json, "data/worldpop.json")
    .defer(d3.json, "data/CANADA_numMovements.json")
    .await(function(error, data) {
      areaChart(chart, settings, data);
    });
});

$(document).on("input change", function(event) {
  uiHandler(event);
});