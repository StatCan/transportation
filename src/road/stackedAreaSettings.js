export default {
  alt: i18next.t("alt", {ns: "area"}),
  margin: {
    left: 80
  },
  //creates variable d
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
    ticks: 7
  },
  y: {
    label: i18next.t("y_label", {ns: "area"}),
    getValue: function(d, key) {
      if (typeof d[key] === "string" || d[key] instanceof String) {
        return 0;
      } else return d[key] * 1.0/ 1000;
    },
    getTotal: function(d, index, data) {
      var total; var keys; var sett = this;
      if (!d[sett.y.totalProperty]) {
        keys = sett.z.getKeys.call(sett, data);
        total = 0;
        //skipped date value here slice later
        for(var k = 0; k < keys.length; k++) {
          total += sett.y.getValue.call(sett, d, keys[k], data);
        }
        d[sett.y.totalProperty] = total;
      }

      return d[sett.y.totalProperty];
    },
    getText: function(d, key) {
      if (typeof d[key] === "string" || d[key] instanceof String) {
        return d[key];
      } else return d[key] * 1.0/ 1000;
    }
  },
  z: {
    label: i18next.t("z_label", {ns: "area"}),
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
    getClass: function(d) {
      return this.z.getId.apply(this, arguments);
    },
    getText: function(d) {
      return i18next.t(d.key, {ns: "area"});
    }
  },
  datatable: false,
  width: 850
};
