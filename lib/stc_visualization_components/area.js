(function(extend) {
  const defaults = {
    margin: {
      top: 15,
      right: 10,
      bottom: 30,
      left: 50
    },
    aspectRatio: 16 / 9,
    x: {
      // ticks: 5
    },
    y: {
      // ticks: 10,
      totalProperty: "total",
      getTotal: function(d, index, data) {
        const sett = this;
        let total;
        let keys;
        if (!d[sett.y.totalProperty]) {
          keys = sett.z.getKeys.call(sett, data);
          total = 0;
          for (let k = 0; k < keys.length; k++) {
            total += sett.y.getValue.call(sett, d, keys[k], data);
          }
          d[sett.y.totalProperty] = total;
        }
        return d[sett.y.totalProperty];
      }
    },
    width: 600
  };

this.areaChart = function(svg, settings, data) {
    const mergedSettings = extend(true, {}, defaults, settings);
    const outerWidth = mergedSettings.width;
    const outerHeight = Math.ceil(outerWidth / mergedSettings.aspectRatio);
    const innerHeight = mergedSettings.innerHeight = outerHeight - mergedSettings.margin.top - mergedSettings.margin.bottom;
    const innerWidth = mergedSettings.innerWidth = outerWidth - mergedSettings.margin.left - mergedSettings.margin.right;
    let chartInner = svg.select("g.margin-offset");
    let dataLayer = chartInner.select(".data");

    const area = d3.area()
        .x(function(d) {
          return x(mergedSettings.x.getValue(d.data));
        })
        .y0(function(d) {
          return y(d[0]);
        })
        .y1(function(d) {
          return y(d[1]);
        });
    const stack = d3.stack();
    const transition = d3.transition()
        // .duration(1000);
        .duration(500);

    const draw = function() {
      const sett = this.settings;
      const filteredData = (sett.filterData && typeof sett.filterData === "function") ?
          sett.filterData.call(sett, data) : data;
      const keys = sett.z.getKeys.call(sett, filteredData);
      const stackData = stack
          .keys(keys)
          .value(sett.y.getValue.bind(sett))(filteredData);
      let xAxisObj = chartInner.select(".x.axis");
      let yAxisObj = chartInner.select(".y.axis");
      const labelX = innerWidth - 6;
      const getXScale = function() {
        return d3.scaleTime();
      };
      const labelY = function(d) {
        return y((d[d.length - 1][0] + d[d.length - 1][1]) / 2);
      };
      const classFn = function(d, i) {
        let cl = "area area" + (i + 1);
        if (sett.z && sett.z.getClass && typeof sett.z.getClass === "function") {
          cl += " " + sett.z.getClass.call(sett, d);
        }
        return cl;
      };

      x = rtnObj.x = getXScale().range([0, innerWidth]);
      y = rtnObj.y = d3.scaleLinear().range([innerHeight, 0]);

      x.domain(d3.extent(filteredData, sett.x.getValue.bind(sett)));
      y.domain([
        0,
        d3.max(filteredData, sett.y.getTotal.bind(sett))
      ]);

      if (dataLayer.empty()) {
        dataLayer = chartInner.append("g")
            .attr("class", "data");
      }

      const areas = dataLayer.selectAll(".area")
          .data(stackData, sett.z.getId.bind(sett));

      areas
          .enter()
          .append("path")
          .attr("class", classFn)
          .attr("d", area);

      // CN added
      if (mergedSettings.transition === false) {
        areas
            // .transition(transition)
            .attr("d", area);
      } else {
        areas
            .transition(transition)
            .attr("d", area);
      }
      // areas
      //     .transition(transition)
      //     .attr("d", area);

      areas
          .exit()
          .remove();

      const labels = dataLayer.selectAll(".area-label")
          .data(stackData, sett.z.getId.bind(sett));
      labels
          .enter()
          .append("text")
          .text(sett.z.getText.bind(sett))
          .attr("aria-hidden", "true")
          .attr("class", "area-label")
          .attr("fill", "#000")
          .attr("x", labelX)
          .attr("y", labelY)
          .attr("dy", "1em")
          .attr("text-anchor", "end");

      // CN edits
      if (mergedSettings.transition === false) {
        labels
            .attr("y", labelY);
      } else {
        labels
            .transition(transition)
            .attr("y", labelY);
      }
      // labels
      //     // .transition(transition)
      //     .attr("y", labelY);

      labels
          .exit()
          .remove();

      // CN add chart title
      if (!chartInner.empty()) {
        chartInner
            .append("text")
            .attr("x", (innerWidth / 2))
            .attr("y", 0 - (mergedSettings.margin.top / 2))
            .attr("text-anchor", "middle")
            .attr("class", "areaChartTitle");
      }
      // end CN

      if (xAxisObj.empty()) {
        xAxisObj = chartInner.append("g")
            .attr("class", "x axis")
            .attr("aria-hidden", "true")
            .attr("transform", "translate(0," + innerHeight + ")");

        xAxisObj
            .append("text")
            .attr("class", "chart-label")
            .attr("fill", "#000")
            // .attr("x", innerWidth)
            .attr("x", innerWidth / 2) // CN added
            // .attr("dy", "-0.5em")
            .attr("dy", "3.5em") // CN added
            .attr("text-anchor", "end")
            .text(settings.x.label);
      } else {
        xAxisObj.select("text").text(settings.x.label);
      }
      xAxisObj.call(
          d3.axisBottom(x)
              .ticks(mergedSettings.x.ticks)
              .tickFormat(sett.x.getTickText ? sett.x.getTickText.bind(sett) : null)
      );

      if (yAxisObj.empty()) {
        yAxisObj = chartInner.append("g")
            .attr("class", "y axis")
            .attr("aria-hidden", "true");

        yAxisObj
            .append("text")
            .attr("class", "chart-label")
            .attr("fill", "#000")
            .attr("y", "0")
            .attr("dy", "-0.5em")
            .attr("text-anchor", "start")
            .text(settings.y.label);
      } else {
        yAxisObj.select("text").text(settings.y.label);
      }
      yAxisObj.call(
          d3.axisLeft(y)
              .ticks(mergedSettings.y.ticks)
              .tickFormat(sett.y.getTickText ? sett.y.getTickText.bind(sett) : null)
      );
    };

    const drawTable = function() {
      const sett = this.settings;
      const summaryId = "chrt-dt-tbl";
      const filteredData = (sett.filterData && typeof sett.filterData === "function") ?
          sett.filterData(data, "table") : data;
      const parent = svg.select(
          svg.classed("svg-shimmed") ? function() {
            return this.parentNode.parentNode;
          } : function() {
            return this.parentNode;
          }
      );
      let details = parent
          .select("details");
      const keys = sett.z.getKeys.call(sett, filteredData);
      let table;
      let header;
      let body;
      let dataRows;
      let dataRow;
      let k;
      let wb;

      if (details.empty()) {
        details = parent
            .append("details")
            .attr("class", "chart-data-table");

        details.append("summary")
            .attr("id", summaryId)
            .text(sett.datatable.title);

        table = details
            .append("table")
            .attr("class", "table")
            .attr("aria-labelledby", summaryId);
        header = table.append("thead").append("tr");
        body = table.append("tbody");

        header.append("th")
            .text(sett.x.label);

        for (k = 0; k < keys.length; k++) {
          header.append("th")
              .text(sett.z.getText.bind(sett)({
                key: keys[k]
              }));
        }

        dataRows = body.selectAll("tr")
            .data(filteredData);

        dataRow = dataRows
            .enter()
            .append("tr");

        dataRow
            .append("th")
            .text((sett.x.getText || sett.x.getValue).bind(sett));

        for (k = 0; k < keys.length; k++) {
          dataRow
              .append("td")
              .text(function(d) {
                if (sett.y.getText) {
                  return sett.y.getText.call(sett, d, keys[k]);
                }
                return sett.y.getValue.call(sett, d, keys[k]);
              });
        }

        if ($ || wb) {
          $(".chart-data-table summary").trigger("wb-init.wb-details");
        }
      }
    };

    const clear = function() {
      dataLayer.remove();
    };
    let x;
    let y;

    const rtnObj = {
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

    const process = function() {
      draw.apply(rtnObj);
      d3.stcExt.addIEShim(svg, outerHeight, outerWidth);
      if (mergedSettings.datatable === false) return;
      drawTable.apply(rtnObj);
    };

    if (data === undefined) {
      d3.json(mergedSettings.url, function(error, xhr) {
        data = xhr;
        process();
      });
    } else {
      process();
    }

    return rtnObj;
  };
})(jQuery.extend, jQuery);
