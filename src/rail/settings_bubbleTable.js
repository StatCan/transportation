export default {
  aspectRatio: 19 / 3,
  margin: {
    top: 30,
    right: 0,
    bottom: 0,
    left: 120
  },
  alt: i18next.t("alt", {ns: "commodities"}),
  filterData: function(data) {
    const obj = {};

    data.map((d) => {
      const key = Object.keys(d)[0];
      const yearList = Object.keys(d[key]);
 
      // set key once
      if (!obj[key]) {
        obj[key] = [];
      }
      // push year-value pairs for each year into obj
      for (let idx = 0; idx < yearList.length; idx++) {
        obj[key].push({
          year: Object.keys(d[key])[idx],
          value: Object.values(d[key])[idx].All
        });
      }
    });

    // re-arrange obj so that each element object has an id and 
    // a dataPoints array containing the year-value pairs created above
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
    },
    getText: function(d) {
      return d.year;
    }
  },
  r: {
    inverselyProportional: false, // if true, bubble size decreases with value
    getValue: function(d) {
      return d.value;
    }
  },
  z: { // Object { id: "total", dataPoints: (21) […] }, and similarly for id: local, id: itin
    getId: function(d) {
      return d.id;
    },
    getClass: function(...args) {
      return this.z.getId.apply(this, args);
    },
    getText: function(d) {
      return i18next.t(d.id, {ns: "commodities"});
    },
    getDataPoints: function(d) {
      return d.dataPoints;
    },
  },
  width: 900
};
