const map = d3.select(".dashboard .map")
    .append("svg");
const heading = d3.select(".dashboard h4");
const canada = window.getCanadaMap(map, {})
    .on("loaded", function() {
      window.console.log("loaded");
    });
