(function(extend) {
  const defaults = {
    margin: {
      top: 15,
      right: 10,
      bottom: 30,
      left: 50
    },
    aspectRatio: 16 / 9,
    // x: {
    //   // ticks: 5
    // },
    // y: {
    //   // ticks: 10,
    //   totalProperty: "total",
    //   getTotal: function(d, index, data) {
    //     const sett = this;
    //     let total;
    //     let keys;
    //     if (!d[sett.y.totalProperty]) {
    //       keys = sett.z.getKeys.call(sett, data);
    //       total = 0;
    //       for (let k = 0; k < keys.length; k++) {
    //         total += sett.y.getValue.call(sett, d, keys[k], data);
    //       }
    //       d[sett.y.totalProperty] = total;
    //     }
    //     return d[sett.y.totalProperty];
    //   }
    // },
    width: 600
  };

this.drawTable = function(tableDiv, settings, data) {
      const formatNumber = d3.format(",d");
      const format = function(d) {
        return formatNumber(d);
      };
      const mergedSettings = extend(true, {}, defaults, settings);
      const outerWidth = mergedSettings.width;
      const outerHeight = Math.ceil(outerWidth / mergedSettings.aspectRatio);
      const drawTable = function() {
      const sett = this.settings;
      const summaryId = "only-dt-tbl";
      const filteredData = (sett.filterData && typeof sett.filterData === "function") ?
          sett.filterData(data, "table") : data;
      // const parent = svg.select(
      //     svg.classed("svg-shimmed") ? function() {
      //       return this.parentNode.parentNode;
      //     } : function() {
      //       return this; // this.parentNode;
      //     }
      // );
      // let details = parent
      //     .select("details");
      let details = tableDiv.select("details");
      let body = tableDiv.select(".table").select("tbody");
      const keys = sett.z.getKeys.call(sett, filteredData);
      let dataRows;
      let dataRow;
      let k;
      let wb;
      let textFn = function(d) {
        if (sett.y.getText) {
          return format(sett.y.getText.call(sett, d, keys[k]));
        }
        const rowValue = sett.y.getValue.call(sett, d, keys[k]);
        if (typeof rowValue === "string" || rowValue instanceof String) {
          return rowValue;
        }
        return format(sett.y.getValue.call(sett, d, keys[k]));
        // return sett.y.getValue.call(sett, d, keys[k]);
      }.bind(sett)

      if (details.empty()) {
        let table;
        let header;
        details = tableDiv // parent
            .append("details")
            .attr("class", "chart-data-table");

        details.append("summary")
            .attr("id", summaryId)
            // .text(sett.datatable.title);
             .text(sett.tableTitle);
       table = details
           .append("table")
           .attr("class", "table")
           .attr("aria-labelledby", summaryId);

       header = table.append("thead")
         .attr("id", "tblHeader")
         .append("tr");

       for (k = 0; k < keys.length; k++) {
         header.append("th")
             .attr("id", "thead_h" + (k + 1)) // k = 0 already used above
             .text(sett.z.getKeyText.call(sett, keys[k]));
       }

       body = table.append("tbody");
      }

      dataRows = body.selectAll("tr")
          .data(filteredData, sett.z.getId.bind(sett));


      dataRow = dataRows
        .enter()
        .append("tr")
        .attr("id", function(d, i) {
          return "row" + i;
        });

      dataRow
        .append("th")
        .text((sett.z.getText || sett.z.getValue).bind(sett));

        for (k = 1; k < keys.length; k++) {
          dataRow
              .append("td")
              .attr("headers", function(d, i) {
                return "row" + i + "_h0" + " thead_h" + (k + 1);
              })
              .text(textFn);

          dataRows.select(`td:nth-of-type(${k})`).text(textFn)
        }

      dataRows.exit().remove();


        if ($ || wb) {
          $(".map-data-table summary").trigger("wb-init.wb-details");
        }
      // }
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
