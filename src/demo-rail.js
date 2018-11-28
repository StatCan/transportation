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
          return i18next.t(d.key, {ns: "regions"});
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
        d3.json("data/rail_meat_origATR_ON_BC_dest" + selected + ".json", function(err, filedata) {
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

  function showRadar() {
    //Adapted from http://bl.ocks.org/jeffthink/1630683
    var series, 
      hours,
      minVal,
      maxVal,
      w = 700,
      h = 700,
      vizPadding = {
          top: 10,
          right: 50,
          bottom: 15,
          left: 50
      },
      radius,
      radiusLength,
      ruleColor = "#CCC";

      loadData();
      buildBase();
      setScales();
      addAxes();
      draw();

      function loadData() {
        var randomFromTo = function randomFromTo(from, to){
           return Math.floor(Math.random() * (to - from + 1) + from);
        };

        series = [
          [],
          []
        ];

        hours = [];

        numCommodities = 64
        for (i = 0; i < numCommodities; i += 1) {
            series[0][i] = randomFromTo(0,20);
            series[1][i] = randomFromTo(5,15);
            hours[i] = i; //in case we want to do different formatting
        }

        mergedArr = series[0].concat(series[1]);

        minVal = d3.min(mergedArr);
        maxVal = d3.max(mergedArr);
        //give 25% of range as buffer to top
        maxVal = maxVal + ((maxVal - minVal) * 0.25);
        minVal = 0;

        //to complete the radial lines
        for (i = 0; i < series.length; i += 1) {
            series[i].push(series[i][0]);
        }      
    }

    function buildBase() {
        var viz = d3.select("#commgrid")
            .append('svg:svg')
            .attr('width', w)
            .attr('height', h)
            .attr('class', 'vizSvg');

        viz.append("svg:rect")
            .attr('id', 'axis-separator')
            .attr('x', 0)
            .attr('y', 0)
            .attr('height', 0)
            .attr('width', 0)
            .attr('height', 0);
        
        vizBody = viz.append("svg:g")
            .attr('id', 'body');
    }

    function setScales () {
      var heightCircleConstraint,
          widthCircleConstraint,
          circleConstraint,
          centerXPos,
          centerYPos;

      //need a circle so find constraining dimension
      heightCircleConstraint = h - vizPadding.top - vizPadding.bottom;
      widthCircleConstraint = w - vizPadding.left - vizPadding.right;
      circleConstraint = d3.min([
          heightCircleConstraint, widthCircleConstraint]);

      radius = d3.scaleLinear().domain([minVal, maxVal])
          .range([0, (circleConstraint / 2)]);
      radiusLength = radius(maxVal);

      //attach everything to the group that is centered around middle
      centerXPos = widthCircleConstraint / 2 + vizPadding.left;
      centerYPos = heightCircleConstraint / 2 + vizPadding.top;

      vizBody.attr("transform",
          "translate(" + centerXPos + ", " + centerYPos + ")");
    }

    function addAxes() {
      var radialTicks = radius.ticks(5),
          i,
          circleAxes,
          lineAxes;

      vizBody.selectAll('.circle-ticks').remove();
      vizBody.selectAll('.line-ticks').remove();

      circleAxes = vizBody.selectAll('.circle-ticks')
          .data(radialTicks)
          .enter().append('svg:g')
          .attr("class", "circle-ticks")
          .style("fill", "#3d3d3d")
          .style("font-size", "14px");

      circleAxes.append("svg:circle")
          .attr("r", function (d, i) {
              return radius(d);
          })
          .attr("class", "circle")
          .style("stroke", ruleColor)
          .style("fill", "none");

      circleAxes.append("svg:text")
          .attr("text-anchor", "middle")
          .attr("dy", function (d) {
              return -1 * radius(d);
          })
          .text(String);

      lineAxes = vizBody.selectAll('.line-ticks')
          .data(hours)
          .enter().append('svg:g')
          .attr("transform", function (d, i) {
              return "rotate(" + ((i / hours.length * 360) - 90) +
                  ")translate(" + radius(maxVal) + ")";
          })
          .attr("class", "line-ticks");

      lineAxes.append('svg:line')
          .attr("x2", -1 * radius(maxVal))
          .style("stroke", ruleColor)
          .style("fill", "none");

      lineAxes.append('svg:text')
          .text(String)
          .attr("text-anchor", "middle")
          .style("fill", "#3d3d3d")
          .style("font-size", "14px")
          .attr("transform", function (d, i) {
              return (i / hours.length * 360) < 180 ? null : "rotate(180)";
          });
    }

    function draw  () {
      var groups,
          lines,
          linesToUpdate;

      highlightedDotSize = 4;

      groups = vizBody.selectAll('.series')
          .data(series);
      groups.enter().append("svg:g")
          .attr('class', 'series')
          .style('fill', function (d, i) {
              if(i === 0){
                return "#96A8B2";
              } 
              // else {
              //   return "#024571";
              // }
          })
          .style('stroke', function (d, i) {
              if(i === 0){
                return "#96A8B2";
              } 
              // else {
              //   return "#024571";
              // }
          });
      groups.exit().remove();

      // lines = groups.append('svg:path')
      // lines = groups.enter().append('svg:path')
      lines = d3.selectAll(".series").append("svg:path")
          .attr("class", "line")
          // .attr("d", d3.svg.line.radial()
          .attr("d", d3.radialLine()
              .radius(function (d) {
                  return 0;
              })
              .angle(function (d, i) {
                  if (i === numCommodities) {
                      i = 0;
                  } //close the line
                  return (i / numCommodities) * 2 * Math.PI;
              }))
          .style("stroke-width", 3)
          .style("fill", "none");

      // lines.attr("d", d3.svg.line.radial()
      lines.attr("d", d3.radialLine()
          .radius(function (d) {
              return radius(d);
          })
          .angle(function (d, i) {
              if (i === numCommodities) {
                  i = 0;
              } //close the line
              return (i / numCommodities) * 2 * Math.PI;
          }));
    }



  }

  function showComm() {
     //change area chart title to match selected province
    d3.select(".commTable h4").text("Annual tonnages for all commodities, sorted by volume. Origin " + i18next.t("ATR", {ns: "regions"})
              + ", Destination " + i18next.t("QC", {ns: "regions"}));

    //Adapted from: https://www.d3-graph-gallery.com/graph/correlogram_basic.html
    // Graph dimension
    var margin = {top: 20, right: 20, bottom: 20, left: 110},
        width = 1200 - margin.left - margin.right,
        height = 1500 - margin.top - margin.bottom;

    // Create the svg area
    var svg = d3.select("#commgrid")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //var rawCommData = [];
    d3.csv("data/test_commdata_origATR_destQC_SUBSET.csv", function(error, rows) {
      var rawCommData = [];
      rows.forEach(function(d) {
        var x = d[""];
        delete d[""];
        for (prop in d) {
          //console.log("d: ", d)
          var y = prop,
            value = d[prop];
          rawCommData.push({//HUOM
            x: y, 
            y: x,
            value: +value
          });
        }
      });

      var years = rawCommData.filter(item => item.y === 'wheat').map(item => item.x);
      rawCommData.sort((a,b) => (a.value > b.value) ? -1 : ((b.value > a.value) ? 1 : 0));

    
      //Commodities in descending order of yr 2016 value
      rankedCommNames = rawCommData.filter(item => item.x === '2016').map(item => item.y);
      console.log("rankedCommNames: ", rankedCommNames)

      var rankedCommData = [];
      for (idx = 0; idx < rankedCommNames.length; idx++) {
        for (jdx = 0; jdx < years.length; jdx++) {
          var thisVal = rawCommData.filter(item => item.x === years[jdx] && 
                        item.y === rankedCommNames[idx]).map(item => item.value)[0];
          rankedCommData.push( {"x": years[jdx], "y": rankedCommNames[idx], "value": thisVal} );
        }

      }
    
      // List of all variables and number of them
      var domain = d3.set(rankedCommData.map(function(d) { return d.x })).values()
      var num = Math.sqrt(rankedCommData.length)

      // Create a color scale
      // var color = d3.scaleLinear()
      //   .domain([1, 5, 10])
      //   .range(["#B22222", "#fff", "#000080"]);

      // Create a size scale for bubbles on top right. Watch out: must be a rootscale!
      var size = d3.scaleSqrt()
        .domain([0, 1])
        .range([0, .1]);

      // X scale
      var x = d3.scaleLinear()
          .domain([2001,2016])
          .range([0, width/1.1]);

      // Y scale
      var  y = d3.scaleLinear()
            .domain([1, 5000])
            .range([0, height/1.5]);

      // Create one 'g' element for each cell of the correlogram
      var cor = svg.attr("class", "rankplot")
          .selectAll(".cor")
        .data(rankedCommData)
        .enter()
        .append("g")
          .attr("class", "cor")
          .attr("transform", function(d, i) {
            if (i===0) {
              comm0 = d.y;
              idx = 0;
            }
           

            var ycoord, y0, delta;
            y0 = 40;
            delta = 35;
            if (d.y === comm0) {
              
            } else {
              comm0 = d.y;
              if (i%years.length === 0) idx++;  //only increment idx when i is divisible by the number of years
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
            .attr("r", function(d){
              return size(Math.abs(d.value));
              // return size(Math.log( Math.abs(d.value)) );
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
          .attr("class", "comm_yr")
          .text(function(d,i){
            if (d.y === rankedCommNames[0]) return d.x;
          });

      //label rows by movt type
      cor.append("text")
          .attr("dx", function(d){
            return -105;
          })
          .attr("dy", function(d){
            return 4;
          })
          .attr("class", "comm_type")
          .text(function(d,i){
            if (d.x === "2001") return d.y;
          });

      //label circle by value
      cor.append("text")
          .attr("dx", function(d){
            return -2;
          })
          .attr("dy", function(d){
            return 4;
          })
          .attr("class", "comm_value")
          .text(function(d,i){
            if (d.value === 0) return d.value;
          });

    }) //end d3.csv
  }


i18n.load(["src/i18n"], function() {
  d3.queue()
    // .defer(d3.json, "data/worldpop.json")
    .defer(d3.json, "data/rail_meat_origATR_ON_BC_destQC.json")
    .await(function(error, data) {
      areaChart(chart, settings, data);

      showComm(); //display sorted commodity bubble table
          
      //showRadar();

      
    });
});

$(document).on("input change", function(event) {
  uiHandler(event);
});