export default {
  alt: i18next.t("alt", {ns: "airPassengers"}),
  margin: {
    top: 50,
    left: 80,
    bottom: 50
  },
  filterData: function(data) {
    return baseDateFilter(data);
  },
  x: {
    getLabel: function() {
      return i18next.t("x_label", {ns: "airPassengers"});
    },
    getValue: function(d) {
      return new Date(d.date + "-01");
    },
    getText: function(d) {
      return d.date;
    },
    ticks: 7
  },

  y: {
    label: i18next.t("y_label", {ns: "airPassengers"}),
    getLabel: function() {
      return i18next.t("y_label", {ns: "airPassengers"});
    },
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
    ticks: 5
  },

  z: {
    label: i18next.t("z_label", {ns: "airPassengers"}),
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
      return i18next.t(d.key, {ns: "airPassengers"});
    }
  },
  datatable: true,
  tableTitle: i18next.t("tableTitle", {ns: "airPassengers"}),
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
