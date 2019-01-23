export default function(rankedCommData, rankedCommNames, years, maxVal, count) {
  // ---------------------------------------
  // diplay-related
  const numPerPage = 5; // number of commodities to display per page
  const numCommodities = rankedCommNames.length;
  const numPages = Math.ceil(numCommodities/numPerPage);

  // Page counter display
  d3.select("#pageNum")
      .text(`Page ${count + 1}/${numPages}`);

  d3.select("#commgrid").select("svg").remove(); // clear for next display
  if (count >= numPages - 1) d3.select("#nextButton").classed("inactive", true);
  else d3.select("#nextButton").classed("inactive", false);
  const s0 = count*numPerPage;
  const s1 = (count + 1) * numPerPage;

  // ---------------------------------------
  // svg params
  // Adapted from: https://www.d3-graph-gallery.com/graph/correlogram_basic.html
  // Graph dimension
  const margin = {top: 20, right: 0, bottom: 20, left: 150};
  const width = 1230 - margin.left - margin.right;
  const height = 370 - margin.top - margin.bottom;

  // Create the svg area
  const svg = d3.select("#commgrid")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // ---------------------------------------
  // bubble table params

  // Create a color scale
  // var color = d3.scaleLinear()
  //   .domain([1, 5, 10])
  //   .range(["#B22222", "#fff", "#000080"]);

  // Create a size scale for bubbles on top right. Watch out: must be a rootscale!
  const size = d3.scaleSqrt()
      .domain([0, 1])
      .range([0, .1]);

  // X scale
  const x = d3.scaleLinear()
      .domain([2001, 2016])
      .range([0, width/1.1]);

  // var color = d3.scaleLinear()
  //   .domain([1, 5, 10])
  //   .range(["#B22222", "#fff", "#000080"]);

  // ---------------------------------------
  // Slice the data to diplay n commodities at a time
  let displayData = [];
  displayData = rankedCommData.filter((item) => rankedCommNames.slice(s0, s1).indexOf(item.y) != -1);
  console.log("displayData: ", displayData);

  // ---------------------------------------
  // Diplay slice
  // Create one 'g' element for each cell of the correlogram
  let comm0; let idx;
  let y0; let ycoord; let delta;
  const cor = svg.attr("class", "rankplot")
      .selectAll(".cor")
      .data(displayData)
      .enter()
      .append("g")
      .attr("class", "cor")
      .attr("transform", function(d, i) {
        if (i===0) {
          comm0 = d.y;
          idx = 0;
        }
        y0 = 40;
        delta = 2*size(maxVal); // 35;
        if (d.y !== comm0) {
          comm0 = d.y;
          if (i%years.length === 0) idx++; // only increment idx when i is divisible by the number of years
        }
        ycoord = y0 + idx*delta;

        return "translate(" + x(d.x) + "," + ycoord + ")";
      });

  // add circles
  cor
      .append("circle")
      .attr("class", function(d) {
        return "comm_gen";
      })
      .attr("r", function(d) {
        return size(Math.abs(d.value));
        // return size(Math.log( Math.abs(d.value)) );
      });

  // label columns by year
  cor.append("text")
      .attr("dx", function(d) {
        return -20;
      })
      .attr("dy", function(d) {
        return -30;
      })
      .attr("class", "comm_yr")
      .text(function(d) {
        if (d.y === rankedCommNames[s0]) return d.x;
      });

  // label rows by commdity name
  cor.append("text")
      .attr("dx", function(d) {
        return -150;
      })
      .attr("dy", function(d) {
        return 4;
      })
      .attr("class", "comm_type")
      .text(function(d) {
        if (d.x === "2001") return d.y;
      });

  // label circle by value
  cor.append("text")
      .attr("dx", function(d) {
        return -2;
      })
      .attr("dy", function(d) {
        return 4;
      })
      .attr("class", "comm_value")
      .text(function(d) {
        if (d.value === 0) return d.value;
      });
}
