export default {
  alt: i18next.t("alt", {ns: "line"}),
  filterData: function(data) {
    console.log(data.numMov);
    const root = data.numMov;
    const keys = [ "enplaned" ];

    const val = root.filter( (item) => item.enplaned).map((item) => item.enplaned)
    const yr = root.filter( (item) => item.year).map((item) => item.year)
    console.log("val: ", val)
    console.log("yr: ", yr)

    return keys.map(function(key) {
      return {
        id: key,
        values: root.map(function(value, index) {
          return {
            year: yr[index],
            enplaned: val[index]
          };
        })
      };
    });
  },
  x: {
    label: i18next.t("x_label", {ns: "line"}),
    getValue: function(d) {
      console.log("x d: ", d)
      return new Date(d.year + "-01");
    },
    getText: function(d) {
      return d.year;
    }
  },

  y: {
    label: i18next.t("y_label", {ns: "line"}),
    getValue: function(d) {
      return d.enplaned * 1.0 / 1000000;
    },
    getText: function(d) {
      return d.enplaned;
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
      return d.values;
    },
    getText: function(d) {
      return i18next.t(d.id, {ns: "line"});
    }
  },
  datatable: false,
  width: 900
};
