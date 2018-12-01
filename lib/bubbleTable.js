(function(extend) {
var defaults = {
  margin: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 90
  },
  aspectRatio: 990/260,
  // x: {
  
  // },
  // y: {
   
   
  //   }
  // },
  width: 990
};

this.bubbleTable = function(svg, settings, data) {
  var mergedSettings = extend(true, {}, defaults, settings),
    outerWidth = mergedSettings.width,
    outerHeight = Math.ceil(outerWidth / mergedSettings.aspectRatio),
    innerHeight = mergedSettings.innerHeight = outerHeight - mergedSettings.margin.top - mergedSettings.margin.bottom,
    innerWidth = mergedSettings.innerWidth = outerWidth - mergedSettings.margin.left - mergedSettings.margin.right,
    chartInner = svg.select("g.margin-offset"),
    dataLayer = chartInner.select(".data"),





    transition = d3.transition()
      .duration(1000),

    draw = function() {
      var sett = this.settings,

        filteredData = (sett.filterData && typeof sett.filterData === "function") ?
          sett.filterData.call(sett, data) : data,

        keys = sett.z.getKeys.call(sett, filteredData),



        labelX = innerWidth - 6,

        getXScale = function() {
          return d3.scaleTime();
        },

        labelY = function(d) { return y((d[d.length - 1][0] + d[d.length - 1][1]) / 2); },

        // classFn = function(d,i){
        //   var cl = "area area" + (i + 1);

        //   if (sett.z && sett.z.getClass && typeof sett.z.getClass === "function") {
        //     cl += " " + sett.z.getClass.call(sett, d);
        //   }

        //   return cl;
        // },

        cor, labels;

      // x = rtnObj.x = getXScale().range([0, innerWidth]);
       x = rtnObj.x = d3.scaleLinear()
                        .range([0, 990/1.1]); //.range([0, width/1.1]);


      // y = rtnObj.y = d3.scaleLinear().range([innerHeight, 0]);
       y = rtnObj.y = d3.scaleLinear()
                        .range([0, 390/1.2]); //.range([0, height/1.2]);


      x.domain(d3.extent(filteredData, sett.x.getValue.bind(sett)));
      y.domain([
        1, 20
        //d3.max(filteredData, sett.y.getTotal.bind(sett))
      ]);

      if (dataLayer.empty()) {
        dataLayer = chartInner.append("g")
          .attr("class", "data");
      }

      // cor = dataLayer.selectAll(".area")
      //   .data(stackData, sett.z.getId.bind(sett));

      // cor
      //   .enter()
      //   .append("path")
      //     .attr("class", classFn)
      //     .attr("d", area);

      // cor
      //   .transition(transition)
      //   .attr("d", area);

      // cor
      //   .exit()
      //     .remove();

      // labels = dataLayer.selectAll(".label");
      // labels
      //   .data(stackData)
      //   .enter()
      //   .append("text")
      //     .text(function (d) {
      //       return sett.z.getText.bind(sett)(d);
      //     })
      //     .attr("aria-hidden", "true")
      //     .attr("class", "area-label")
      //     .attr("fill", "#000")
      //     .attr("x", labelX)
      //     .attr("y", labelY)
      //     .attr("dy", "1em")
      //     .attr("text-anchor", "end");

      // labels
      //   .transition(transition)
      //   .attr("y", labelY);

      // labels
      //   .exit()
      //     .remove();

      // if (xAxisObj.empty()) {
      //   xAxisObj = chartInner.append("g")
      //   .attr("class", "x axis")
      //   .attr("aria-hidden", "true")
      //   .attr("transform", "translate(0," + innerHeight + ")");

      //   xAxisObj
      //     .append("text")
      //       .attr("class", "chart-label")
      //       .attr("fill", "#000")
      //       .attr("x", innerWidth)
      //       .attr("dy", "-0.5em")
      //       .attr("text-anchor", "end")
      //       .text(settings.x.label);
      // } else {
      //   xAxisObj.select("text").text(settings.x.label);
      // }
      // xAxisObj.call(
      //   d3.axisBottom(x)
      //     .ticks(mergedSettings.x.ticks)
      //     .tickFormat(sett.x.getTickText ? sett.x.getTickText.bind(sett) : null)
      // );

    },
    clear = function() {
      dataLayer.remove();
    },

    x, y, rtnObj, process;

  rtnObj = {
    settings: mergedSettings,
    clear: clear,
    svg: svg
  };

  svg
    .attr("viewBox", "0 0 " + outerWidth + " " + outerHeight)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("role", "img")
    .attr("aria-label", mergedSettings.altText);

  if (chartInner.empty()) {
    chartInner = svg.append("g")
      .attr("class", "margin-offset")
      .attr("transform", "translate(" + mergedSettings.margin.left + "," + mergedSettings.margin.top + ")");
  }

  process = function() {
    draw.apply(rtnObj);
    d3.stcExt.addIEShim(svg, outerHeight, outerWidth);
    if (mergedSettings.datatable === false) return;
    //drawTable.apply(rtnObj);
  };
  if (data === undefined) {
    d3.json(mergedSettings.url, function(error, xhr) {
      data = xhr;
      //process();
    });
  } else {
    //process();
  }

  return rtnObj;
};

})(jQuery.extend, jQuery);
