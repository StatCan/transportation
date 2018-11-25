var map = d3.select(".dashboard .map")
	.append("svg"),
	heading = d3.select(".dashboard h4"),
	canada = window.getCanadaMap(map, {})
		.on("loaded", function() {
			window.console.log("loaded");
		})

// setInterval(function() {
// 	var provinces = Object.keys(canada.provinces),
// 		provincesLength = provinces.length,
// 		show = Math.floor(Math.random() * (provincesLength + 1)),
// 		province;

// 	if (show < provincesLength){
// 		province = provinces[show];
// 		canada.provinces[province].zoom();
// 	} else {
// 		canada.zoom();
// 	}
// }, 2000);