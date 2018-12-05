(function(extend) {
  const defaults = {
    margin: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 90
    },
    aspectRatio: 990 / 260,
    x: {
      getDomain: function(flatData) {
        return d3.extent(flatData, this.x.getValue.bind(this));
      },
      getRange: function() {
        return [0, this.innerWidth];
      }
    },
    z: {
      getDomain: function(data) {
        return [0, data.length];
      },
      getRange: function() {
        return [0, this.innerHeight];
      },
      getValue: function(d, i) {
        return i;
      }
    },
    r: {
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
    const innerWidth = mergedSettings.innerWidth = outerWidth - mergedSettings.margin.left - mergedSettings.margin.right;
    let chartInner = svg.select("g.margin-offset");
    let dataLayer = chartInner.select(".data");

    mergedSettings.innerHeight = outerHeight - mergedSettings.margin.top - mergedSettings.margin.bottom;

    const transition = d3.transition()
        .duration(1000);

    const draw = function() {
      const sett = this.settings;
      const filteredData = (sett.filterData && typeof sett.filterData === "function") ?
        sett.filterData.call(sett, data) : data;
      const flatData = [].concat(...filteredData.map(function(d) {
        return sett.z.getDataPoints.call(sett, d);
      }));
      const labelX = innerWidth - 6;
      const getXScale = function() {
        return d3.scaleTime();
      };
      const labelY = function(d) {
        return y((d[d.length - 1][0] + d[d.length - 1][1]) / 2);
      };

      let labels;

      // Mapping for x-coord of table based on year
      x = d3.scaleLinear()
          .domain(sett.x.getDomain.call(sett, flatData))
          .range(sett.x.getRange.call(sett, flatData));

      // Mapping for z-coord of table based on id
      z = d3.scaleLinear()
          .domain(sett.z.getDomain.call(sett, filteredData))
          .range(sett.z.getRange.call(sett, filteredData));

      // Mapping for circle radius based on rank
      r = d3.scaleSqrt()
          .domain(sett.r.getDomain.call(sett, flatData))
          .range(sett.r.getRange.call(sett, flatData));

      if (dataLayer.empty()) {
        dataLayer = chartInner.append("g")
            .attr("class", "data");
      }

      const bubbleGroups = dataLayer.selectAll(".bubble-group")
          .data(filteredData, sett.z.getId.bind(sett));

      bubbleGroups
          .enter()
          .append("g")
          .attr("id", sett.z.getId.bind(sett))
          .each(function(...dArgs) { //d ies each z
            console.log("dArgs: ", dArgs)
            const group = d3.select(this);

            const bubbles = group.selectAll(".bubble")
                .data(sett.z.getDataPoints.apply(this, dArgs));

            bubbles
                .enter()
                .append("g")
                .attr("class", "bubble")
                .attr("transform", function(...args) { //d is each point
                  const xVal = x(sett.x.getValue.apply(this, args));
                  const zVal = z(sett.x.getValue.apply(this, args));
                  return `translate(${xVal},${dArgs[1] * 20})`;
                })
                .append("circle")
                .attr("r", 5);
          });

      bubbleGroups
          .exit()
          .remove();

      /*const bubblesEnter = bubbles
          .enter()

          .attr("class", "bubble")
          .attr("transform", function(...args) {
            const xVal = x(sett.x.getValue.apply(this, args));
            const zVal = z(sett.x.getValue.apply(this, args));
            console.log(args, sett.x.getValue.apply(this, args),sett.x.getValue.apply(this, args))
            return `(${xVal},${zVal})`;
          });

      bubblesEnter.append("circ")*/
    };
    const clear = function() {
      dataLayer.remove();
    };

    let x;
    let z;
    let r;

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

    const process = function() {
      draw.apply(rtnObj);
      d3.stcExt.addIEShim(svg, outerHeight, outerWidth);
    };

    if (data === undefined) {
      d3.json(mergedSettings.url, function(error, xhr) {
        data = xhr;
        console.log("xhr: ", xhr);
        process();
      });
    } else {
      process();
    }

    return rtnObj;
  };
})(jQuery.extend, jQuery);
