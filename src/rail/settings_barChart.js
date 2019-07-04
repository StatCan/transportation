export default {
  aspectRatio: 16 / 13,
  margin: {
    top: 50,
    left: 50,
    bottom: 50
  },
  x: {
    label: i18next.t("x_label", {ns: "railBar"}),
    getId: function(d) {
      return d.year;
    },
    getValue: function(...args) {
      return this.x.getId.apply(this, args);
    },
    getClass: function(...args) {
      return this.x.getId.apply(this, args);
    },
    getTickText: function(val) {
      return i18next.t(val, {ns: "railBar"});
    }
  },

  y: {
    label: i18next.t("y_label", {ns: "railBar"}),
    getValue: function(d) {
      return d.value;
    },
    getText: function(d) {
      return d.value;
    },
    getTickText: function(d) {
      return this.formatNum(d);
    },
    ticks: 10,
    tickSizeOuter: 0
  },

  z: {
    label: i18next.t("z_label", {ns: "railTable"}),
    getId: function(d) {
      return d.category;
    },
    getKeys: function(object) {
      const keys = Object.keys(object[0]);
      keys.splice(keys.indexOf("category"), 1);
      return keys;
    },
    formatData: function(data) {
      return data[0].values;
    },
    getClass: function(...args) {
      return this.z.getId.apply(this, args);
    },
    getDataPoints: function(d) {
      return d.values;
    },
    getText: function(d) {
      return i18next.t(d.key, {ns: "rail"});
    },
    getHeaderText: function(d) {
      return i18next.t(d.key[0], {ns: "rail"}) + " " + i18next.t("to", {ns: "rail"}) + " " + i18next.t(d.key[1], {ns: "rail"});
    }
  },
  _selfFormatter: i18n.getNumberFormatter(0),
  formatNum: function(...args) {
    return this._selfFormatter.format(args);
  },
  width: 800,
  datatable: false,
  tableTitle: ""
};
