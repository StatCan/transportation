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

this.drawMapTable = function(svg, settings, data) {
      const formatNumber = d3.format(",d");
      const format = function(d) {
        return formatNumber(d);
      };
      const mergedSettings = extend(true, {}, defaults, settings);
      const outerWidth = mergedSettings.width;
      const outerHeight = Math.ceil(outerWidth / mergedSettings.aspectRatio);
      const drawTable = function() {
      const sett = this.settings;
      const summaryId = "map-dt-tbl";
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

        // Not used because there is no "x axis" rows like in stackedArea
        // header.append("th")
        //     .text(sett.x.label);

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

        // Not used because there is no "x axis" rows like in stackedArea
        // dataRow
        //     .append("th");
        //     .text((sett.x.getText || sett.x.getValue).bind(sett));

        for (k = 0; k < keys.length; k++) {
          dataRow
              .append("td")
              .text(function(d) {
                if (sett.y.getText) {
                  return format(sett.y.getText.call(sett, d, keys[k]));
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
      clear: clear
    };

    const process = function() {
      // draw.apply(rtnObj);
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
