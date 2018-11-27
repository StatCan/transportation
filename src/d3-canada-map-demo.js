// var map = d3.select(".dashboard .map")
// 	.append("svg"),
// 	pathGenerator = 
// 	heading = d3.select(".dashboard h4"),
// 	canada = window.getCanadaMap(map, {})
// 		.on("loaded", function() {
// 			mapObj = this;
// 			d3.json("geojson/testairport.geojson", function(error, airports) {
// 			      if (error) throw error;
// 			      console.log("airports: ", airports)

// 			      var airportGroup = map.append("g");
// 			      var path = d3.geoPath().projection(mapObj.settings.projection);

// 			      airportPoints = airportGroup.selectAll("path")
// 			          .data(airports.features)
// 			          .enter().append('path')
// 			          .attr('d', path)
// 			          .attr("id", function (d, i) {
// 			            return "airport" + d.id;
// 			          })
// 			          .attr("class", "airport")
// 			          .attr("r", 10)
// 			          .style("fill", "red")
// 			           .on("mouseover", function (d) {
// 				            //change area chart title to match selected province
//     						d3.select(".dashboard h4").text(i18next.t("ON" + " and contribution from airport YYZ", {ns: "provinces"}));

//     						showAirport();
// 				        });
// 			        });

// 		});



var map = d3.select(".dashboard .map")
	.append("svg"),
	heading = d3.select(".dashboard h4"),
	canada = window.getCanadaMap(map, {})
		.on("loaded", function() {
			window.console.log("loaded");
})