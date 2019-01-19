export default {
  alt: i18next.t("alt", {ns: "line"}),
  aspectRatio: 19 / 3,
    margin: {
    top: 20,
    right: 10,
    bottom: 50,
    left: 50
  },
  filterData: function(data) {
    const root = data.numMov;
    // keys for labels to identify lines
    const keys = Object.keys(root[0]).slice(1); // exclude first key (year is for x-axis, not line labels)
    const rtn = keys.map((d) => {
      return {
        id: d,
        data: root.map((p) => {
          return {
            year: p.year,
            value: p[d]
          };
        })
      };
    });

    console.log("rtn: ", rtn)
    return rtn;
  },
  x: {
    label: i18next.t("x_label", {ns: "line"}),
    getLabel: function() {
      return i18next.t("x_label", {ns: "line"});
    },
    ticks: 10,
    getValue: function(d) {
      return new Date(d.year + "-01");
    },
    getText: function(d) {
      return d.year;
    }
  },

  y: {
    label: i18next.t("y_label", {ns: "line"}),
    getLabel: function() {
      return i18next.t("y_label", {ns: "line"});
    },
    ticks: 3,
    getValue: function(d) {
      return d.value * 1.0 / 1000;
    },
    getText: function(d) {
      return d.value;
    }
  },

  z: {
    label: i18next.t("z_label", {ns: "line"}),
    getId: function(d) {
      return d.id;
    },
    getKeys: function(d) {
      const keys = Object.keys(d);
      keys.splice(keys.indexOf("keys"), 1);
      return keys;
    },
    getClass: function() {
      return this.z.getId.apply(this, arguments);
    },
    getDataPoints: function(d) {
      return d.data;
    },
    getText: function(d) {
      return i18next.t(d.id, {ns: "line"});
    }
  },
  datatable: false,
  width: 600
};
