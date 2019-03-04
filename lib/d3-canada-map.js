/* exported getCanadaMap */
this.getCanadaMap = function(svg, settings) {
  const canadaLayer = svg.append("g")
      .attr("class", "canada-map");
  const dispatch = d3.dispatch("loaded", "zoom", "error");
  const onError = function(error) {
    if (error) {
      if (error instanceof Error) {
        return dispatch.call("error", rtnObj, error);
      } else if (error instanceof ProgressEvent) {
        return dispatch.call("error", rtnObj, new Error("Could not load the map file (" + error.target.status + " " + error.target.statusText + ")"));
      }
    }
  };
  const loadLayers = function() {
    const done = function() {
      dispatch.call("loaded", rtnObj);
    };
    const loadOtherLayers = function() {
      const q = d3.queue();
      const layerCallback = function(error, data) {
        onError(error);
        this.data = data;
        createAdditionalLayer(this);
      };
      let l;
      let layer;

      for (l = 0; l < settings.additonalLayers.length; l++) {
        layer = settings.additonalLayers[l];
        if (layer.data) {
          createAdditionalLayer(layer);
        } else if (layer.url) {
          q.defer(d3.json, layer.url, layerCallback.bind(layer));
        }
      }
      q.await(done);
    };


    let cb = done;

    if (settings.additonalLayers && settings.additonalLayers.length > 0) {
      cb = loadOtherLayers;
    }

    if (typeof settings.baseMap === "object") {
      createBaseMap(settings.baseMap, cb);
    } else {
      d3.json(settings.baseMap, function(error, data) {
        onError(error);
        createBaseMap(data, cb);
      });
    }
  };
  const zoom = function(province) {
    const getRatio = function(bBox) {
      return bBox.width * 1.0 / bBox.height;
    };
    const getbBoxCorrected = function(origin, reference) {
      const newbBox = {
        x: origin.x,
        y: origin.y,
        width: origin.width,
        height: origin.height
      };
      const originRatio = getRatio(origin);
      const referenceRatio = getRatio(reference);
      let newValue;
      let oldValue;
      if (originRatio > referenceRatio) {
        // Origin bounding box is wider than reference
        newValue = origin.width / referenceRatio;
        oldValue = origin.height;
        newbBox.height = newValue;
        newbBox.y = origin.y - (newValue - oldValue) / 2;
      } else if (originRatio < referenceRatio) {
        // Origin bounding box is higher than reference
        newValue = origin.height * referenceRatio;
        oldValue = origin.width;
        newbBox.width = newValue;
        newbBox.x = origin.x - (newValue - oldValue) / 2;
      }
      return newbBox;
    };
    const transition = d3.transition()
        .duration(1000);
    let boundingBox;
    let provincePath;

    this.svg.selectAll(".zoomed").classed("zoomed", false);

    if (province) {
      if (this.provinces[province]._bBoxCorrected) {
        provincePath = this.provinces[province].obj;
        boundingBox = this.provinces[province]._bBoxCorrected;
      } else {
        provincePath = this.provinces[province].obj = this.svg.select("." + province);
        this.provinces[province]._bBox = (provincePath.node().getBBox());
        boundingBox = this.provinces[province]._bBoxCorrected = getbBoxCorrected(this.provinces[province]._bBox, this._bBox);
      }
      provincePath.classed("zoomed", true);
      this.obj.classed("zoomed", true);
    } else {
      boundingBox = this._bBox;
      if (svg.node().msContentZoomFactor && svg.attr("height") === null) {
        svg.attr("height", boundingBox.height + boundingBox.x);
      }
    }
    svg.transition(transition).attr("viewBox", [boundingBox.x - 10, boundingBox.y - 10, boundingBox.width + 20, boundingBox.height + 20].join(" "))
        .on("end", function() {
          dispatch.call("zoom", this, province);
        });
  };
  const createBaseMap = function(canada, cb) {
    const provinces = (settings.getProvinces || function() {
      const keys = Object.keys(canada.objects);
      const prReturn = {};
      let k;
      let key;
      let root;

      if (keys.length > 1) {
        for (k = 0; k < keys.length; k++) {
          key = keys[k];
          prReturn[key.substr(-2)] = canada.objects[key];
        }
      } else if (keys.length === 1) {
        root = canada.objects[keys[0]].geometries;

        for (k = 0; k < root.length; k++) {
          key = root[k].properties.PRCODE;

          prReturn[key.substr(-2)] = root[k];
        }
      }
      return prReturn;
    })(canada);
    try {
      const provincesKeys = Object.keys(provinces);
      let p;
      let provinceKey;

      for (p = 0; p < provincesKeys.length; p += 1) {
        provinceKey = provincesKeys[p];

        if (!settings.provinces || settings.provinces.indexOf(provinceKey) !== -1) {
          canadaLayer.append("path")
              .datum(topojson.feature(canada, provinces[provinceKey]))
              .attr("class", provinceKey)
              .attr("d", path);

          rtnObj.provinces[provinceKey] = {
            zoom: zoom.bind(rtnObj, provinceKey)
          };
        }
      }

      rtnObj.obj = canadaLayer;
      rtnObj._bBox = canadaLayer.node().getBBox();
      rtnObj.zoom = zoom.bind(rtnObj);

      rtnObj.zoom();

      if (cb && typeof cb === "function") {
        cb();
      }
    } catch (e) {
      return dispatch.call("error", rtnObj, e);
    }
  };
  const createAdditionalLayer = function(layer) {
    const layerGroup = svg.append("g")
        .attr("class", layer.name);
    const features = layer.getObjects(layer.data);
    let f;

    for (f = 0; f < features.length; f++) {
      layerGroup.append("path")
          .datum(topojson.feature(layer.data, features[f]))
          .attr("d", path)
          .attr("class", layer.getClass ? layer.getClass(features[f]) : "");
    }
  };
  settings = settings || {};

  const rtnObj = {
    settings: settings,
    svg: svg,
    provinces: {},
    on: function(event, fn) {
      dispatch.on(event, fn);
      return this;
    }
  };

  if (settings.provinces && typeof settings.provinces === "string") {
    settings.provinces = [settings.provinces];
  }

  if (!settings.baseMap) {
    settings.baseMap = "data/canada.json";
  }

  const projection = settings.projection = settings.projection ||
  d3.geoTransverseMercator()
      .rotate([95, 0]);
  const path = d3.geoPath()
      .projection(projection);
  loadLayers();
  return rtnObj;
};
