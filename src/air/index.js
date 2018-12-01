import settings from "./settings.js";
import settings_bubbleTable from "./settings_bubbleTable.js";

let map = d3.select(".dashboard .map")
  .append("svg");
let chart = d3.select(".data")
    .append("svg")
      .attr("id", "svg_areaChart");

//for currently-working bubble table of airport ranks
let rankChart = d3.select(".data")
    .append("svg")
      .attr("id", "svg_rankChart");

//!!!!!!! WIP !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//for bubble table of airport ranks made by resuable component
let testChart = d3.select(".data")
    .append("svg")
      .attr("id", "svg_testChart");
//!!!!!!! WIP !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

let data = {};
let selected = "CANADA"; //default region for areaChart

let selected_airpt,
    selected_prov;
let rank_data = {};

/* canada map */
let heading = d3.select(".dashboard h4"),
canada = window.getCanadaMap(map).on("loaded", function() { 
  let mapObj = this;
  d3.json("geojson/testairport.geojson", function(error, airports) {
    if (error) throw error;

    var airportGroup = map.append("g");
    var path = d3.geoPath().projection(mapObj.settings.projection)
                .pointRadius(2);

    let airportPoints = airportGroup.selectAll("path")
        .data(airports.features)
        .enter().append('path')
        .attr('d', path)
        .attr("id", function (d, i) {
          return "airport" + d.id;
        })
        .attr("class", "airport")
        //.attr("r", 50)
        .style("fill", "#7E0C33")
         .on("mouseover", function (d) {
            console.log("d: ", d)
            selected_airpt = d.id;
            selected_prov = d.province;
            //change area chart title to match selected province
            d3.select(".dashboard h4")
              .text(`${selected_prov} and contribution from airport ${selected_airpt}`);
            showAirport(selected_prov, selected_airpt);
        });
  });
});

function uiHandler(event) {
  if (event.target.id === "groups"){
    selected = document.getElementById("groups").value; //clear any previous airport title
    d3.select(".dashboard h4").text("")
    showAreaData();
  }
}

function showAreaData() {
  let showChart = () => {
    areaChart(chart, settings, data[selected]);
  }
  //change area chart title to match selected province  
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

function showAirport(selected_prov, selected_airpt) {
  let fname = `data/air/combo_${selected_prov}_${selected_airpt}_numMovements.json`;

  //Load airport data containing remaining provincial totals
  d3.json(fname, function(err, filedata) {
     selected = `${selected_prov}_${selected_airpt}`; //"ON_YYZ";
     data[selected] = filedata;
    showAreaData();
  });

  //show airport rank
  showRank(selected_airpt);

  //****WHEN bubbleTable.js IS DEVELOPED****
  //!!!!!!! WIP !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  if (!rank_data[selected_airpt]) {
    return d3.json(`data/air/rankdata_${selected_airpt}.json`, (aptData) => {
      rank_data[selected_airpt] = aptData;
      console.log("call bubbleTable for: ", selected_airpt)
      console.log("rank_data: ", rank_data)
      bubbleTable(testChart, settings_bubbleTable, rank_data[selected_airpt]);
    });
  }
  //bubbleTable(testChart, settings_bubbleTable, rank_data[selected_airpt]);
  //!!!!!!! WIP !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
}

function showRank(selected_airpt) {
  //change area chart title to match selected province
  d3.select(".rank h4").text("Airport rank for " + i18next.t(selected_airpt, {ns: "airports"}));

  //Adapted from: https://www.d3-graph-gallery.com/graph/correlogram_basic.html
  // Graph dimension
  var margin = {top: 20, right: 20, bottom: 20, left: 90},
      width = 1100 - margin.left - margin.right,
      height = 430 - margin.top - margin.bottom;

  // Create the svg area
  d3.select("#rankChart").select("svg").remove(); //clear for next display
  var svg = d3.select("#rankChart")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var corrdata = [];
  d3.csv(`data/air/rankdata_${selected_airpt}.csv`, function(error, rows) {
    let prop;
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

    console.log("corrdata: ", corrdata)

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
        .attr("transform", function(d) {
          var ycoord;
          if (d.y === "total") ycoord = 40;
          else if (d.y === "itinerant") ycoord = 40 + 80;
          else if (d.y === "local") ycoord = 40 + 2*80;
          // return "translate(" + x(d.x) + "," + y(d.y) + ")";
          // return "translate(" + x(d.x) + "," + y(d.value) + ")";
          return "translate(" + x(d.x) + "," + ycoord + ")";
        });

    // add circles
    cor
      .append("circle")
        .attr("class", function(d) {
          return "rank_" + d.y;
        })
        .attr("r", function(d){
          return size(Math.abs(d.value));
        })
        .style("fill", function(d){
          // return color(d.value);
        });

    //label columns by year
    cor.append("text")
      .attr("dx", function(d){
        return -18;
      })
      .attr("dy", function(d){
        return -30;
      })
      .attr("class", "rank_yr")
      .text(function(d,i){
        if (d.y === "total") return d.x;
      });

    //label rows by movt type
    cor.append("text")
      .attr("dx", function(d){
        return -85;
      })
      .attr("dy", function(d){
        return 4;
      })
      .attr("class", "rank_type")
      .text(function(d,i){
        if (d.x === "1997") return i18next.t(d.y, {ns: "area"});
      });

    //label circle by value
    cor.append("text")
      .attr("dx", function(d){
        if (d.y === "local") return -9;
        else return -5;
      })
      .attr("dy", function(d){
        return 4;
      })
      .attr("class", "rank_value")
      .text(function(d,i){
        return d.value;
      });

  }) //end d3.csv


}

i18n.load(["src/i18n"], showAreaData);
$(document).on("change", uiHandler);