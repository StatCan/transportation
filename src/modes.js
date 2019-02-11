(function () {
	'use strict';

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var _global = createCommonjsModule(function (module) {
	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self
	  // eslint-disable-next-line no-new-func
	  : Function('return this')();
	if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
	});

	var _core = createCommonjsModule(function (module) {
	var core = module.exports = { version: '2.6.3' };
	if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
	});
	var _core_1 = _core.version;

	var _isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	var _anObject = function (it) {
	  if (!_isObject(it)) throw TypeError(it + ' is not an object!');
	  return it;
	};

	var _fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (e) {
	    return true;
	  }
	};

	// Thank's IE8 for his funny defineProperty
	var _descriptors = !_fails(function () {
	  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
	});

	var document$1 = _global.document;
	// typeof document.createElement is 'object' in old IE
	var is = _isObject(document$1) && _isObject(document$1.createElement);
	var _domCreate = function (it) {
	  return is ? document$1.createElement(it) : {};
	};

	var _ie8DomDefine = !_descriptors && !_fails(function () {
	  return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
	});

	// 7.1.1 ToPrimitive(input [, PreferredType])

	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	var _toPrimitive = function (it, S) {
	  if (!_isObject(it)) return it;
	  var fn, val;
	  if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
	  if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
	  if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var dP = Object.defineProperty;

	var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
	  _anObject(O);
	  P = _toPrimitive(P, true);
	  _anObject(Attributes);
	  if (_ie8DomDefine) try {
	    return dP(O, P, Attributes);
	  } catch (e) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var _objectDp = {
		f: f
	};

	var _propertyDesc = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var _hide = _descriptors ? function (object, key, value) {
	  return _objectDp.f(object, key, _propertyDesc(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var hasOwnProperty = {}.hasOwnProperty;
	var _has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var id = 0;
	var px = Math.random();
	var _uid = function (key) {
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

	var _redefine = createCommonjsModule(function (module) {
	var SRC = _uid('src');
	var TO_STRING = 'toString';
	var $toString = Function[TO_STRING];
	var TPL = ('' + $toString).split(TO_STRING);

	_core.inspectSource = function (it) {
	  return $toString.call(it);
	};

	(module.exports = function (O, key, val, safe) {
	  var isFunction = typeof val == 'function';
	  if (isFunction) _has(val, 'name') || _hide(val, 'name', key);
	  if (O[key] === val) return;
	  if (isFunction) _has(val, SRC) || _hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
	  if (O === _global) {
	    O[key] = val;
	  } else if (!safe) {
	    delete O[key];
	    _hide(O, key, val);
	  } else if (O[key]) {
	    O[key] = val;
	  } else {
	    _hide(O, key, val);
	  }
	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, TO_STRING, function toString() {
	  return typeof this == 'function' && this[SRC] || $toString.call(this);
	});
	});

	var _aFunction = function (it) {
	  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
	  return it;
	};

	// optional / simple context binding

	var _ctx = function (fn, that, length) {
	  _aFunction(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	var PROTOTYPE = 'prototype';

	var $export = function (type, name, source) {
	  var IS_FORCED = type & $export.F;
	  var IS_GLOBAL = type & $export.G;
	  var IS_STATIC = type & $export.S;
	  var IS_PROTO = type & $export.P;
	  var IS_BIND = type & $export.B;
	  var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] || (_global[name] = {}) : (_global[name] || {})[PROTOTYPE];
	  var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
	  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
	  var key, own, out, exp;
	  if (IS_GLOBAL) source = name;
	  for (key in source) {
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    // export native or passed
	    out = (own ? target : source)[key];
	    // bind timers to global for call from export context
	    exp = IS_BIND && own ? _ctx(out, _global) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
	    // extend global
	    if (target) _redefine(target, key, out, type & $export.U);
	    // export
	    if (exports[key] != out) _hide(exports, key, exp);
	    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
	  }
	};
	_global.core = _core;
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library`
	var _export = $export;

	var toString = {}.toString;

	var _cof = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	// fallback for non-array-like ES3 and non-enumerable old V8 strings

	// eslint-disable-next-line no-prototype-builtins
	var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
	  return _cof(it) == 'String' ? it.split('') : Object(it);
	};

	// 7.2.1 RequireObjectCoercible(argument)
	var _defined = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on  " + it);
	  return it;
	};

	// 7.1.13 ToObject(argument)

	var _toObject = function (it) {
	  return Object(_defined(it));
	};

	// 7.1.4 ToInteger
	var ceil = Math.ceil;
	var floor = Math.floor;
	var _toInteger = function (it) {
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

	// 7.1.15 ToLength

	var min = Math.min;
	var _toLength = function (it) {
	  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

	// 7.2.2 IsArray(argument)

	var _isArray = Array.isArray || function isArray(arg) {
	  return _cof(arg) == 'Array';
	};

	var _library = false;

	var _shared = createCommonjsModule(function (module) {
	var SHARED = '__core-js_shared__';
	var store = _global[SHARED] || (_global[SHARED] = {});

	(module.exports = function (key, value) {
	  return store[key] || (store[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: _core.version,
	  mode: _library ? 'pure' : 'global',
	  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
	});
	});

	var _wks = createCommonjsModule(function (module) {
	var store = _shared('wks');

	var Symbol = _global.Symbol;
	var USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function (name) {
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
	};

	$exports.store = store;
	});

	var SPECIES = _wks('species');

	var _arraySpeciesConstructor = function (original) {
	  var C;
	  if (_isArray(original)) {
	    C = original.constructor;
	    // cross-realm fallback
	    if (typeof C == 'function' && (C === Array || _isArray(C.prototype))) C = undefined;
	    if (_isObject(C)) {
	      C = C[SPECIES];
	      if (C === null) C = undefined;
	    }
	  } return C === undefined ? Array : C;
	};

	// 9.4.2.3 ArraySpeciesCreate(originalArray, length)


	var _arraySpeciesCreate = function (original, length) {
	  return new (_arraySpeciesConstructor(original))(length);
	};

	// 0 -> Array#forEach
	// 1 -> Array#map
	// 2 -> Array#filter
	// 3 -> Array#some
	// 4 -> Array#every
	// 5 -> Array#find
	// 6 -> Array#findIndex





	var _arrayMethods = function (TYPE, $create) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  var create = $create || _arraySpeciesCreate;
	  return function ($this, callbackfn, that) {
	    var O = _toObject($this);
	    var self = _iobject(O);
	    var f = _ctx(callbackfn, that, 3);
	    var length = _toLength(self.length);
	    var index = 0;
	    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
	    var val, res;
	    for (;length > index; index++) if (NO_HOLES || index in self) {
	      val = self[index];
	      res = f(val, index, O);
	      if (TYPE) {
	        if (IS_MAP) result[index] = res;   // map
	        else if (res) switch (TYPE) {
	          case 3: return true;             // some
	          case 5: return val;              // find
	          case 6: return index;            // findIndex
	          case 2: result.push(val);        // filter
	        } else if (IS_EVERY) return false; // every
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
	  };
	};

	var _strictMethod = function (method, arg) {
	  return !!method && _fails(function () {
	    // eslint-disable-next-line no-useless-call
	    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
	  });
	};

	var $filter = _arrayMethods(2);

	_export(_export.P + _export.F * !_strictMethod([].filter, true), 'Array', {
	  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
	  filter: function filter(callbackfn /* , thisArg */) {
	    return $filter(this, callbackfn, arguments[1]);
	  }
	});

	var dP$1 = _objectDp.f;
	var FProto = Function.prototype;
	var nameRE = /^\s*function ([^ (]*)/;
	var NAME = 'name';

	// 19.2.4.2 name
	NAME in FProto || _descriptors && dP$1(FProto, NAME, {
	  configurable: true,
	  get: function () {
	    try {
	      return ('' + this).match(nameRE)[1];
	    } catch (e) {
	      return '';
	    }
	  }
	});

	var $sort = [].sort;
	var test = [1, 2, 3];

	_export(_export.P + _export.F * (_fails(function () {
	  // IE8-
	  test.sort(undefined);
	}) || !_fails(function () {
	  // V8 bug
	  test.sort(null);
	  // Old WebKit
	}) || !_strictMethod($sort)), 'Array', {
	  // 22.1.3.25 Array.prototype.sort(comparefn)
	  sort: function sort(comparefn) {
	    return comparefn === undefined
	      ? $sort.call(_toObject(this))
	      : $sort.call(_toObject(this), _aFunction(comparefn));
	  }
	});

	var quot = /"/g;
	// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
	var createHTML = function (string, tag, attribute, value) {
	  var S = String(_defined(string));
	  var p1 = '<' + tag;
	  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
	  return p1 + '>' + S + '</' + tag + '>';
	};
	var _stringHtml = function (NAME, exec) {
	  var O = {};
	  O[NAME] = exec(createHTML);
	  _export(_export.P + _export.F * _fails(function () {
	    var test = ''[NAME]('"');
	    return test !== test.toLowerCase() || test.split('"').length > 3;
	  }), 'String', O);
	};

	// B.2.3.10 String.prototype.link(url)
	_stringHtml('link', function (createHTML) {
	  return function link(url) {
	    return createHTML(this, 'a', 'href', url);
	  };
	});

	// function makeSankey(svgID, graph) {
	var defaults = {
	  aspectRatio: 16 / 14,
	  width: 1090,
	  margin: {
	    top: 10,
	    right: 10,
	    bottom: 10,
	    left: 10
	  }
	};
	function makeSankey (svg, graph) {
	  var colourDict = {
	    // level 1
	    "intl": "#607890",
	    // level 2
	    "USres": "#CC982A",
	    "nonUS": "#928941",
	    "cdnFromUS": "#FFDC68",
	    "cdnFromOther": "#FAB491",
	    // level 3
	    "USres_land": "#CC982A",
	    "USres_air": "#CC982A",
	    "USres_marine": "#CC982A",
	    // level 4 of level 3 USres
	    "USres_car": "#CC982A",
	    "USres_bus": "#CC982A",
	    "USres_train": "#CC982A",
	    "USres_other": "#CC982A",
	    "nonUS_land": "#928941",
	    "nonUS_air": "#928941",
	    "nonUS_marine": "#928941",
	    "cdnFromUS_land": "#FFDC68",
	    "cdnFromUS_air": "#FFDC68",
	    "cdnFromUS_marine": "#FFDC68",
	    // level 4 of level 3 cdnFromUS
	    "cdnFromUS_car": "#FFDC68",
	    "cdnFromUS_bus": "#FFDC68",
	    "cdnFromUS_train": "#FFDC68",
	    "cdnFromUS_other": "#FFDC68",
	    "cdnFromOther_land": "#FAB491",
	    "cdnFromOther_air": "#FAB491",
	    "cdnFromOther_marine": "#FAB491"
	  }; // set the dimensions and margins of the graph

	  var mergedSettings = defaults;
	  var outerWidth = mergedSettings.width;
	  var outerHeight = Math.ceil(outerWidth / mergedSettings.aspectRatio);
	  var innerHeight = mergedSettings.innerHeight = outerHeight - mergedSettings.margin.top - mergedSettings.margin.bottom;
	  var innerWidth = mergedSettings.innerWidth = outerWidth - mergedSettings.margin.left - mergedSettings.margin.right;
	  var chartInner = svg.select("g.margin-offset");
	  var dataLayer = chartInner.select(".data");
	  mergedSettings.innerHeight = outerHeight - mergedSettings.margin.top - mergedSettings.margin.bottom; // format variables

	  var formatNumber = d3.format(",.0f"); // zero decimal places

	  var format = function format(d) {
	    return formatNumber(d);
	  }; // append the svg object to the body of the page
	  // var svg = d3.select(svgID).append("svg")
	  //     .attr("width", width + margin.left + margin.right)
	  //     .attr("height", height + margin.top + margin.bottom)
	  //   .append("g")
	  //     .attr("transform",
	  //           "translate(" + margin.left + "," + margin.top + ")");
	  // Set the sankey diagram properties


	  var sankey = d3.sankey().nodeWidth(36).nodePadding(40).size([innerWidth, innerHeight]);
	  var path = sankey.link(); // d3.json("data/modes/canada_modes_test.json", function(error, graph) {

	  function make(graph) {
	    sankey.nodes(graph.nodes).links(graph.links).layout(32);

	    if (dataLayer.empty()) {
	      dataLayer = chartInner.append("g").attr("class", "data");
	    } // add in the links


	    var link = dataLayer.append("g").selectAll(".link").data(graph.links).enter().append("path").attr("class", "link").attr("d", path).style("stroke-width", function (d) {
	      return Math.max(1, d.dy);
	    }).style("opacity", function (d) {
	      if (d.value === 0) return 0;
	    }).sort(function (a, b) {
	      return b.dy - a.dy;
	    }); // add the link titles

	    link.append("title").text(function (d) {
	      // return i18next.t(d.source.name, {ns: "modes"}) + "_to_" +
	      //         i18next.t(d.target.name, {ns: "modes"}) + "\n" + format(d.value);
	      return i18next.t(d.target.name, {
	        ns: "modes"
	      }) + "\n" + format(d.value);
	    }); // add in the nodes

	    var node = dataLayer.append("g").selectAll(".node").data(graph.nodes).enter().append("g").attr("class", "node").attr("transform", function (d) {
	      return "translate(" + d.x + "," + d.y + ")";
	    }).call(d3.drag().subject(function (d) {
	      return d;
	    }).on("start", function () {
	      this.parentNode.appendChild(this);
	    }).on("drag", dragmove)); // add the rectangles for the nodes

	    node.append("rect").attr("height", function (d) {
	      return d.dy;
	    }).attr("width", sankey.nodeWidth()).style("fill", function (d) {
	      return d.color = colourDict[d.name]; // return d.color = color(d.name.replace(/ .*/, ""));
	    }).style("stroke", function (d) {
	      return d3.rgb(d.color).darker(2);
	    }).append("title").text(function (d) {
	      return i18next.t(d.name, {
	        ns: "modes"
	      }) + "\n" + format(d.value);
	    }); // add in the title for the nodes

	    node.append("text").attr("x", -6).attr("y", function (d) {
	      return d.dy / 2;
	    }).attr("dy", ".35em").attr("text-anchor", "end").attr("transform", null).text(function (d) {
	      // return i18next.t(d.name, {ns: "modes"});
	      if (d.value != 0) return i18next.t(d.name, {
	        ns: "modes"
	      });
	    }).filter(function (d) {
	      return d.x < innerWidth / 2;
	    }).attr("x", 6 + sankey.nodeWidth()).attr("text-anchor", "start"); // the function for moving the nodes

	    function dragmove(d) {
	      d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(innerHeight - d.dy, d3.event.y))) + ")");
	      sankey.relayout();
	      link.attr("d", path);
	    }
	  } // end make()


	  svg.attr("viewBox", "0 0 " + outerWidth + " " + outerHeight).attr("preserveAspectRatio", "xMidYMid meet").attr("role", "img").attr("aria-label", mergedSettings.altText);

	  if (chartInner.empty()) {
	    chartInner = svg.append("g").attr("class", "margin-offset").attr("transform", "translate(" + mergedSettings.margin.left + "," + mergedSettings.margin.top + ")");
	  }

	  d3.stcExt.addIEShim(svg, outerHeight, outerWidth);
	  make(graph);
	} // end makeSankey()

	// to indexed object, toObject with fallback for non-array-like ES3 strings


	var _toIobject = function (it) {
	  return _iobject(_defined(it));
	};

	var max = Math.max;
	var min$1 = Math.min;
	var _toAbsoluteIndex = function (index, length) {
	  index = _toInteger(index);
	  return index < 0 ? max(index + length, 0) : min$1(index, length);
	};

	// false -> Array#indexOf
	// true  -> Array#includes



	var _arrayIncludes = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = _toIobject($this);
	    var length = _toLength(O.length);
	    var index = _toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
	      if (O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	var $indexOf = _arrayIncludes(false);
	var $native = [].indexOf;
	var NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

	_export(_export.P + _export.F * (NEGATIVE_ZERO || !_strictMethod($native)), 'Array', {
	  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
	  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
	    return NEGATIVE_ZERO
	      // convert -0 to +0
	      ? $native.apply(this, arguments) || 0
	      : $indexOf(this, searchElement, arguments[1]);
	  }
	});

	var tableSettings = {
	  alt: i18next.t("alt", {
	    ns: "modes"
	  }),
	  tableTitle: i18next.t("alt", {
	    ns: "modes"
	  }),
	  margin: {
	    top: 50,
	    left: 80,
	    bottom: 50
	  },
	  // creates variable d
	  filterData: function filterData(data) {
	    return data.nodes; // array of objects
	  },
	  x: {// getValue: function(d) {
	    //   console.log("x getValue d: ", d)
	    //   return new Date(d.date + "-01");
	    // },
	    // getText: function(d) {
	    //   console.log("x getText d: ", d)
	    //   return d.date;
	    // }
	  },
	  y: {
	    getValue: function getValue(d, key) {
	      // d[key] can be string for Traveller Type, number for Count
	      if (typeof d[key] === "string" || d[key] instanceof String) {
	        // Traveller Type
	        if (d.targetLinks[0]) {
	          // empty only for first node
	          // Land cases, parent is two levels up
	          if (d.name === "USres_car" || d.name === "USres_bus" || d.name === "USres_train" || d.name === "USres_other") {
	            var parent = i18next.t("USres", {
	              ns: "modes"
	            });
	            var child = i18next.t(d[key], {
	              ns: "modes"
	            });
	            return parent + ", " + child;
	          } else if (d.name === "cdnFromUS_car" || d.name === "cdnFromUS_bus" || d.name === "cdnFromUS_train" || d.name === "cdnFromUS_other") {
	            var _parent = i18next.t("cdnFromUS", {
	              ns: "modes"
	            });

	            var _child = i18next.t(d[key], {
	              ns: "modes"
	            });

	            return _parent + ", " + _child;
	          } else {
	            // All other cases, parent is in targetLinks[0].source.name
	            var _parent2 = i18next.t(d.targetLinks[0].source.name, {
	              ns: "modes"
	            });

	            var _child2 = i18next.t(d[key], {
	              ns: "modes"
	            });

	            return _parent2 + ", " + _child2;
	          }
	        } else {
	          // targetLinks empty
	          if (d.name === "cdnFromOther_land") {
	            // special case
	            var _parent3 = i18next.t("cdnFromOther", {
	              ns: "modes"
	            });

	            var _child3 = i18next.t(d[key], {
	              ns: "modes"
	            });

	            return _parent3 + ", " + _child3;
	          }
	        }

	        return i18next.t(d[key], {
	          ns: "modes"
	        }); // targetLinks empty (first node has no parent)
	      } else return d[key]; // Number, not a string, do not pass through i18next

	    } // getTotal: function(d, index, data) {
	    //   let total;
	    //   let keys;
	    //   const sett = this;
	    //   if (!d[sett.y.totalProperty]) {
	    //     keys = sett.z.getKeys.call(sett, data);
	    //     total = 0;
	    //     for (let k = 0; k < keys.length; k++) {
	    //       total += sett.y.getValue.call(sett, d, keys[k], data);
	    //     }
	    //     d[sett.y.totalProperty] = total;
	    //   }
	    //   return d[sett.y.totalProperty];
	    // },
	    // getText: function(d, key) {
	    //   if (typeof d[key] === "string" || d[key] instanceof String) {
	    //     return d[key];
	    //   } else return d[key];
	    // }

	  },
	  z: {
	    // label: i18next.t("z_label", {ns: "modes"}),
	    // getId: function(d) {
	    //   console.log("z getID d: ", d)
	    //   return d.key;
	    // },
	    getKeys: function getKeys(object) {
	      var sett = this; // const keys = Object.keys(object[0]);

	      var keys = ["name", "value"];

	      if (keys.indexOf(sett.y.totalProperty) !== -1) {
	        keys.splice(keys.indexOf(sett.y.totalProperty), 1);
	      }

	      return keys;
	    },
	    // getClass: function(...args) {
	    //   return this.z.getId.apply(this, args);
	    // },
	    getText: function getText(d) {
	      return i18next.t(d.key, {
	        ns: "modes"
	      });
	    }
	  },
	  datatable: true,
	  width: 200
	};

	var selected = "CANADA";
	var data;
	var sankeyChart = d3.select("#sankeyGraph").append("svg").attr("id", "svg_sankeyChart");
	var table = d3.select(".tabledata").attr("id", "modesTable");

	function uiHandler(event) {
	  if (event.target.id === "groups") {
	    selected = document.getElementById("groups").value;

	    if (!data[selected]) {
	      d3.json("data/modes/" + selected + "_modes.json", function (err, filedata) {
	        data[selected] = filedata;
	        showData();
	      });
	    } else {
	      showData();
	    }
	  }
	}

	function showData() {
	  makeSankey(sankeyChart, data[selected]);
	}

	i18n.load(["src/i18n"], function () {
	  tableSettings.tableTitle = i18next.t("tableTitle", {
	    ns: "modes"
	  }), d3.queue().defer(d3.json, "data/modes/canada_modes.json").await(function (error, json) {
	    data = json;
	    makeSankey(sankeyChart, data);
	    drawTable(table, tableSettings, data);
	  });
	});
	$(document).on("change", uiHandler);

}());
