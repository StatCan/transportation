export default {
  margin: {
    top: 18,
    right: 10,
    bottom: 30,
    left: 50
  },
  groupPadding: 0.2,
  barPadding: 0.1,
  aspectRatio: 16 / 9,
  x: {
    getDomain: function(data) {
      const sett = this;
      const keys = [];
      let i;
      let d;
      let x;

      for (i = 0; i < data.length; i++) {
        d = data[i];
        x = sett.x.getValue.call(sett, d);

        if (keys.indexOf(x) === -1) {
          keys.push(x);
        }
      }

      return keys;
    }
  },
  y: {
    getDomain: function(data) {
      let min = d3.min(data, this.y.getValue.bind(this));
      let max = d3.max(data, this.y.getValue.bind(this));

      if (min > 0) min = 0;
      if (max < 0) max = 0;

      if (this.showValues) {
        if (min < 0 ) min -= (max - min) * .09;
        if (max > 0 ) max += (max - min) * .06;
      }

      return [
        min,
        max
      ];
    }
  },
  z: {
    getDomain: function(data) {
      const sett = this;
      const keys = [];
      let i;
      let d;
      let x;

      for (i = 0; i < data.length; i++) {
        d = data[i];
        x = sett.z.getId.call(sett, d);

        if (keys.indexOf(x) === -1) {
          keys.push(x);
        }
      }

      return keys;
    }
  },
  width: 600
};
