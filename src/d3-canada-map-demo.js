var map = d3.select(".dashboard .map")
	.append("svg"),
	heading = d3.select(".dashboard h2"),
	// canada = window.getCanadaMap(map, {
	canada = getCanadaMap(map)
		.on("loaded", function() {
			window.console.log("loaded");
		});

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


function drawMap() {

  //Map reset button
  // d3.select("#resetButton")
  //     .on("click", resetMap);



  //https://bl.ocks.org/mbostock/3711652
  // var mapHeight = 410;

  var options = [
    {name: "Natural Earth", projection: d3.geoNaturalEarth()}
  ];

  options.forEach(function(o) {      
    o.projection.rotate([0, 0]).center([40, 0]);
  });

  var projection = options[0]
              .projection
              .scale(151) //141, 171
              .translate([mapWidth/1.655, mapHeight/1.67  ]);  //1.633, 1.69

  var path = d3.geoPath()
      .projection(projection)
      .pointRadius([3]);  //radius of city circle

  var graticule = d3.geoGraticule();

  var svg = d3.select("#map").append("svg")
      .attr("width", mapWidth)
      .attr("height", mapHeight);

  var g = svg.append('g');

  //https://gist.github.com/wboykinm/eb7fe46178c8ec7b3bd2b92218c949a9
  g.append("path")
      .datum({type: "Sphere"})
      .attr("class", "sphere")
      .attr("d", path)
      .attr("fill", "#F4F7F7")
      .attr("stroke", "grey");
      
  g.append("path")
      .datum(graticule)
      .attr("class", "graticule")
      .attr("d", path);
 
  d3.json("geojson/world_countries.json", function(error, world) {
    if (error) throw error;
   
    d3.json("geojson/our_cities.geojson", function(error, cities) {
      if (error) throw error;
      console.log("cities: ", cities)

      //world countries
      // svg.append("g")
      countries = g.attr("class", "mapg")
        .selectAll("path")
          .data(world.features)
        .enter().append("path")
          .attr("d", path)
          .attr("id", function (d) {
            mapName = d.properties.name.replace(/\s/g, '_');
            return "map" + mapName;
          })
          .attr("class", "worldcountry")
          .style("fill", countryColour)
          .style('stroke', '#555')  //#555
          .style('stroke-width', 1.5)
          // tooltips
            .style('stroke-width', 1);
            // .on('mouseover',function (d) {
            //   //tip.show(d);
            //   d3.select(this)
            //     // .style("opacity", 1)
            //     .style("stroke","#CBBF31")
            //     .style("stroke-width",3);
            // })
            // .on('mouseout', function (d) {
            //   // tip.hide(d);
            //   //highlightElements(idName, d.country);
            //   d3.select(this)
            //     // .style("opacity", 0.8)
            //     .style("stroke","white")
            //     .style("stroke-width",0.3);
            // });
     
      
      // City markers from geojson file     
      //svg.selectAll('path')
      cities = g.selectAll("path")
          .data(cities.features)
          .enter().append('path')
          .attr('d', path)
          .attr("id", function (d, i) {
            return "city" + format_idName(d.id);
          })
          .attr("class", "worldcity")
          .attr("r", 10)
          .style("fill", function (d) {
            // if (d.id === "Cleveland") console.log("cleveland: ", d)
            // if (data_GHG.find(x => x.city === d.id)) {
            //   console.log("x in fill: ", d)
            //   console.log("x.id in fill: ", d.id)
            //   console.log("find: ", data_GHG.find(x => x.city === d.id))
            // }

            //does not work in IE
            //if (data_GHG.find(x => x.city === d.id)) {
              // var r = regionDict[data_GHG.find(x => x.city === d.id).region]
            //}
            var cityMatch = d.id;
            var r = data_GHG.filter(function (d) { return d.city === cityMatch })[0];

            if (r) {              
              return regionColourMap[regionDict[r.region]];
            }
            else return "none";            

          })
          .style("stroke", function (d) {
            //does not work in IE
            // if (data_GHG.find(x => x.city === d.id)) return "#555";
            var cityMatch = d.id;
            if (data_GHG.filter(function (d) { return d.city === cityMatch })[0]) {
              return "#555";
            }
            else return "none";  
          })
          .on("mouseover", function (d) {
            highlightElements(format_idName(d.properties.city));
          })
          .on('mouseout', function (d) {
            resetElements();
          });



    }); // ./inner d3.json
  }); // ./outer d3.json


} // ./drawMap()