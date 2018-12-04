(function(extend) {
  const defaults = {
    margin: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 90
    },
    aspectRatio: 990/260,
    x: {
      getDomain: function(flatData) {
        return d3.extent(flatData, this.x.getValue.bind(this));
      },
      getRange: function() {
        return [0, this.innerWidth];
      }
    },
    y: {
      getDomain: function(flatData) {
        const min = d3.min(flatData, this.y.getValue.bind(this));
        return [
            min > 0 ? 0 : min,
            d3.max(flatData, this.y.getValue.bind(this))
        ];
      },
      getRange: function() {
        return [innerHeight, 0];
      }
    },
    width: 990
  };

  this.bubbleTable = function(svg, settings, data) {
    console.log("-------------------------------------------------------------------");
    // console.log("data in here: ", data); //format as in json file
    const mergedSettings = extend(true, {}, defaults, settings);
    const outerWidth = mergedSettings.width;
    const outerHeight = Math.ceil(outerWidth / mergedSettings.aspectRatio);
    const innerHeight = mergedSettings.innerHeight = outerHeight - mergedSettings.margin.top - mergedSettings.margin.bottom;
    const innerWidth = mergedSettings.innerWidth = outerWidth - mergedSettings.margin.left - mergedSettings.margin.right;
    let chartInner = svg.select("g.margin-offset");
    let dataLayer = chartInner.select(".data");

    const transition = d3.transition()
        .duration(1000);

    const draw = function() {
      console.log("draw sett: ", this.settings);
      console.log("data: ", data);

      const sett = this.settings;
      let filteredData = (sett.filterData && typeof sett.filterData === "function") ?
          sett.filterData.call(sett, data) : data;
      const flatData = [].concat(...filteredData.map(function(d) {
        console.log("d in filteredData: ", d);
        return sett.z.getDataPoints.call(sett, d);
      }));
      const labelX = innerWidth - 6;
      const getXScale = function() {
        return d3.scaleTime();
      };
      const labelY = function(d) {
        return y((d[d.length - 1][0] + d[d.length - 1][1]) / 2);
      };

      let cor;
      let labels;
      let size;

      console.log("flatData: ", flatData);
      console.log("flatData.year: ", flatData.map(item => item.year));
      console.log("x getRange: ", sett.x.getRange.call(sett, flatData.map(item => item.year)));

      const xExtrema =  sett.x.getRange.call(sett, flatData.map(item => item.year));
      const x = d3.scaleLinear()
          .domain(xExtrema)
          // .domain([1997,2017])
          .range([0, innerWidth]);

      const yExtrema =  sett.y.getRange.call(sett, flatData.map(item => item.rank));
      const y = d3.scaleLinear()
          .domain(yExtrema)
          // .domain([0,20])
          .range([0, innerHeight]);

      // Create a size scale for bubbles on top right. Watch out: must be a rootscale!
      size = d3.scaleSqrt()
          .domain([0, 1])
          .range([0, 5]); //******HOW TO SET FROM DATA?????????

      if (dataLayer.empty()) {
        dataLayer = chartInner.append("g")
          .attr("class", "data");
      }

      // cor = dataLayer.selectAll(".area")
      //   .data(stackData, sett.z.getId.bind(sett));
      // Create one 'g' element for each cell of the bubbleTable
      cor = dataLayer
        .selectAll(".cor")
        .data(data.rank)
        .enter()
        .append("g")
          .attr("class", "cor")
          .attr("transform", function(d) {
            let ycoord;
            if (d.type === "total") ycoord = 40;
            else if (d.type === "itinerant") ycoord = 40 + 80;
            else if (d.type === "local") ycoord = 40 + 2*80;
            return "translate(" + x(d.year) + "," + ycoord + ")";
          });

        //Add circles
        cor
          .append("circle")
            .attr("class", function(d) {
              return "rank_" + d.type;
            })
          .attr("r", function(d){
            return size(Math.abs(d.value));
          });

        //Show column title
        cor
          .append("text")
          .attr("dx", function(d){

            if (d.type === "total") return -18;
          })
          .attr("dy", function(d){
            if (d.type === "total") return -30;
          })
          .attr("class", "rank_yr")
          .text(function(d,i){
            if (d.type === "total") return d.year;
          });

          //label rows by type
          cor
            .append("text")
            .attr("dx", function(d){
              return -85;
            })
            .attr("dy", function(d){
              return size(d.value)/2; //4;
            })
            .attr("class", "rank_type")
            .text(function(d){
              if (d.year === 1997) return i18next.t(d.type, {ns: "area"});
            });

          //label circle by value
          cor.append("text")
            .attr("dx", function(d){
              // console.log("d: ", d)
              // console.log("size value: ", size(d.value))
              // console.log("x d.year: ", x(d.year))
              if (d.value < 10) return 0 - size(d.value)/2 + 3;
              else return 0 - size(d.value)/2;
            })
            .attr("dy", function(d){
              return size(d.value)/2;
            })
            .attr("class", "rank_value")
            .text(function(d,i){
              return d.value;
            });


      // cor
      //   .transition(transition)
      //   .attr("d", area);

      cor
        .exit()
          .remove();




      // labels = dataLayer.selectAll(".label");
      // labels
      //   .data(stackData)
      //   .enter()
      //   .append("text")
      //     .text(function (d) {
      //       return sett.z.getText.bind(sett)(d);
      //     })
      //     .attr("aria-hidden", "true")
      //     .attr("class", "area-label")
      //     .attr("fill", "#000")
      //     .attr("x", labelX)
      //     .attr("y", labelY)
      //     .attr("dy", "1em")
      //     .attr("text-anchor", "end");

      // labels
      //   .transition(transition)
      //   .attr("y", labelY);

      // labels
      //   .exit()
      //     .remove();
    };
    let clear = function() {
      dataLayer.remove();
    };

    let x;
    let y;
    let process;

    const rtnObj = {
      settings: mergedSettings,
      clear: clear,
      svg: svg
    };

    svg
        .attr("viewBox", "0 0 " + outerWidth + " " + outerHeight)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("role", "img")
        .attr("rank-label", mergedSettings.altText);

    if (chartInner.empty()) {
         chartInner = svg.append("g")
          .attr("class", "margin-offset")
          .attr("transform", "translate(" + mergedSettings.margin.left + "," + mergedSettings.margin.top + ")");
    }

  process = function() {
    draw.apply(rtnObj);
    d3.stcExt.addIEShim(svg, outerHeight, outerWidth);
  };

  if (data === undefined) {
    d3.json(mergedSettings.url, function(error, xhr) {
      data = xhr;
      console.log("xhr: ", xhr)
      process();
    });
  } else {
    process();
  }

  return rtnObj;
};

})(jQuery.extend, jQuery);
