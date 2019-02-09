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
    console.log("tableOnly filterData: ", data)
    console.log("data.nodes: ", data.nodes)
    return data.nodes; // array of objects
  },
  x: {
    // getValue: function(d) {
    //   console.log("x getValue d: ", d)
    //   return new Date(d.date + "-01");
    // },
    // getText: function(d) {
    //   console.log("x getText d: ", d)
    //   return d.date;
    // }
  },
  y: {
    getValue: function(d, key) {
      console.log("d: ", d)
      // if (d.targetLinks[0]) {
      //   console.log("d.targetLinks: ", d.targetLinks)
      //   console.log("d.targetLinks: ", d.targetLinks[0])
      //   console.log("d.targetLinks: ", d.targetLinks[0].source)
      //   console.log("d.targetLinks: ", d.targetLinks[0].source.name)
      // }
      console.log("key: ", key)
      console.log("d[key]: ", d[key])

      // d[key] can be string for Traveller Type, number for Count
      if (typeof d[key] === "string" || d[key] instanceof String) { // Traveller Type
        if (d.targetLinks[0]) { // not first node
          const parent = i18next.t(d.targetLinks[0].source.name, {ns: "modes"});
          const child = i18next.t(d[key], {ns: "modes"});
          console.log("parent: ", parent);
          console.log("child: ", child);
          return parent + ", " + child;
        } else if (d.name === "cdnFromOther_land") {
          const parent = i18next.t("cdnFromOther", {ns: "modes"});
          const child = i18next.t(d[key], {ns: "modes"});
          console.log("parent: ", parent);
          console.log("child: ", child);
          return parent + ", " + child;
        }
        return i18next.t(d[key], {ns: "modes"}); // first node has no parent
      } else return d[key];
    }
    // getTotal: function(d, index, data) {
    //   let total;
    //   let keys;
    //   const sett = this;
    //   if (!d[sett.y.totalProperty]) {
    //     keys = sett.z.getKeys.call(sett, data);
    //     total = 0;
    //     for (let k = 0; k < keys.length; k++) {
    //       total += sett.y.getValue.call(sett, d, keys[k], data);
    //     }
    //     d[sett.y.totalProperty] = total;
    //   }

    //   return d[sett.y.totalProperty];
    // },
    // getText: function(d, key) {
    //   if (typeof d[key] === "string" || d[key] instanceof String) {
    //     return d[key];
    //   } else return d[key];
    // }
  },
  z: {
    // label: i18next.t("z_label", {ns: "modes"}),
    // getId: function(d) {
    //   console.log("z getID d: ", d)
    //   return d.key;
    // },
    getKeys: function(object) {
      console.log("z getKeys object: ", object)
      const sett = this;
      // const keys = Object.keys(object[0]);
      const keys = ["name", "value"];
      console.log("z keys: ", keys)
      // console.log("z keys slice: ", Object.keys(object[0]).slice(1)); // exclude first key

      if (keys.indexOf(sett.y.totalProperty) !== -1) {
        keys.splice(keys.indexOf(sett.y.totalProperty), 1);
      }
      return keys;
    },
    // getClass: function(...args) {
    //   return this.z.getId.apply(this, args);
    // },
    getText: function(d) {
      return i18next.t(d.key, {ns: "modes"});
    }
  },
  datatable: true,
  width: 200
};
