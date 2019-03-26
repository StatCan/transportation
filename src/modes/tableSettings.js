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
      const fnum = (d.name === "USres_other") ? 1 : 2;
      const footnote = `<sup id='fn${fnum}-rf'><a class='fn-lnk' href='#fn1'><span class='wb-inv'>Footnote </span>1</a></sup>`;
      return (d.name.indexOf("other") !== -1) ? `${i18next.t(d.name, {ns: "modes"})}${footnote}` :
            i18next.t(d.name, {ns: "modes"});
    }
  }
};
