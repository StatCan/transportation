export default {
  alt: i18next.t("alt", {ns: "roadArea"}),
  ns: "roadArea",
  margin: {
    top: 50,
    left: 90,
    right: 30,
    bottom: 50
  },
  scalef: 1e3,
  aspectRatio: 16 / 11,
  formatNum: function() {
    const formatNumber = d3.format(",d");
    const format = function(d) {
      if (Number(d)) {
        return formatNumber(d);
      } else {
        return d;
      }
    };
    return format;
  },
  // creates variable d
  filterData: function(data) {
    // Flag to check if data has already been padded (i.e. data file has never been loaded)
    let isOld = false;
    data.map((item) => {
      if (item.isLast) {
        isOld = isOld || true;
      }
    });

    // If not padded, pad out the last year out to Jan 10
    if (!isOld) {
      const padMonth = 0;
      const padDay = 10;
      // (year, month, date, hours, minutes, seconds, ms)
      data.push({
        date: new Date(data[data.length - 1].date, padMonth, padDay, 0, 0, 0, 0),
        diesel: data[data.length - 1].diesel,
        gas: data[data.length - 1].gas,
        lpg: data[data.length - 1].lpg,
        total: data[data.length - 1].total,
        isLast: true
      });
    }
    return data;
  },
  x: {
    label: i18next.t("x_label", {ns: "roadArea"}),
    getValue: function(d, i) {
      return new Date(d.date);
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
      return (isNaN(Number(d[sett.y.totalProperty])) ? 0 : Number(d[sett.y.totalProperty]) *1.0 / 1000);
    },
    getText: function(d, key) {
      if (!d.isLast) {
        return isNaN(Number(d[key])) ? d[key] : Number(d[key]) * 1.0 / 1000;
      }
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
    origData: function(data) {
      // remove last point which was added in filterData (padded date)
      const origData = data.slice(0, -1);
      return origData;
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
