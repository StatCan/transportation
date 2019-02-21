(function(extend) {
  var defaults = {
    margin: {
      top: 15,
      right: 10,
      bottom: 30,
      left: 50
    },
    aspectRatio: 16 / 9,
    width: 600
  };

this.drawTable = function(tableDiv, settings, data) {
      var formatNumber = d3.format(",d");

      var format = function format(d) {
      return formatNumber(d);
      };
      var mergedSettings = extend(true, {}, defaults, settings);
      var outerWidth = mergedSettings.width;
      var outerHeight = Math.ceil(outerWidth / mergedSettings.aspectRatio);
      var drawTable = function() {
      var sett = this.settings;
      var summaryId = "only-dt-tbl";
      var filteredData = sett.filterData && typeof sett.filterData === "function" ? sett.filterData(data, "table") : data;

      var details = tableDiv.select("details");
      var body = tableDiv.select(".table").select("tbody");
      var keys = sett.z.getKeys.call(sett, filteredData);
      var dataRows;
      var dataRow;
      var k;
      var wb;
      function _instanceof(left, right) {
        if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return right[Symbol.hasInstance](left);
        } else {
          return left instanceof right;
        }
      }

      var textFn = function (d) {
        if (sett.y.getText) {
          return format(sett.y.getText.call(sett, d, keys[k]));
        }
        var rowValue = sett.y.getValue.call(sett, d, keys[k]);
        if (typeof rowValue === "string" || _instanceof(rowValue, String)) {
          return rowValue;
        }
        return format(sett.y.getValue.call(sett, d, keys[k])); // return sett.y.getValue.call(sett, d, keys[k]);
      }.bind(sett);

      if (details.empty()) {
        var table;
        var header;
        details = tableDiv // parent
            .append("details")
            .attr("class", "chart-data-table");

         //copy button div//
        //----Copy Button Container ---------------------------------------------    
       var copyButtonId = "copy-button-container";
       // let copyButton = document.createElement("div");
       // copyButton.setAttribute("id", copyButtonId);
       // details.append(copyButton); ?
         
        details.append("div")
               .attr("id", copyButtonId);  
       //------------------------------------------------------------------------

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

          dataRows.select("td:nth-of-type(".concat(k, ")")).text(textFn);
        }

      dataRows.exit().remove();


        if ($ || wb) {
          $(".map-data-table summary").trigger("wb-init.wb-details");
        }
      // }
    };


    // var x;
    // var y;

    var rtnObj = {
      settings: mergedSettings
    };

    var process = function() {
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
