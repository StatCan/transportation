export default {
  alt: i18next.t("alt", {ns: "modes"}),
  tableTitle: i18next.t("alt", {ns: "modes"}),
  margin: {
    top: 50,
    left: 80,
    bottom: 50
  },
  // creates variable d
  filterData: function(data) {
    return data; // array of objects
  },
  y: {
    getValue: function(d, key) {
      // d[key] can be string for Traveller Type, number for Count
      if (typeof d[key] === "string" || d[key] instanceof String) { // Traveller Type
        if (d.targetLinks[0]) { // empty only for first node
          // Land cases, parent is two levels up
          if (d.name === "USres_car" || d.name === "USres_bus" ||
              d.name === "USres_train" || d.name === "USres_other") {
            const parent = i18next.t("USres", {ns: "modes"});
            const child = i18next.t(d[key], {ns: "modes"});
            return parent + ", " + child;
          } else if (d.name === "cdnFromUS_car" || d.name === "cdnFromUS_bus" ||
              d.name === "cdnFromUS_train" || d.name === "cdnFromUS_other") {
            const parent = i18next.t("cdnFromUS", {ns: "modes"});
            const child = i18next.t(d[key], {ns: "modes"});
            return parent + ", " + child;
          } else {
          // All other cases, parent is in targetLinks[0].source.name
            const parent = i18next.t(d.targetLinks[0].source.name, {ns: "modes"});
            const child = i18next.t(d[key], {ns: "modes"});
            return parent + ", " + child;
          }
        } else { // targetLinks empty
          if (d.name === "cdnFromOther_land") { // special case
            const parent = i18next.t("cdnFromOther", {ns: "modes"});
            const child = i18next.t(d[key], {ns: "modes"});
            return parent + ", " + child;
          }
        }
        return i18next.t(d[key], {ns: "modes"}); // targetLinks empty (first node has no parent)
      } else return d[key]; // Number, not a string, do not pass through i18next
    }
  },
  z: {
    getId: function(d) {
      return d.name;
    },
    getKeys: function(object) {
      const sett = this;
      // const keys = Object.keys(object[0]);
      const keys = ["name", "value"];

      if (keys.indexOf(sett.y.totalProperty) !== -1) {
        keys.splice(keys.indexOf(sett.y.totalProperty), 1);
      }
      return keys;
    },
    getKeyText: function(key) {
      return i18next.t(key, {ns: "modes_sankey"});
    },
    getText: function(d) {
      return i18next.t(d.name, {ns: "modes"});
    }
  },
  datatable: true,
  tableTitle: "",
  width: 200
};
