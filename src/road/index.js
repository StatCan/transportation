data = {};
selected = "CANADA";

const map = d3.select(".dashboard .map")
    .append("svg");
getCanadaMap(map); // .on("loaded", function() {});

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
        return data.fuelsales;
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
          return i18next.t(d.key, {ns: "area"});
        }
      },
      width: 900
    };

  uiHandler = function(event) {
    if (event.target.id === "groups"){
      selected = document.getElementById("groups").value;
      console.log("selected: ", selected)
      if (!data[selected]) {
        d3.json("data/road/" + selected + "_FuelSales.json", function(err, filedata) {
          data[selected] = filedata;
          showData();
         });
     } else {
       showData();
     }
    }
  }

  function showData() {
    //change area chart title to match selected province
    d3.select(".dashboard h4").text(i18next.t(selected, {ns: "provinces"}));

    areaChart(chart, settings, data[selected]);
  }

  //
//   data = {};
// selected = "ca";

// onInput = function() {
//  selected = "nb"

//  if (!data[selected]) {
//    d3.json(selected + ".json", function(err, data) {
//      showData();
//    });
//  } else {
//    showData();
//  }
// }

// showData() {
//  areaChart(svg, settings, data[selected]);
// }

// d3.queue()
//  .defer(d3.json, "ca.json")
//  .await(funnction(err, caData) {
//    data.ca = caData;
//    showData();
//  });
 //

i18n.load(["src/i18n"], function() {
  d3.queue()
    // .defer(d3.json, "data/worldpop.json")
    .defer(d3.json, "data/road/BC_FuelSales.json")
    .await(function(error, data) {
      areaChart(chart, settings, data);
    });
});

$(document).on("input change", function(event) {
  uiHandler(event);
});
