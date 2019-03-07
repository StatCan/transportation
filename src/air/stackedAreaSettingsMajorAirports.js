export default {
  margin: {
    top: 50,
    left: 90,
    right: 30,
    bottom: 50
  },
  aspectRatio: 16 / 11,
  filterData: function(data) {
    return baseDateFilter(data);
  },
  x: {
    getLabel: function() {
      return i18next.t("x_label", {ns: "airMajorAirports"});
    },
    getValue: function(d, i) {
      // return new Date(d.date + "-01");
      // for first year, start at Jan -01T00:00:00.000Z
      // for last year, end one ms past midnight so that year label gets plotted
      return new Date(d.date + "-01");
      // return i === 0 ? new Date(d.date + "-01") :
      //   new Date(d.date, 0, 1, 0, 0, 0, 1);
    },
    getText: function(d) {
      return d.date;
    },
    ticks: 7*6
  },

  y: {
    label: i18next.t("y_label", {ns: "airMajorAirports"}),
    getLabel: function() {
      return i18next.t("y_label", {ns: "airMajorAirports"});
    },
    getValue: function(d, key) {
      if (d[key]=== "x" || d[key]=== "..") {
        return 0;
      } else return Number(d[key]);
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
      // if (d[key]=== "x" || d[key]=== "..") {
      //   return d[key];
      // } else return Number(d[key]);
      return isNaN(Number(d[key]))? d[key]: Number(d[key]);
    },
    ticks: 5,
    tickSizeOuter: 0
  },

  z: {
    // label: i18next.t("z_label", {ns: "airPassengers"}),
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
      // return keys.sort();
      // return ["local", "Remaining_local", "itinerant", "Remaining_itinerant"];
    },
    getClass: function(...args) {
      return this.z.getId.apply(this, args);
    },
    getText: function(d) {
      return i18next.t(d.key, {ns: "airMajorAirports"});
    }
  },
  datatable: true,
  dataTableTotal: true, // show total in data table
  areaTableID: "areaTable",
  // summaryId: "chrt-dt-tbl",
  transition: true,
  width: 1050
};
const baseDateFilter = function(data) {
  const minDate = new Date("2010");
  const newData = [];
  for (let s = 0; s < data.length; s++) {
    const date = new Date(data[s].date);
    if (date >= minDate) {
      newData.push(data[s]);
    }
  }

  return newData;
};
