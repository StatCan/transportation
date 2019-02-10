export default {
  alt: i18next.t("alt", {ns: "airPassengerAirports"}),
  aspectRatio: 16/4,
  margin: {
    top: 20,
    right: 10,
    bottom: 50,
    left: 50
  },
  filterData: function(data) {
    return data;
  },
  x: {
    getValue: function(d) {
      return new Date(d.date + "-01");
    },
    getText: function(d) {
      return d.date;
    },
    ticks: 10
  },

  y: {
    getValue: function(d, key) {
      if (d[key]=== "x" || d[key]=== "..") {
        return 0;
      } else return Number(d[key]) * 1.0/ 1000;
    },
    getText: function(d, key) {
      if (d[key]=== "x" || d[key]=== "..") {
        return d[key];
      } else return Number(d[key]) * 1.0/ 1000;
    },
    ticks: 3
  },

  z: {
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
      return i18next.t(d.key, {ns: "airPassengerAirports"});
    }
  },
  datatable: true,
  // tableTitle: i18next.t("tableTitle", {ns: "airPassengerAirports"}),
  tableTitle: i18next.t("tableTitle", {ns: "airPassengerAirports"}),
  areaTableID: "airportTable",
  transition: false,
  width: 500
};
