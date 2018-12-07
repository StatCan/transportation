function showRadar() {
  // TEMP
  const region_dict = {
    0: "Atl",
    1: "QC",
    2: "ON",
    3: "MB",
    4: "SK",
    5: "AB",
    6: "BC",
    7: "US",
    8: "MX",
    9: "US_MX"
  }
  //

    //Adapted from http://bl.ocks.org/jeffthink/1630683
    var series,
      hours,
      minVal,
      maxVal,
      w = 330,
      h = 330,
      vizPadding = {
          top: 0,
          right: 15,
          bottom: 0,
          left: 15
      },
      radius,
      radiusLength,
      ruleColor = "#CCC",
      numCommodities = 10;

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

        // var numCommodities = 64;
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
        var viz = d3.select("#radarChart")
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
          .style("font-size", "12px")
          .style("text-anchor", "left");

      circleAxes.append("svg:circle")
          .attr("r", function (d, i) {
              return radius(d);
          })
          .attr("class", "circle")
          .style("stroke", ruleColor)
          .style("fill", "none")
          .style("text-anchor", "left");

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
          //.text(String)
          .text(function(d, i) {
            return region_dict[i];
          })
          .attr("text-anchor", "middle")
          .style("fill", "#3d3d3d")
          .style("font-size", "12px")
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
                return "#38808a";
              }
              else {
                return "#cc0047";
              }
          })
          .style('stroke', function (d, i) {
              if(i === 0){
                return "#38808a";
              }
              else {
                return "#cc0047";
              }
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
