export default {
  tableTitle: i18next.t("alt", {ns: "modes"}),
  y: {
    getValue: function(d, key) {
      return d[key]; // Number, not a string, do not pass through i18next
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
      const source = i18next.t(d.source.name, {ns: "modes"});
      const target = i18next.t(d.target.name, {ns: "modes"});
      return `${source} -> ${target}`;
    }
  }
};
