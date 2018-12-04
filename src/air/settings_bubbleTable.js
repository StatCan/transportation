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
  // x: {
  //   getValue: function(d) {
  //     //invalid date!!!
  //     //d in here is just the keys: total, itinerant, local
  //     return new Date(d.year + "-01");
  //   },
  //   getText: function(d) {
  //     return d.year;
  //   }
  // },
  //
  // y: {
  //   label: i18next.t("y_label", {ns: "area"}),
  //   getValue: function(d) {
  //     //d in here is just the keys: total, itinerant, local
  //     return d.rank;
  //   },
  //   getText: function(d, key) {
  //     return d.rank;
  //   }
  // },

  z: { //Object { id: "total", dataPoints: (21) […] }, and similarly for id: local, id: itin
    getId: function(d) {
      console.log("d in z: ", d)
      return d.id;
    },
    getClass: function(d) {
      return this.z.getId.apply(this, arguments);
    },
    getText: function(d) {
      return i18next.t(d.id, {ns: "area"});
    },
    getDataPoints: function(d) {
       return d.dataPoints;
     },
  },
  width: 990
}
