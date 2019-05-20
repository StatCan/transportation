export default {
  aspectRatio: 19 / 6,
  margin: {
    top: 30,
    right: 0,
    bottom: 20,
    left: 120
  },
  alt: i18next.t("alt", {ns: "commodities"}),
  filterData: function(data) {
    const obj = {};
    let yearList;
    const lastYearArray = [];

    data.map((d) => {
      const key = Object.keys(d)[0];
      if (!yearList) {
        yearList = Object.keys(d[key]);
      }
      const lastYear = yearList[yearList.length - 1];

      // set key once
      if (!obj[key]) {
        obj[key] = [];
      }

      // Store lastYear value for each commodity for sorting later
      lastYearArray.push({
        key: key,
        lastYearValue: d[key][lastYear].All
      });

      // push year-value pairs for each year into obj
      for (let idx = 0; idx < yearList.length; idx++) {
        obj[key].push({
          year: Object.keys(d[key])[idx],
          value: Object.values(d[key])[idx].All
        });
      }
    });

    // Sort by value in last year (descending order)
    lastYearArray.sort(function(a, b) {
      return a.lastYearValue < b.lastYearValue;
    });

    // Define array of ordered commodities
    const orderedComm = lastYearArray.map((item) => item.key);

    // Define mapping between old order and new order (to be used in final obj return)
    let count = 0;
    const mapping = [];
    Object.keys(obj).map(function(k) {
      const thisComm = orderedComm[count];
      mapping.push({[k]: thisComm});
      count++;
    });

    // Re-arrange obj so that each element object has an id and
    // a dataPoints array containing the year-value pairs created above.
    // Note that object is ordered according to sorted commodity list.
    let match;
    return Object.keys(obj).map(function(k) {
      mapping.map((d) => {
        if (Object.keys(d)[0] === k) {
          match = Object.values(d)[0];
          return match;
        }
      });
      return {
        id: match,
        dataPoints: obj[match]
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
    getTableText: function(d) {
      return i18next.t(d.key, {ns: "commodities"});
    },
    getDataPoints: function(d) {
      return d.dataPoints;
    },
  },
  _selfFormatter: i18n.getNumberFormatter(0),
  formatNum: function(...args) {
    return this._selfFormatter.format(args);
  },
  width: 800
};
