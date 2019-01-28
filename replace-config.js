/* eslint no-unused-vars: 0 */
/* eslint-env node */
module.exports = {
  files: "dist/*.html",
  from: [
    / type="module"/g,
    /(.*)\/index.js/g
  ],
  to: [
    "",
    "$1.js"
  ]
};
