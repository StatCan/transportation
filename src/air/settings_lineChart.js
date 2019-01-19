export default {
  alt: i18next.t("alt", {ns: "line"}),
  aspectRatio: 19 / 3,
    margin: {
    top: 15,
    right: 10,
    bottom: 50,
    left: 50
  },
  filterData: function(data) {
    console.log("filterData data: ", data)
    const root = data.numMov;
    console.log("code: ", root[0].code)
    const code = root[0].code;
    const keys = Object.keys(root[0]).slice(2); // exclude first two keys
    const rtn = keys.map((d) => {
      return {
        id: d,
        code: code,
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
    getCode: function(d) {
      console.log("d in x: ", d);
      // return d.code;
      return d.code;
    },
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
      console.log("d here: ", d);
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
