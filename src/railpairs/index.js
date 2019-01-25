const data = {};
let selected = "CANADA";

/* globals areaChart */
const chart = d3.select(".data")
    .append("svg")
    .attr("id", "demo");
const id = "year";
const sett = {
  alt: i18next.t("alt", {ns: "area"}),
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
      if (typeof d[key] === "string" || d[key] instanceof String) {
        return 0;
      } else return d[key] * 1.0/ 1000;
    },
    getText: function(d, key) {
      if (typeof d[key] === "string" || d[key] instanceof String) {
        return d[key];
      } else return d[key] * 1.0/ 1000;
    }
  },
  z: {
    label: i18next.t("z_label", {ns: "area"}),
    getId: function(d) {
      return d.key;
    },
    getKeys: function(object) {
      const sett = this;
      const keys = Object.keys(object[0]);
      keys.splice(keys.indexOf(id), 1);
      if (keys.indexOf(sett.y.totalProperty) !== -1) {
        keys.splice(keys.indexOf(sett.y.totalProperty), 1);
      }
      return keys;
    },
    getClass: function(...args) {
      return this.z.getId.apply(this, args);
    },
    getText: function(d) {
      return i18next.t(d.key, {ns: "regions"});
    }
  },
  width: 900,
  datatable: false,
  transition: false,
};

function uiHandler(event) {
  if (event.target.id === "groups") {
    selected = document.getElementById("groups").value;
    if (!data[selected]) {
      d3.json("data/rail/rail_meat_origATR_ON_BC_dest" + selected + ".json", function(err, filedata) {
        data[selected] = filedata;
        showData();
      });
    } else {
      showData();
    }
  }
}

function showData() {
  areaChart(chart, sett, data[selected]);
}


i18n.load(["src/i18n"], function() {
  d3.queue()
      .defer(d3.json, "data/rail/rail_meat_origATR_ON_BC_destQC.json")
      .await(function(error, data) {
        areaChart(chart, sett, data);
      });
});

$(document).on("change", uiHandler);
