export default {
  alt: i18next.t("alt", {ns: "airports"}),
  filterData: function(data) {
    let obj = {};
    data.rank.map((d) => {
      let keys = Object.keys(d);
      keys.splice(keys.indexOf("year"),1);

      for (let key of keys) {
        if (!obj[key]) {
          obj[key] = [];
        }

        obj[key].push({
          year: d.year,
          rank: d[key]
        });
      }
    });

    return Object.keys(obj).map(function(k) {
      return {
        id: k,
        dataPoints: obj[k]
      }
    });
  },
  x: {
    getValue: function(d) {
      return new Date(d.year + "-01");
    },
    getText: function(d) {
      return d.year;
    }
  },

  y: {
    label: i18next.t("y_label", {ns: "area"}),
    getValue: function(d) {
      return d.rank;
    },
    getText: function(d, key) {
      return d.rank;
    }
  },

  z: {
    getId: function(d) {
      return d.id;
    },
    getClass: function(d) {
      return this.z.getId.apply(this, arguments);
    },
    getText: function(d) {
      return i18next.t(d.id, {ns: "area"});
    }
  },
  width: 990
}
