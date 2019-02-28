export default {
  alt: i18next.t("alt", {ns: "roadArea"}),
  margin: {
    top: 50,
    left: 90,
    right: 30,
    bottom: 50
  },
  // creates variable d
  filterData: function(data) {
    // data is an array of objects
    return data;
  },
  x: {
    label: i18next.t("x_label", {ns: "roadArea"}),
    getValue: function(d, i) {
      // return new Date(d.date + "-01");
      // for first year, start at Jan -01T00:00:00.000Z
      // for last year, end one ms past midnight so that year label gets plotted
      return i === 0 ? new Date(d.date + "-01") :
        new Date(d.date, 0, 1, 0, 0, 0, 1);
    },
    getText: function(d) {
      return d.date;
    },
    ticks: 7
  },
  y: {
    label: i18next.t("y_label", {ns: "roadArea"}),
    getValue: function(d, key) {
      if (typeof d[key] === "string" || d[key] instanceof String) {
        return 0;
      } else return d[key] * 1.0/ 1e3;
    },
    getTotal: function(d, index, data) {
      let total;
      let keys;
      const sett = this;
      if (!d[sett.y.totalProperty]) {
        keys = sett.z.getKeys.call(sett, data);
        total = 0;
        for (let k = 0; k < keys.length; k++) {
          total += sett.y.getValue.call(sett, d, keys[k], data);
        }
        d[sett.y.totalProperty] = total;
      }
      return d[sett.y.totalProperty];
    },
    getText: function(d, key) {
      if (typeof d[key] === "string" || d[key] instanceof String) {
        return d[key];
      } else return d[key] * 1.0/ 1e3;
    },
    ticks: 5
  },
  z: {
    label: i18next.t("z_label", {ns: "roadArea"}),
    getId: function(d) {
      return d.key;
    },
    getKeys: function(object) {
      const sett = this;
      const keys = Object.keys(object[0]);
      keys.splice(keys.indexOf("date"), 1);
      if (keys.indexOf(sett.y.totalProperty) !== -1) {
        keys.splice(keys.indexOf(sett.y.totalProperty), 1);
      }
      return keys;
    },
    getClass: function(...args) {
      return this.z.getId.apply(this, args);
    },
    getText: function(d) {
      return i18next.t(d.key, {ns: "roadArea"});
    }
  },
  datatable: true,
  tableTitle: "",
  dataTableTotal: true, // show total in data table
  transition: false,
  width: 1050
};
