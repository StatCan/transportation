(function (extend) {
var defaults = {
  margin: {
    top: 15,
    right: 10,
    bottom: 30,
    left: 50
  },
  aspectRatio: 16 / 9,
  x: {
    // ticks: 5
    tickSize: 12,
    tickSizeOuter: 12
  },
  y: {
    ticks: 12,
    tickSizeOuter: 12,
    totalProperty: "total",
    getTotal: function getTotal(d, index, data) {
      var sett = this;
      var total;
      var keys;

      if (!d[sett.y.totalProperty]) {
        keys = sett.z.getKeys.call(sett, data);
        total = 0;

        for (var k = 0; k < keys.length; k++) {
          total += sett.y.getValue.call(sett, d, keys[k], data);
        }

        d[sett.y.totalProperty] = total;
      }

      return d[sett.y.totalProperty];
    }
  },
  areaTableID: "areaTable",
  summaryId: "chrt-dt-tbl",
  dataTableTotal: false
};

function filterYear(key) {
  if (key !== "Year") {
    return key;
  } else {
    return "";
  }
}

this.areaChart = function (svg, settings, data) {
  var mergedSettings = extend(true, {}, defaults, settings);
  var outerWidth = mergedSettings.width;
  var outerHeight = Math.ceil(outerWidth / mergedSettings.aspectRatio);
  var innerHeight = mergedSettings.innerHeight = outerHeight - mergedSettings.margin.top - mergedSettings.margin.bottom;
  var innerWidth = mergedSettings.innerWidth = outerWidth - mergedSettings.margin.left - mergedSettings.margin.right;
  var chartInner = svg.select("g.margin-offset");
  var dataLayer = chartInner.select(".data");
  var area = d3.area().defined(function (d) {
    return !(isNaN(d[0]) || isNaN(d[1]));
  }).x(function (d) {
    return x(mergedSettings.x.getValue(d.data));
  }).y0(function (d) {
    return y(d[0]);
  }).y1(function (d) {
    return y(d[1]);
  });
  var stack = d3.stack();
  var transition = d3.transition() // .duration(1000);
  .duration(500);

  var draw = function draw() {
    var sett = this.settings;
    var filteredData = sett.filterData && typeof sett.filterData === "function" ? sett.filterData.call(sett, data) : data;
    var keys = sett.z.getKeys.call(sett, filteredData);
    var stackData = stack.keys(keys).value(sett.y.getValue.bind(sett))(filteredData);
    var xAxisObj = chartInner.select(".x.axis");
    var yAxisObj = chartInner.select(".y.axis");
    var labelX = innerWidth - 6;

    var getXScale = function getXScale() {
      return d3.scaleTime();
    };

    var labelY = function labelY(d) {
      return y((d[d.length - 1][0] + d[d.length - 1][1]) / 2);
    };

    var classFn = function classFn(d, i) {
      var cl = "area area" + (i + 1);

      if (sett.z && sett.z.getClass && typeof sett.z.getClass === "function") {
        cl += " " + sett.z.getClass.call(sett, d);
      }

      return cl;
    };

    x = rtnObj.x = getXScale().range([0, innerWidth]);
    y = rtnObj.y = d3.scaleLinear().range([innerHeight, 0]);
    x.domain(d3.extent(filteredData, sett.x.getValue.bind(sett)));
    y.domain([0, d3.max(filteredData, sett.y.getTotal.bind(sett))]);

    if (dataLayer.empty()) {
      dataLayer = chartInner.append("g").attr("class", "data");
    }

    var areas = dataLayer.selectAll(".area").data(stackData, sett.z.getId.bind(sett));
    areas.enter().append("path").attr("class", classFn).attr("d", area); // CN added

    if (mergedSettings.transition === false) {
      areas // .transition(transition)
      .attr("d", area);
    } else {
      areas.transition(transition).attr("d", area);
    } // areas
    //     .transition(transition)
    //     .attr("d", area);


    areas.exit().remove();
    var labels = dataLayer.selectAll(".area-label").data(stackData, sett.z.getId.bind(sett));
    labels.enter().append("text").text(sett.z.getText.bind(sett)).attr("aria-hidden", "true").attr("class", "area-label").attr("fill", "#000").attr("x", labelX).attr("y", labelY).attr("dy", "1em").attr("text-anchor", "end"); // CN edits

    if (mergedSettings.transition === false) {
      labels.attr("y", labelY);
    } else {
      labels.transition(transition).attr("y", labelY);
    } // labels
    //     // .transition(transition)
    //     .attr("y", labelY);


    labels.exit().remove(); // CN add chart title

    if (!chartInner.empty()) {
      chartInner.append("text").attr("x", innerWidth / 2).attr("y", 0 - mergedSettings.margin.top / 2).attr("text-anchor", "middle").attr("class", "areaChartTitle");
    } // end CN


    if (xAxisObj.empty()) {
      xAxisObj = chartInner.append("g").attr("class", "x axis").attr("aria-hidden", "true").attr("transform", "translate(0," + innerHeight + ")");
      xAxisObj.append("text").attr("class", "chart-label").attr("fill", "#000") // .attr("x", innerWidth)
      .attr("x", innerWidth / 2) // CN added
      // .attr("dy", "-0.5em")
      .attr("dy", "3.5em") // CN added
      .attr("text-anchor", "end").text(settings.x.label);
    } else {
      xAxisObj.select("text").text(settings.x.label);
    }

    xAxisObj.call(d3.axisBottom(x).tickSize(mergedSettings.x.tickSize) // CN (to independently change outer tick sizes, use tickSizeOuter)
    .tickSizeOuter(mergedSettings.x.tickSizeOuter).ticks(mergedSettings.x.ticks).tickFormat(sett.x.getTickText ? sett.x.getTickText.bind(sett) : null));

    if (yAxisObj.empty()) {
      yAxisObj = chartInner.append("g").attr("class", "y axis").attr("aria-hidden", "true");
      yAxisObj.append("text").attr("class", "chart-label").attr("fill", "#000").attr("y", "0").attr("dy", "-0.5em").attr("text-anchor", "start").text(settings.y.label);
    } else {
      yAxisObj.select("text").text(settings.y.label);
    }

    yAxisObj.call(d3.axisLeft(y).ticks(mergedSettings.y.ticks).tickSizeOuter(mergedSettings.y.tickSizeOuter).tickFormat(sett.y.getTickText ? sett.y.getTickText.bind(sett) : null));
  };

  var drawTable = function drawTable() {
    var sett = this.settings;
    var thisSVG = d3.select("#" + sett.areaTableID); // .select("svg");

    var summaryId = sett.summaryId; // "chrt-dt-tbl";
    // const filteredData = (sett.filterData && typeof sett.filterData === "function") ?
    //     sett.filterData(data, "table") : data;
    // use original data, not array returned by filteredData which may contain inserted year-end datapts

    var filteredData = sett.z.origData && typeof sett.z.origData === "function" ? sett.z.origData.call(sett, data) : data;
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
    // var wb; // CN
    // Add "total" to keys for data table

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

  };

  var clear = function clear() {
    dataLayer.remove();
  };

  var x;
  var y;
  var rtnObj = {
    settings: mergedSettings,
    clear: clear,
    svg: svg
  };
  svg.attr("viewBox", "0 0 " + (outerWidth+50) + " " + (outerHeight+50)).attr("preserveAspectRatio", "xMidYMid meet").attr("role", "img").attr("aria-label", mergedSettings.altText);

  if (chartInner.empty()) {
    chartInner = svg.append("g").attr("class", "margin-offset").attr("transform", "translate(" + mergedSettings.margin.left + "," + mergedSettings.margin.top + ")");
  }

  var process = function process() {
    draw.apply(rtnObj);
    d3.stcExt.addIEShim(svg, outerHeight, outerWidth);
    if (mergedSettings.datatable === false) return;
    drawTable.apply(rtnObj);
  };

  if (data === undefined) {
    d3.json(mergedSettings.url, function (error, xhr) {
      data = xhr;
      process();
    });
  } else {
    process();
  }

  return rtnObj;
};
})(jQuery.extend, jQuery);
