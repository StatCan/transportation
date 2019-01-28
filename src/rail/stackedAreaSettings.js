export default {
  aspectRatio: 15 / 3,
  alt: i18next.t("alt", {ns: "area"}),
  filterData: function(data) {
    return data.tonnage;
  },
  x: {
    getValue: function(d) {
      return new Date(d.year + "-01");
    },
    getText: function(d) {
      return d.year;
    },
    ticks: 10
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
    },
    ticks: 2
  },
  z: {
    label: i18next.t("z_label", {ns: "area"}),
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
      return i18next.t(d.key, {ns: "area"});
    }
  },
  datatable: false,
  transition: false,
  width: 900
};
