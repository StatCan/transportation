(function(extend) {
var defaults = {
  margin: {
    top: 18,
    right: 10,
    bottom: 30,
    left: 50
  },
  x: {
    getDomain: function(data) {
      var sett = this,
        keys = [],
        i, d, x;

      for (i = 0; i < data.length; i++) {
        d = data[i];
        x = sett.x.getValue.call(sett, d);

        if (keys.indexOf(x) === -1) {
          keys.push(x);
        }
      }

      return keys;
    }
  },
  y: {
    getDomain: function(data) {
      var min = d3.min(data, this.y.getValue.bind(this)),
        max = d3.max(data, this.y.getValue.bind(this));

      if (min > 0) min = 0;
      if (max < 0) max = 0;

      if (this.showValues) {
        if (min < 0 ) min -= (max - min) * .09;
        if (max > 0 ) max += (max - min) * .06;
      }

      return [
        min,
        max
      ];
    }
  },
  z: {
    getDomain: function(data) {
      var sett = this,
        keys = [],
        i, d, x;

      for (i = 0; i < data.length; i++) {
        d = data[i];
        x = sett.z.getId.call(sett, d);

        if (keys.indexOf(x) === -1) {
          keys.push(x);
        }
      }

      return keys;
    }
  },
  groupPadding: 0.2,
  barPadding: 0.1,
  aspectRatio: 16 / 9,
  width: 600,
  barTableID: "barTable"
};

this.barChart = function(svg, settings, data) {
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
        flatData = [].concat.apply([], filteredData.map(function(d) {
          return sett.z.getDataPoints.call(sett, d);
        })),
        xAxisObj = chartInner.select(".x.axis"),
        yAxisObj = chartInner.select(".y.axis"),
        showValue = sett.showValues,
        valuesX = function() {
          return xFn.apply(this, arguments) + x1.bandwidth() / 2;
        },
        grpClassFn = function(d,i){
          var cl = "bar-group bar-group" + (i + 1);

          if (sett.x && sett.x.getClass && typeof sett.x.getClass === "function") {
            cl += " " + sett.x.getClass.call(sett, d);
          }

          return cl;
        },
        grpTransform = function() {
          return "translate(" + x0(sett.x.getValue.apply(sett, arguments)) + ",0)";
        },
        barClassFn = function(d,i){
          var cl = "bar bar" + (i + 1);

          if (sett.x && sett.z.getClass && typeof sett.z.getClass === "function") {
            cl += " " + sett.z.getClass.call(sett, d);
          }

          return cl;
        },
        barsFn = function() {
          var group = d3.select(this),
            xVal = sett.x.getValue.call(sett, group.data()[0]),
            getDatum = function(d) {
              return sett.z.getDataPoints.call(sett, d)
                  .filter(function(d) {
                    return sett.x.getValue.call(sett, d) === xVal;
                  })[0];
            },
            labelsOffset = function(d) {
              var datum = getDatum.call(sett, d),
                val = sett.y.getValue.call(sett, datum);
              switch(Math.sign(val)) {
              case 1:
                return "-0.5em";
              case -1:
                return "-1.5em";
              }
            },
            bars = group.selectAll(".bar")
              .data(filteredData, sett.z.getId.bind(sett)),
            values = group.selectAll(".value")
              .data(function() {
                if (typeof showValue === "function") {
                  return filteredData.filter(function(d) {
                    return showValue.call(sett, getDatum(d));
                  });
                } else if (showValue !== true) {
                  return[];
                }
                return filteredData;
              }, sett.z.getId.bind(sett));

          bars
            .enter()
            .append("rect")
              .attr("x", xFn)
              .attr("width", x1.bandwidth())
              .attr("y", y(0))
              .attr("height", 0)
              .attr("class", barClassFn.bind(sett))
              .on("mousemove", function(d){
                var div = d3.select("#railTooltip")
                  var datum = getDatum.call(sett, d);
                div
                    .style("opacity", .9);
                div.html(
                    "<b>" + i18next.t(this.id.substring(this.id.length -4 ,this.id.length), {ns: "rail"}) + " (" + i18next.t("units", {ns: "rail"}) + ")</b>"+ "<br><br>" +
                      "<table>" +
                        "<tr>" +
                          "<td><b>" + sett.formatNum(datum.value) + "</td>" +
                        "</tr>" +
                      "</table>"
                );

                div
                    .style("left", ((d3.event.pageX +10) + "px"))
                    .style("top", ((d3.event.pageY +10) + "px"));
              })
              .on("mouseout", function(){
                var div = d3.select("#railTooltip")
                div.style("opacity", 0);
              })
              .each(function(d) {
                var datum = getDatum.call(sett, d),
                  id = zIdFn(d) + "_" + xIdFn(datum),
                  yVal = yFn(datum),
                  hVal = heightFn(datum),
                  y0 = y(0);

                d3.select(this)
                  .attr("id", id)
                  .transition(transition)
                  .attr("y", yVal < y0 ? yVal: y0)
                  .attr("height", hVal);
              });


          bars
            .attr("x", xFn)
            .attr("width", x1.bandwidth())
            .attr("class", barClassFn.bind(sett))
            .each(function(d) {
              var datum = getDatum.call(sett, d),
                id = zIdFn(d) + "_" + xIdFn(datum),
                yVal = yFn(datum),
                hVal = heightFn(datum),
                y0 = y(0);

              d3.select(this)
                .attr("id", id)
                .transition(transition)
                .attr("y", yVal < y0 ? yVal: y0)
                .attr("height", hVal);
            });

          bars
            .exit()
              .remove();

          values
            .enter()
              .append("text")
                .attr("x", valuesX)
                .attr("aria-hidden", "true")
                .attr("dy", labelsOffset)
                .attr("text-anchor", "middle")
                .attr("class", "value")
                .each(function(d) {
                  var datum = getDatum.call(sett, d),
                    yVal = yFn(datum);

                  d3.select(this)
                    .attr("y", yVal)
                    .text(sett.y.getText.call(sett, datum));
                });

          values
            .attr("x", valuesX)
            .each(function(d) {
              var datum = getDatum.call(sett, d),
                yVal = yFn(datum);

              d3.select(this)
                .transition(transition)
                .attr("y", yVal)
                .attr("dy", labelsOffset)
                .text(sett.y.getText.call(sett, datum));
            });

          values
            .exit()
              .remove();
        },
        xFn = function() {
          return x1(sett.z.getId.apply(sett, arguments));
        },
        yFn = function(d) {
          return y(sett.y.getValue.call(sett, d));
        },
        xIdFn = sett.x.getId.bind(sett),
        zIdFn = sett.z.getId.bind(sett),
        heightFn = function() {
          var yVal = yFn.apply(this, arguments);

          if (yVal < y(0))
            return y(0) - yVal;
          return yVal - y(0);
        },
        xDomain = sett.x.getDomain.call(sett, flatData),
        barGroups;

      x0 = rtnObj.x0 = d3.scaleBand()
        .paddingInner(sett.groupPadding);

      x1 = rtnObj.x1 = d3.scaleBand()
        .padding(sett.barPadding);

      y = rtnObj.y = d3.scaleLinear()
        .rangeRound([innerHeight, 0]);


      x0.domain(xDomain).rangeRound([0, innerWidth]);
      x1.domain(sett.z.getDomain.call(sett, filteredData)).rangeRound([0, x0.bandwidth()]);
      y.domain(sett.y.getDomain.call(sett, flatData));

      if (dataLayer.empty()) {
        dataLayer = chartInner.append("g")
          .attr("class", "data");
      }

      barGroups = dataLayer.selectAll(".bar-group")
        .data(xDomain.map(function(x) {

          for(var i = 0; i < flatData.length; i++) {
            if (sett.x.getValue.call(sett, flatData[i]) === x)
              return flatData[i];
          }
        }).filter(function(d) {
          return d !== undefined;
        }), sett.x.getId.bind(sett));

      barGroups
        .enter()
        .append("g")
          .attr("class", grpClassFn)
          .attr("transform", grpTransform)
          .each(barsFn);

      barGroups
        .attr("class", grpClassFn)
        .transition(transition)
        .attr("transform", grpTransform)
        .each(barsFn);

      barGroups
        .exit()
          .remove();

      if (xAxisObj.empty()) {
        xAxisObj = chartInner.append("g")
        .attr("class", "x axis")
        .attr("aria-hidden", "true")
        .attr("transform", "translate(0," + innerHeight + ")");

        xAxisObj
          .append("text")
            .attr("class", "chart-label")
            .attr("fill", "#000")
            .attr("x", "23px")
            .attr("dy", "1.26em")
            .attr("text-anchor", "end")
            .text(sett.x.label);
      } else {
        xAxisObj.select("text").text(settings.x.label);
      }
      xAxisObj.call(
        d3.axisBottom(x0)
          .ticks(sett.x.ticks)
          .tickSizeOuter(sett.x.tickSizeOuter ? sett.x.tickSizeOuter : null)
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
            .text(sett.y.label);
      } else {
        yAxisObj.select("text").text(settings.y.label);
      }
      yAxisObj.call(
        d3.axisLeft(y)
          .ticks(sett.y.ticks)
          .tickSizeOuter(sett.y.tickSizeOuter ? sett.y.tickSizeOuter : null)
          .tickFormat(sett.y.getTickText ? sett.y.getTickText.bind(sett) : null)
      );
    },
    drawTable = function drawTable() {
      var sett = this.settings;
      var thisSVG = d3.select("#" + sett.barTableID); // .select("svg");

      var summaryId = sett.summaryId; // "chrt-dt-tbl";
      // const filteredData = (sett.filterData && typeof sett.filterData === "function") ?
      //     sett.filterData(data, "table") : data;
      // use original data, not array returned by filteredData which may contain inserted year-end datapts

      var filteredData = sett.filterData && typeof sett.filterData === "function" ? sett.filterData(data, "table") : data;
      var parent = thisSVG.select( // svg.select(
      svg.classed("svg-shimmed") ? function () {
        return this.parentNode.parentNode;
      } : function () {
        return this.parentNode;
      });
      var details = parent.select(".chart-data-table");
      var keys = sett.z.getKeys.call(sett, filteredData);
      var table;
      var header;
      var body;
      var dataRows;
      var dataRow;
      var k;

      if (mergedSettings.dataTableTotal) {
        keys.push("total");
      }

      if (!details.empty()) {
        // details.remove();
        details.remove();
      } // if (details.empty()) {


      details = parent.append("div").attr("class", "chart-data-table"); // ----Copy Button Container ---------------------------------------------

      var copyButtonId = "copy-button-container"; // let copyButton = document.createElement("div");
      // copyButton.setAttribute("id", copyButtonId);
      // details.append(copyButton);

      details.append("div") // .attr("id", summaryId)
      .attr("id", function () {
        if (d3.select("#chrt-dt-tbl").empty()) return summaryId;else return summaryId + "1"; // allow for a second table
        // return summaryId;
      }) // .text(sett.datatable.title);
      .text(sett.tableTitle); // ------------------------------------------------------------------------

      details.append("div").attr("id", copyButtonId);
      table = details.append("table").attr("class", "table");
      table.append("caption") // .text(sett.datatable.title);
      .attr("class", "wb-inv").text(sett.tableTitle);
      header = table.append("thead").attr("id", "tblHeader").append("tr").attr("id", "tblHeaderTR");
      body = table.append("tbody").attr("id", "tblBody");
      header.append("td").attr("id", "thead_h0").text(filterYear(sett.x.label));

      for (k = 0; k < keys.length; k++) {
        header.append("th").attr("id", "thead_h" + (k + 1)) // k = 0 already used above
        .style("text-align", "right").text(sett.z.getText.bind(sett)({
          key: keys[k]
        }));
      }

      dataRows = body.selectAll("tr").data(filteredData); // NOT WORKING
      // dataRows
      //   .exit()
      //   .remove();

      dataRow = dataRows.enter().append("tr").attr("id", function (d, i) {
        return "row" + i;
      });
      dataRow.append("th").attr("id", function (d, i) {
        return "row" + i + "_h0";
      }).text((sett.x.getText || sett.x.getValue).bind(sett)); // NOT WORKING
      // dataRow
      //   .exit()
      //   .remove();

      for (k = 0; k < keys.length; k++) {
        dataRow.append("td").attr("headers", function (d, i) {
          return "row" + i + "_h0" + " thead_h" + (k + 1);
        }).text(function (d) {
          if (sett.y.getText) {
            return sett.y.getText.call(sett, d, keys[k]);
          }

          return sett.y.getValue.call(sett, d, keys[k]);
        }).style("text-align", "right");
      }

      if ($ || wb) {
        $(".chart-data-table summary").trigger("wb-init.wb-details");
      }
      if(wb.ie11){
        details.attr("open", true)
      }

    },
    clear = function() {
      dataLayer.remove();
    },
    x0, x1, y, rtnObj, process;

  rtnObj = {
    settings: mergedSettings,
    clear: clear,
    svg: svg
  };

  svg
    .attr("viewBox", "-50 0 " + (outerWidth+50) + " " + (outerHeight+10))
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

function filterYear(key) {
  if (key !== "Year") {
    return key;
  } else {
    return "";
  }
};
// TODO: Remove when switched to ES6
if (!Math.sign) {
  Math.sign = function(x) {
    return ((x > 0) - (x < 0)) || +x;
  };
}

})(jQuery.extend, jQuery);
