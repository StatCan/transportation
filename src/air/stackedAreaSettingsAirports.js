export default {
  alt: i18next.t("alt", {ns: "areaAirport"}),
  aspectRatio: 19 / 5,
  margin: {
    top: 20,
    right: 10,
    bottom: 50,
    left: 50
  },
  filterData: function(data) {
    return data.numMov;
  },
  x: {
    getLabel: function() {
      return i18next.t("x_label", {ns: "areaAirport"});
    },
    getValue: function(d) {
      return new Date(d.year + "-01");
    },
    getText: function(d) {
      return d.year;
    },
    ticks: 10
  },

  y: {
    label: i18next.t("y_label", {ns: "areaAirport"}),
    getLabel: function() {
      return i18next.t("y_label", {ns: "areaAirport"});
    },
    getValue: function(d, key) {
      if (typeof d[key] === "string" || d[key] instanceof String) {
        return 0;
      } else return d[key] * 1.0/ 1000;
    },
    getText: function(d, key) {
      if (typeof d[key] === "string" || d[key] instanceof String) {
        return d[key];
      } else return d[key] * 1.0/ 1000;
    },
    ticks: 3
  },

  z: {
    label: i18next.t("z_label", {ns: "areaAirport"}),
    getId: function(d) {
      return d.key;
    },
    getKeys: function(object) {
      const sett = this;
      const keys = Object.keys(object[0]);
      keys.splice(keys.indexOf("year"), 1);
      if (keys.indexOf(sett.y.totalProperty) !== -1) {
        keys.splice(keys.indexOf(sett.y.totalProperty), 1);
      }
      return keys;
    },
    getClass: function(...args) {
      return this.z.getId.apply(this, args);
    },
    getText: function(d) {
      return i18next.t(d.key, {ns: "areaAirport"});
    }
  },
  datatable: false,
  width: 400
};
