export default {
  aspectRatio: 16 / 16,
  margin: {
    top: 50,
    left: 100,
    bottom: 150
  },
  // alt: i18next.t("alt", {ns: "railBar"}),
  // datatable: {
  //   title: i18next.t("datatableTitle", {ns: "railBar"})
  // },
  x: {
    label: i18next.t("x_label", {ns: "railBar"}),
    getId: function(d) {
      return d.year;
    },
    getValue: function() {
      return this.x.getId.apply(this, arguments);
    },
    getClass: function() {
      return this.x.getId.apply(this, arguments);
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
      return formatter.format(Math.round(d.value));
    },
    ticks: 5
  },

  z: {
    // label: i18next.t("z_label", {ns: "railBar"}),
    getId: function(d) {
      return d.category;
    },
    getClass: function() {
      return this.z.getId.apply(this, arguments);
    },
    getDataPoints: function(d) {
      return d.values;
    },
    getText: function(d) {
      return i18next.t(d.id, {ns: "railBar"});
    }
  },
  width: 950
};
