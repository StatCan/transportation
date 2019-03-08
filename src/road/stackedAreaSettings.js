export default {
  alt: i18next.t("alt", {ns: "roadArea"}),
  margin: {
    top: 50,
    left: 90,
    right: 30,
    bottom: 50
  },
  aspectRatio: 16 / 11,
  // creates variable d
  filterData: function(data) {
    let count = 0;
    data.filter(function(item) {
      item.isLast = (count === data.length - 1) ? true : false;
      count++;
    });
    // data is an array of objects
    return data;
  },
  x: {
    label: i18next.t("x_label", {ns: "roadArea"}),
    getValue: function(d, i) {
      // return new Date(d.date + "-01");
      // for first year, start at Jan -01T00:00:00.000Z
      // for last year, extend to allow vertical line cursor to reach it
      return d.isLast ? new Date(d.date, 0, 10, 0, 0, 0, 0) : // (year, month, date, hours, minutes, seconds, ms)
            new Date(d.date + "-01");
    },
    getText: function(d) {
      return d.date;
    },
    ticks: 8,
    tickSizeOuter: 0
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
          total += sett.y.getValue.call(sett, d, keys[k], data) * 1e3; // keep in orig scale when summing
        }
        d[sett.y.totalProperty] = total;
      }
      return (isNaN(Number(d[sett.y.totalProperty])) ? 0 : Number(d[sett.y.totalProperty]) *1.0/1000);
    },
    getText: function(d, key) {
      return isNaN(Number(d[key])) ? d[key] : Number(d[key]) * 1.0/ 1000;
    },
    ticks: 5,
    tickSizeOuter: 0
  },
  z: {
    label: i18next.t("z_label", {ns: "roadArea"}),
    getId: function(d) {
      if (d.key !== "isLast") {
        return d.key;
      }
    },
    getKeys: function(object) {
      const sett = this;
      const keys = Object.keys(object[0]);
      keys.splice(keys.indexOf("date"), 1);
      if (keys.indexOf(sett.y.totalProperty) !== -1) {
        keys.splice(keys.indexOf(sett.y.totalProperty), 1);
      }
      if (keys.indexOf("isLast") !== -1) { // temporary key to be removed
        keys.splice(keys.indexOf("isLast"), 1);
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
  width: 1050,
};
