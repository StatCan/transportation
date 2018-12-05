export default {
  alt: i18next.t("alt", {ns: "airports"}),
  filterData: function(data) {
    const obj = {};
    data.rank.map((d) => {
      const keys = Object.keys(d);
      keys.splice(keys.indexOf("year"), 1);

      for (const key of keys) {
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
      };
    });
  },
  x: {
    getValue: function(d) {
      return d.year;
    }
  },
  r: {
    getDomain: function() {
      return [0, 5];
    },
    getValue: function(d) {
      return d.rank;
    }
  },
  z: { // Object { id: "total", dataPoints: (21) […] }, and similarly for id: local, id: itin
    getId: function(d) {
      console.log("d in z: ", d);
      return d.id;
    },
    getClass: function(...args) {
      return this.z.getId.apply(this, args);
    },
    getText: function(d) {
      return i18next.t(d.id, {ns: "area"});
    },
    getDataPoints: function(d) {
      return d.dataPoints;
    },
  },
  width: 990
};
