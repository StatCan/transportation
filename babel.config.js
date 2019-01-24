/* eslint-env node */
module.exports = {
  "presets": [
    ["@babel/env", {
      "useBuiltIns": "usage"
    }],
  ],
  "plugins": ["@babel/plugin-proposal-object-rest-spread"],
  "ignore": [
    /core-js/,
    /@babel\/runtime/
  ]
};
