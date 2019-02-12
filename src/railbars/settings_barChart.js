export default {
  aspectRatio: 16 / 13,
    margin: {
    bottom: 150
  },
  // alt: i18next.t("alt", {ns: "railBar"}),
  // datatable: {
  //   title: i18next.t("datatableTitle", {ns: "railBar"})
  // },
  filterData: function(d) {
    console.log("filterData: ", d);
    // var root = d.data,
    //   keys = Object.keys(root);
    // keys.splice(keys.indexOf("keys"),1);

    // return keys.map(function(category) {
    //   return {
    //     category: category,
    //     values: root.keys.values.map(function(region, index) {
    //       return {
    //         region: region,
    //         imm: root[category][index]
    //       };
    //     })
    //   };
    // });
    return d;
  },
  x: {
    label: i18next.t("x_label", {ns: "railBar"}),
    getId: function(d) {
      return d.region;
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
      return d.imm;
    },
    getText: function(d) {
      return formatter.format(Math.round(d.imm));
    }
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
  width: 900
};