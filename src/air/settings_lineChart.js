export default {
  alt: i18next.t("alt", {ns: "line"}),
  aspectRatio: 19 / 5,
  margin: {
    top: 20,
    right: 10,
    bottom: 50,
    left: 50
  },
  filterData: function(data) {
    const root = data;
    // keys for labels to identify lines
    const keys = Object.keys(root[0]).slice(1); // exclude first key (date is for x-axis, not line labels)
    const rtn = keys.map((d) => {
      return {
        id: d,
        data: root.map((p) => {
          return {
            date: p.date,
            value: p[d]
          };
        })
      };
    });
    return rtn;
  },
  x: {
    ticks: 10,
    getValue: function(d) {
      return new Date(d.date + "-01");
    },
    getText: function(d) {
      return d.date;
    }
  },

  y: {
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
    getClass: function(...args) {
      return this.z.getId.apply(this, args);
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
