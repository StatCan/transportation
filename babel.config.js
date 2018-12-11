/* eslint-env node */
module.exports = {
  "presets": [
    ["@babel/env", {
      "useBuiltIns": "usage",
      "debug": true
    }],
  ],
  "env": {
    "node": {
      "presets": [
        ["@babel/env", {
          "targets": {"node": 8},
          "useBuiltIns": "usage",
          "debug": true
        }],
      ],
    }
  },
  "plugins": ["@babel/plugin-proposal-object-rest-spread"]
};
