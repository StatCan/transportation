export default {
  alt: i18next.t("alt", {ns: "airPassengers"}),
  ns: "airPassengers",
  margin: {
    top: 50,
    left: 90,
    right: 30,
    bottom: 50
  },
  scalef: 1e3,
  aspectRatio: 16 / 11,
  filterData: function(data) {
    // clone data object
    const dataClone = JSON.parse(JSON.stringify(data));
    const maxYears = dataClone.length;

    // extend previous year
    const padFullMonth = 11;
    const padFullDay = 31;

    // pad out the last year out to Jan 10
    const padMonth = 0;
    const padDay = 10;
    // (year, month, date, hours, minutes, seconds, ms)
    dataClone.push({
      date: new Date(dataClone[dataClone.length - 1].date, padMonth, padDay, 0, 0, 0, 0),
      domestic: dataClone[dataClone.length - 1].domestic,
      international: dataClone[dataClone.length - 1].international,
      transborder: dataClone[dataClone.length - 1].transborder,
      total: dataClone[dataClone.length - 1].total,
    });

    // Assign flag = 0 if all of the sectors are defined
    // else flag = 1 if at least one of the sectors is defined
    // else flag = -999 if none of the sectors is defined
    dataClone.filter(function(item) {
      if (parseFloat(item.domestic) && parseFloat(item.transborder) && parseFloat(item.international)) {
        item.flag = 0;
      } else if (parseFloat(item.domestic) || parseFloat(item.transborder) || parseFloat(item.international)) {
        item.flag = 1;
      } else if (!parseFloat(item.domestic) && !parseFloat(item.transborder) && !parseFloat(item.international)) {
        item.flag = -999;
      }
    });

    let count = 0;
    dataClone.filter(function(item) {
      item.isCopy = null;

      if (item.flag === 1 || item.flag === -999) {
        const prevIdx = count - 1 >= 0 ? count - 1 : 0; // counter for previous item

        if (item.flag === 1 && dataClone[prevIdx].flag === 0) {
          // Don't add previous item if 2 of the attributes are 0
          const prevSum = Number(dataClone[prevIdx].total);
          const partSum = Number(dataClone[prevIdx].domestic) + Number(dataClone[prevIdx].transborder) + Number(dataClone[prevIdx].international);

          if (prevSum !== partSum) {
            const decDate = new Date(dataClone[prevIdx].date, padFullMonth, padFullDay, 0, 0, 0, 0);
            dataClone.push({date: decDate,
              domestic: dataClone[prevIdx].domestic,
              international: dataClone[prevIdx].international,
              transborder: dataClone[prevIdx].transborder,
              total: dataClone[prevIdx].total,
              flag: dataClone[prevIdx].flag,
              isCopy: true
            });
          }
        } else if (item.flag === 1 || dataClone[prevIdx].flag === 1) {
          const sumDomestic = parseFloat(item.domestic) + parseFloat(dataClone[prevIdx].domestic);
          const sumTrans = parseFloat(item.transborder) + parseFloat(dataClone[prevIdx].transborder);
          const sumIntl = parseFloat(item.internationa) + parseFloat(dataClone[prevIdx].international);

          let thisMonth;
          let thisDay;
          if (!sumDomestic && !sumTrans && !sumIntl) { // this is last year therefore extend only out to Jan 31 (e.g. Manitoba)
            if (count >= maxYears) {
              thisMonth = padMonth;
              thisDay = 31;
            } else { // extend previous year
              thisMonth = padFullMonth;
              thisDay = padFullDay;
            }
            const decDate = new Date(dataClone[prevIdx].date, thisMonth, thisDay, 0, 0, 0, 0);
            dataClone.push({date: decDate,
              domestic: dataClone[prevIdx].domestic,
              international: dataClone[prevIdx].international,
              transborder: dataClone[prevIdx].transborder,
              total: dataClone[prevIdx].total,
              flag: dataClone[prevIdx].flag,
              isCopy: true
            });
          }
        } else if (item.flag === -999 && dataClone[prevIdx].flag !== -999) {
          const decDate = new Date(dataClone[prevIdx].date, padFullMonth, padFullDay, 0, 0, 0, 0);
          dataClone.push({date: decDate,
            domestic: dataClone[prevIdx].domestic,
            international: dataClone[prevIdx].international,
            transborder: dataClone[prevIdx].transborder,
            total: dataClone[prevIdx].total,
            flag: dataClone[prevIdx].flag,
            isCopy: true
          });
        }
      }

      count++;
    });

    dataClone.sort(function(a, b) {
      return new Date(a.date) - new Date(b.date);
    });

    return baseDateFilter(dataClone);
  },
  x: {
    getLabel: function() {
      return i18next.t("x_label", {ns: "airPassengers"});
    },
    getValue: function(d, i) {
      return new Date(d.date);
    },
    getText: function(d) {
      return d.date;
    },
    ticks: 7,
    tickSizeOuter: 0
  },

  y: {
    label: i18next.t("y_label", {ns: "airPassengers"}),
    getLabel: function() {
      return i18next.t("y_label", {ns: "airPassengers"});
    },
    getValue: function(d, key) {
      if (d[key]=== "x" || d[key]=== "..") {
        return undefined;
      } else return Number(d[key]) * 1.0/ 1000;
    },
    getTotal: function(d, index, data) {
      let total;
      let keys;
      const sett = this;

      if (!d[sett.y.totalProperty]) {
        keys = sett.z.getKeys.call(sett, data);
        total = 0;
        for (let k = 0; k < keys.length; k++) {
          total += sett.y.getValue.call(sett, d, keys[k], data);
        }
        d[sett.y.totalProperty] = total;
      }
      return (isNaN(Number(d[sett.y.totalProperty]))? 0:Number(d[sett.y.totalProperty]) *1.0/1000);
    },
    getText: function(d, key) {
      return isNaN(Number(d[key]))? d[key]: Number(d[key]) * 1.0/ 1000;
    },
    ticks: 5,
    tickSizeOuter: 0
  },

  z: {
    label: i18next.t("z_label", {ns: "airPassengers"}),
    getId: function(d) {
      if (d.key !== "flag" && d.key !== "isCopy") {
        return d.key;
      }
    },
    getKeys: function(object) {
      const sett = this;
      const keys = Object.keys(object[0]);
      // remove unwanted keys
      keys.splice(keys.indexOf("date"), 1);
      if (keys.indexOf("flag") !== -1) { // temporary key to be removed
        keys.splice(keys.indexOf("flag"), 1);
      }
      if (keys.indexOf("isCopy") !== -1) { // temporary key to be removed
        keys.splice(keys.indexOf("isCopy"), 1);
      }

      if (keys.indexOf(sett.y.totalProperty) !== -1) {
        keys.splice(keys.indexOf(sett.y.totalProperty), 1);
      }
      return keys;
      // return keys.sort();
      // return ["local", "Remaining_local", "itinerant", "Remaining_itinerant"];
    },
    origData: function(data) {
      return baseDateFilter(data);
    },
    getClass: function(...args) {
      return this.z.getId.apply(this, args);
    },
    getText: function(d) {
      return i18next.t(d.key, {ns: "airPassengers"});
    }
  },
  datatable: true,
  dataTableTotal: true, // show total in data table
  areaTableID: "areaTable",
  // summaryId: "chrt-dt-tbl",
  transition: true,
  width: 1050
};
const baseDateFilter = function(data) {
  const minDate = new Date("2010");
  const newData = [];
  for (let s = 0; s < data.length; s++) {
    const date = new Date(data[s].date);
    if (date >= minDate) {
      newData.push(data[s]);
    }
  }

  return newData;
};
