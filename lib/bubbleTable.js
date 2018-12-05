(function(extend) {
  const defaults = {
    margin: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 90
    },
    aspectRatio: 16 / 9,
    x: {
      getDomain: function(flatData) {
        if (!this.x.type || this.x.type === "ordinal") {
          return d3.set(flatData, (...args) => {
            return this.x.getValue.apply(this, args);
          }).values();
        }
        return d3.extent(flatData, this.x.getValue.bind(this));
      },
      getRange: function(d, domain) {
        if (!this.x.type || this.x.type === "ordinal") {
          const arr = [];
          for (let x = 0; x < domain.length; x++) {
            arr.push(x * this.innerWidth / domain.length);
          }
          return arr;
        }
        return [0, this.innerWidth];
      },
      getDeltaX: function(flatData) {
        if (!this.x.type || this.x.type === "ordinal") {
          const thisList = d3.set(flatData, (...args) => {
            return this.x.getValue.apply(this, args);
          }).values();
          return thisList[1];
        }
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
        return [
          d3.min(flatData, this.r.getValue.bind(this)),
          d3.max(flatData, this.r.getValue.bind(this))
        ];
      },
      getRange: function(flatData) {
        const maxRange = d3.max(flatData, this.r.getValue.bind(this));
        const minRange = (this.r.minSizeZero === true) ? 0 : 1;
        return (this.r.ascending === true) ? [maxRange, minRange] : [minRange, maxRange];
      }
    },
    width: 990
  };

  this.bubbleTable = function(svg, settings, data) {
    // console.log("data in here: ", data); //format as in json file
    const mergedSettings = extend(true, {}, defaults, settings);
    const outerWidth = mergedSettings.width;
    const outerHeight = Math.ceil(outerWidth / mergedSettings.aspectRatio);
    const innerWidth = mergedSettings.innerWidth = outerWidth - mergedSettings.margin.left - mergedSettings.margin.right;
    let chartInner = svg.select("g.margin-offset");
    let dataLayer = chartInner.select(".data");
    let xAxisObj = chartInner.select(".x.axis");

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
      const xScale = (() => {
        switch (sett.x.type) {
          case "linear":
            return d3.scaleLinear();
          case "time":
            return d3.scaleTime();
          default:
            return d3.scaleOrdinal();
        }
      })();
      const xDomain = sett.x.getDomain.call(sett, flatData);
      const rDomain = sett.r.getDomain.call(sett, flatData);

      // Mapping for x-coord of table based on year
      x = xScale
          .domain(xDomain)
          .range(sett.x.getRange.call(sett, flatData, xDomain));

      // Mapping for z-coord of table based on id
      z = d3.scaleLinear()
          .domain(sett.z.getDomain.call(sett, filteredData))
          .range(sett.z.getRange.call(sett, filteredData));

      // Mapping for circle radius based on rank
      r = d3.scaleSqrt()
          .domain(sett.r.getDomain.call(sett, flatData))
          .range(sett.r.getRange.call(sett, flatData));

      const deltaX = x(sett.x.getDeltaX.call(sett, flatData));
      const deltaZ = z(1); // because z is always a row number

      console.log("rDomain: ", rDomain)
      console.log("deltaX: ", deltaX)
      console.log("deltaZ: ", deltaZ)

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
          .attr("class", sett.z.getId.bind(sett))
          .attr("transform", function(...args) {
            // console.log("this: ", this)
            // console.log("args: ", args)
            const zVal = z(sett.z.getValue.apply(this, args));
            // console.log("zVal: ", zVal)
            console.log("r(minRank): ", r(rDomain[0]))
            return `translate(0, ${zVal})`;
          })
          .each(function(...dArgs) { // d is each z
            const group = d3.select(this);

            const bubbles = group.selectAll(".bubble")
                .data(sett.z.getDataPoints.apply(this, dArgs));

            bubbles
                .enter()
                .append("g")
                .attr("class", "bubble")
                .attr("transform", function(...args) { // d is each point
                  console.log("inside: ", sett.x.getValue.apply(this, args))
                  const xVal = x(sett.x.getValue.apply(this, args));
                  console.log("xVal: ", xVal)
                  return `translate(${xVal}, 0)`;
                })
                .append("circle")
                .attr("r", function(...args) {
                  return r(sett.r.getValue.apply(sett, args));
                });
          });

      // Add col labels
      if (xAxisObj.empty()) {
        xAxisObj = chartInner.append("g")
            .attr("transform", "translate(0," + 0 + ")");

        xAxisObj
            .append("text")
            .attr("class", "chart-label")
            .attr("fill", "#000")
            .attr("x", innerWidth)
            .attr("dy", "-0.5em")
            .attr("text-anchor", "end")
            .text(sett.x.label);
      } else {
        xAxisObj.select("text").text(settings.x.label);
      }
      xAxisObj.call(
          d3.axisTop(x)
              .ticks(sett.x.ticks)
              .tickFormat(sett.x.getTickText ? sett.x.getTickText.bind(sett) : null)
      );


      bubbleGroups
          .exit()
          .remove();
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
