(function () {
	'use strict';

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var _core = createCommonjsModule(function (module) {
	var core = module.exports = { version: '2.6.3' };
	if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
	});
	var _core_1 = _core.version;

	var _global = createCommonjsModule(function (module) {
	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self
	  // eslint-disable-next-line no-new-func
	  : Function('return this')();
	if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
	});

	var _library = false;

	var _shared = createCommonjsModule(function (module) {
	var SHARED = '__core-js_shared__';
	var store = _global[SHARED] || (_global[SHARED] = {});

	(module.exports = function (key, value) {
	  return store[key] || (store[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: _core.version,
	  mode: 'global',
	  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
	});
	});

	var id = 0;
	var px = Math.random();
	var _uid = function (key) {
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

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

	// 22.1.3.31 Array.prototype[@@unscopables]
	var UNSCOPABLES = _wks('unscopables');
	var ArrayProto = Array.prototype;
	if (ArrayProto[UNSCOPABLES] == undefined) _hide(ArrayProto, UNSCOPABLES, {});
	var _addToUnscopables = function (key) {
	  ArrayProto[UNSCOPABLES][key] = true;
	};

	var _iterStep = function (done, value) {
	  return { value: value, done: !!done };
	};

	var _iterators = {};

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

	// to indexed object, toObject with fallback for non-array-like ES3 strings


	var _toIobject = function (it) {
	  return _iobject(_defined(it));
	};

	var hasOwnProperty = {}.hasOwnProperty;
	var _has = function (it, key) {
	  return hasOwnProperty.call(it, key);
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

	var shared = _shared('keys');

	var _sharedKey = function (key) {
	  return shared[key] || (shared[key] = _uid(key));
	};

	var arrayIndexOf = _arrayIncludes(false);
	var IE_PROTO = _sharedKey('IE_PROTO');

	var _objectKeysInternal = function (object, names) {
	  var O = _toIobject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) if (key != IE_PROTO) _has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (_has(O, key = names[i++])) {
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

	// IE 8- don't enum bug keys
	var _enumBugKeys = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)



	var _objectKeys = Object.keys || function keys(O) {
	  return _objectKeysInternal(O, _enumBugKeys);
	};

	var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
	  _anObject(O);
	  var keys = _objectKeys(Properties);
	  var length = keys.length;
	  var i = 0;
	  var P;
	  while (length > i) _objectDp.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

	var document$2 = _global.document;
	var _html = document$2 && document$2.documentElement;

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])



	var IE_PROTO$1 = _sharedKey('IE_PROTO');
	var Empty = function () { /* empty */ };
	var PROTOTYPE$1 = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = _domCreate('iframe');
	  var i = _enumBugKeys.length;
	  var lt = '<';
	  var gt = '>';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  _html.appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while (i--) delete createDict[PROTOTYPE$1][_enumBugKeys[i]];
	  return createDict();
	};

	var _objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    Empty[PROTOTYPE$1] = _anObject(O);
	    result = new Empty();
	    Empty[PROTOTYPE$1] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO$1] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : _objectDps(result, Properties);
	};

	var def = _objectDp.f;

	var TAG = _wks('toStringTag');

	var _setToStringTag = function (it, tag, stat) {
	  if (it && !_has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
	};

	var IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	_hide(IteratorPrototype, _wks('iterator'), function () { return this; });

	var _iterCreate = function (Constructor, NAME, next) {
	  Constructor.prototype = _objectCreate(IteratorPrototype, { next: _propertyDesc(1, next) });
	  _setToStringTag(Constructor, NAME + ' Iterator');
	};

	// 7.1.13 ToObject(argument)

	var _toObject = function (it) {
	  return Object(_defined(it));
	};

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)


	var IE_PROTO$2 = _sharedKey('IE_PROTO');
	var ObjectProto = Object.prototype;

	var _objectGpo = Object.getPrototypeOf || function (O) {
	  O = _toObject(O);
	  if (_has(O, IE_PROTO$2)) return O[IE_PROTO$2];
	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

	var ITERATOR = _wks('iterator');
	var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
	var FF_ITERATOR = '@@iterator';
	var KEYS = 'keys';
	var VALUES = 'values';

	var returnThis = function () { return this; };

	var _iterDefine = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
	  _iterCreate(Constructor, NAME, next);
	  var getMethod = function (kind) {
	    if (!BUGGY && kind in proto) return proto[kind];
	    switch (kind) {
	      case KEYS: return function keys() { return new Constructor(this, kind); };
	      case VALUES: return function values() { return new Constructor(this, kind); };
	    } return function entries() { return new Constructor(this, kind); };
	  };
	  var TAG = NAME + ' Iterator';
	  var DEF_VALUES = DEFAULT == VALUES;
	  var VALUES_BUG = false;
	  var proto = Base.prototype;
	  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
	  var $default = $native || getMethod(DEFAULT);
	  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
	  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
	  var methods, key, IteratorPrototype;
	  // Fix native
	  if ($anyNative) {
	    IteratorPrototype = _objectGpo($anyNative.call(new Base()));
	    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
	      // Set @@toStringTag to native iterators
	      _setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if (!_library && typeof IteratorPrototype[ITERATOR] != 'function') _hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if (DEF_VALUES && $native && $native.name !== VALUES) {
	    VALUES_BUG = true;
	    $default = function values() { return $native.call(this); };
	  }
	  // Define iterator
	  if ((!_library || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
	    _hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  _iterators[NAME] = $default;
	  _iterators[TAG] = returnThis;
	  if (DEFAULT) {
	    methods = {
	      values: DEF_VALUES ? $default : getMethod(VALUES),
	      keys: IS_SET ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if (FORCED) for (key in methods) {
	      if (!(key in proto)) _redefine(proto, key, methods[key]);
	    } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	var es6_array_iterator = _iterDefine(Array, 'Array', function (iterated, kind) {
	  this._t = _toIobject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function () {
	  var O = this._t;
	  var kind = this._k;
	  var index = this._i++;
	  if (!O || index >= O.length) {
	    this._t = undefined;
	    return _iterStep(1);
	  }
	  if (kind == 'keys') return _iterStep(0, index);
	  if (kind == 'values') return _iterStep(0, O[index]);
	  return _iterStep(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	_iterators.Arguments = _iterators.Array;

	_addToUnscopables('keys');
	_addToUnscopables('values');
	_addToUnscopables('entries');

	var ITERATOR$1 = _wks('iterator');
	var TO_STRING_TAG = _wks('toStringTag');
	var ArrayValues = _iterators.Array;

	var DOMIterables = {
	  CSSRuleList: true, // TODO: Not spec compliant, should be false.
	  CSSStyleDeclaration: false,
	  CSSValueList: false,
	  ClientRectList: false,
	  DOMRectList: false,
	  DOMStringList: false,
	  DOMTokenList: true,
	  DataTransferItemList: false,
	  FileList: false,
	  HTMLAllCollection: false,
	  HTMLCollection: false,
	  HTMLFormElement: false,
	  HTMLSelectElement: false,
	  MediaList: true, // TODO: Not spec compliant, should be false.
	  MimeTypeArray: false,
	  NamedNodeMap: false,
	  NodeList: true,
	  PaintRequestList: false,
	  Plugin: false,
	  PluginArray: false,
	  SVGLengthList: false,
	  SVGNumberList: false,
	  SVGPathSegList: false,
	  SVGPointList: false,
	  SVGStringList: false,
	  SVGTransformList: false,
	  SourceBufferList: false,
	  StyleSheetList: true, // TODO: Not spec compliant, should be false.
	  TextTrackCueList: false,
	  TextTrackList: false,
	  TouchList: false
	};

	for (var collections = _objectKeys(DOMIterables), i = 0; i < collections.length; i++) {
	  var NAME = collections[i];
	  var explicit = DOMIterables[NAME];
	  var Collection = _global[NAME];
	  var proto = Collection && Collection.prototype;
	  var key;
	  if (proto) {
	    if (!proto[ITERATOR$1]) _hide(proto, ITERATOR$1, ArrayValues);
	    if (!proto[TO_STRING_TAG]) _hide(proto, TO_STRING_TAG, NAME);
	    _iterators[NAME] = ArrayValues;
	    if (explicit) for (key in es6_array_iterator) if (!proto[key]) _redefine(proto, key, es6_array_iterator[key], true);
	  }
	}

	// most Object methods by ES6 should accept primitives



	var _objectSap = function (KEY, exec) {
	  var fn = (_core.Object || {})[KEY] || Object[KEY];
	  var exp = {};
	  exp[KEY] = exec(fn);
	  _export(_export.S + _export.F * _fails(function () { fn(1); }), 'Object', exp);
	};

	// 19.1.2.14 Object.keys(O)



	_objectSap('keys', function () {
	  return function keys(it) {
	    return _objectKeys(_toObject(it));
	  };
	});

	// 7.2.2 IsArray(argument)

	var _isArray = Array.isArray || function isArray(arg) {
	  return _cof(arg) == 'Array';
	};

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

	var $map = _arrayMethods(1);

	_export(_export.P + _export.F * !_strictMethod([].map, true), 'Array', {
	  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
	  map: function map(callbackfn /* , thisArg */) {
	    return $map(this, callbackfn, arguments[1]);
	  }
	});

	function _defineProperty(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _objectSpread(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty(target, key, source[key]);
	    });
	  }

	  return target;
	}

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

	var settingsBar = {
	  aspectRatio: 16 / 13,
	  margin: {
	    top: 50,
	    left: 50,
	    bottom: 50
	  },
	  x: {
	    label: i18next.t("x_label", {
	      ns: "railBar"
	    }),
	    getId: function getId(d) {
	      return d.year;
	    },
	    getValue: function getValue() {
	      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      return this.x.getId.apply(this, args);
	    },
	    getClass: function getClass() {
	      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        args[_key2] = arguments[_key2];
	      }

	      return this.x.getId.apply(this, args);
	    },
	    getTickText: function getTickText(val) {
	      return i18next.t(val, {
	        ns: "railBar"
	      });
	    }
	  },
	  y: {
	    label: i18next.t("y_label", {
	      ns: "railBar"
	    }),
	    getValue: function getValue(d) {
	      return d.value;
	    },
	    getText: function getText(d) {
	      return d.value;
	    },
	    ticks: 10,
	    tickSizeOuter: 0
	  },
	  z: {
	    label: i18next.t("z_label", {
	      ns: "railTable"
	    }),
	    getId: function getId(d) {
	      return d.category;
	    },
	    getKeys: function getKeys(object) {
	      var keys = Object.keys(object[0]);
	      keys.splice(keys.indexOf("category"), 1);
	      return keys;
	    },
	    formatData: function formatData(data) {
	      return data[0].values;
	    },
	    getClass: function getClass() {
	      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	        args[_key3] = arguments[_key3];
	      }

	      return this.z.getId.apply(this, args);
	    },
	    getDataPoints: function getDataPoints(d) {
	      return d.values;
	    },
	    getText: function getText(d) {
	      return i18next.t(d.key, {
	        ns: "railTable"
	      });
	    }
	  },
	  width: 800,
	  datatable: true,
	  tableTitle: ""
	};

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

	var f$1 = {}.propertyIsEnumerable;

	var _objectPie = {
		f: f$1
	};

	var isEnum = _objectPie.f;
	var _objectToArray = function (isEntries) {
	  return function (it) {
	    var O = _toIobject(it);
	    var keys = _objectKeys(O);
	    var length = keys.length;
	    var i = 0;
	    var result = [];
	    var key;
	    while (length > i) if (isEnum.call(O, key = keys[i++])) {
	      result.push(isEntries ? [key, O[key]] : O[key]);
	    } return result;
	  };
	};

	// https://github.com/tc39/proposal-object-values-entries

	var $values = _objectToArray(false);

	_export(_export.S, 'Object', {
	  values: function values(it) {
	    return $values(it);
	  }
	});

	var settBubble = {
	  aspectRatio: 19 / 6,
	  margin: {
	    top: 30,
	    right: 0,
	    bottom: 20,
	    left: 120
	  },
	  alt: i18next.t("alt", {
	    ns: "commodities"
	  }),
	  filterData: function filterData(data) {
	    var obj = {};
	    var yearList;
	    var lastYearArray = [];
	    data.map(function (d) {
	      var key = Object.keys(d)[0];

	      if (!yearList) {
	        yearList = Object.keys(d[key]);
	      }

	      var lastYear = yearList[yearList.length - 1]; // set key once

	      if (!obj[key]) {
	        obj[key] = [];
	      } // Store lastYear value for each commodity for sorting later


	      lastYearArray.push({
	        key: key,
	        lastYearValue: d[key][lastYear].All
	      }); // push year-value pairs for each year into obj

	      for (var idx = 0; idx < yearList.length; idx++) {
	        obj[key].push({
	          year: Object.keys(d[key])[idx],
	          value: Object.values(d[key])[idx].All
	        });
	      }
	    }); // Sort by value in last year (descending order)

	    lastYearArray.sort(function (a, b) {
	      return a.lastYearValue < b.lastYearValue;
	    }); // Define array of ordered commodities

	    var orderedComm = lastYearArray.map(function (item) {
	      return item.key;
	    }); // Define mapping between old order and new order (to be used in final obj return)

	    var count = 0;
	    var mapping = [];
	    Object.keys(obj).map(function (k) {
	      var thisComm = orderedComm[count];
	      mapping.push(_defineProperty({}, k, thisComm));
	      count++;
	    }); // Re-arrange obj so that each element object has an id and
	    // a dataPoints array containing the year-value pairs created above.
	    // Note that object is ordered according to sorted commodity list.

	    var match;
	    return Object.keys(obj).map(function (k) {
	      mapping.map(function (d) {
	        if (Object.keys(d)[0] === k) {
	          match = Object.values(d)[0];
	          return match;
	        }
	      });
	      return {
	        id: match,
	        dataPoints: obj[match]
	      };
	    });
	  },
	  x: {
	    getValue: function getValue(d) {
	      return d.year;
	    },
	    getText: function getText(d) {
	      return d.year;
	    }
	  },
	  r: {
	    inverselyProportional: false,
	    // if true, bubble size decreases with value
	    getValue: function getValue(d) {
	      return d.value;
	    }
	  },
	  z: {
	    // Object { id: "total", dataPoints: (21) […] }, and similarly for id: local, id: itin
	    getId: function getId(d) {
	      return d.id;
	    },
	    getClass: function getClass() {
	      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      return this.z.getId.apply(this, args);
	    },
	    getText: function getText(d) {
	      return i18next.t(d.id, {
	        ns: "commodities"
	      });
	    },
	    getDataPoints: function getDataPoints(d) {
	      return d.dataPoints;
	    }
	  },
	  width: 800
	};

	// true  -> String#at
	// false -> String#codePointAt
	var _stringAt = function (TO_STRING) {
	  return function (that, pos) {
	    var s = String(_defined(that));
	    var i = _toInteger(pos);
	    var l = s.length;
	    var a, b;
	    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

	var $at = _stringAt(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	_iterDefine(String, 'String', function (iterated) {
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function () {
	  var O = this._t;
	  var index = this._i;
	  var point;
	  if (index >= O.length) return { value: undefined, done: true };
	  point = $at(O, index);
	  this._i += point.length;
	  return { value: point, done: false };
	});

	// call something on iterator step with safe closing on error

	var _iterCall = function (iterator, fn, value, entries) {
	  try {
	    return entries ? fn(_anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch (e) {
	    var ret = iterator['return'];
	    if (ret !== undefined) _anObject(ret.call(iterator));
	    throw e;
	  }
	};

	// check on default Array iterator

	var ITERATOR$2 = _wks('iterator');
	var ArrayProto$1 = Array.prototype;

	var _isArrayIter = function (it) {
	  return it !== undefined && (_iterators.Array === it || ArrayProto$1[ITERATOR$2] === it);
	};

	var _createProperty = function (object, index, value) {
	  if (index in object) _objectDp.f(object, index, _propertyDesc(0, value));
	  else object[index] = value;
	};

	// getting tag from 19.1.3.6 Object.prototype.toString()

	var TAG$1 = _wks('toStringTag');
	// ES3 wrong here
	var ARG = _cof(function () { return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (e) { /* empty */ }
	};

	var _classof = function (it) {
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = tryGet(O = Object(it), TAG$1)) == 'string' ? T
	    // builtinTag case
	    : ARG ? _cof(O)
	    // ES3 arguments fallback
	    : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

	var ITERATOR$3 = _wks('iterator');

	var core_getIteratorMethod = _core.getIteratorMethod = function (it) {
	  if (it != undefined) return it[ITERATOR$3]
	    || it['@@iterator']
	    || _iterators[_classof(it)];
	};

	var ITERATOR$4 = _wks('iterator');
	var SAFE_CLOSING = false;

	try {
	  var riter = [7][ITERATOR$4]();
	  riter['return'] = function () { SAFE_CLOSING = true; };
	} catch (e) { /* empty */ }

	var _iterDetect = function (exec, skipClosing) {
	  if (!skipClosing && !SAFE_CLOSING) return false;
	  var safe = false;
	  try {
	    var arr = [7];
	    var iter = arr[ITERATOR$4]();
	    iter.next = function () { return { done: safe = true }; };
	    arr[ITERATOR$4] = function () { return iter; };
	    exec(arr);
	  } catch (e) { /* empty */ }
	  return safe;
	};

	_export(_export.S + _export.F * !_iterDetect(function (iter) { }), 'Array', {
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
	  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
	    var O = _toObject(arrayLike);
	    var C = typeof this == 'function' ? this : Array;
	    var aLen = arguments.length;
	    var mapfn = aLen > 1 ? arguments[1] : undefined;
	    var mapping = mapfn !== undefined;
	    var index = 0;
	    var iterFn = core_getIteratorMethod(O);
	    var length, result, step, iterator;
	    if (mapping) mapfn = _ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
	    // if object isn't iterable or it's array with default iterator - use simple case
	    if (iterFn != undefined && !(C == Array && _isArrayIter(iterFn))) {
	      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
	        _createProperty(result, index, mapping ? _iterCall(iterator, mapfn, [step.value, index], true) : step.value);
	      }
	    } else {
	      length = _toLength(O.length);
	      for (result = new C(length); length > index; index++) {
	        _createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
	      }
	    }
	    result.length = index;
	    return result;
	  }
	});

	function mapColourScaleFn (svgCB, colourArray, dimExtent, numLevels, settings) {
	  // Definitions
	  // ---------------------------------------------------------------------------
	  var rectDim = 35;
	  var yRect = 20;
	  var yText = 65;
	  var yNaNText = yText + 7; // text labels (calculate cbValues)

	  var delta = (dimExtent[1] - dimExtent[0]) / numLevels;
	  var cbValues = [];
	  cbValues[0] = dimExtent[0];

	  for (var idx = 1; idx < numLevels; idx++) {
	    cbValues.push(Math.round(idx * delta + dimExtent[0]));
	  } // rect fill fn


	  var getFill = function getFill(d, i) {
	    return colourArray[i];
	  }; // text fn


	  var getText = function getText(i, j) {
	    if (i < numLevels) {
	      var s0 = settings.formatNum(cbValues[j]);
	      return s0 + "+";
	    } else if (i === numLevels + 1) {
	      return "x";
	    }
	  }; // tooltip for NaN box


	  var divNaN = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0); // -----------------------------------------------------------------------------
	  // g node for colourbar title (text is set in index.js)

	  svgCB.append("g").attr("class", "colourbarTitle").attr("id", "cbTitle").append("text") // .text("test")
	  .attr("transform", function (d, i) {
	    return "translate(225, 15)";
	  }).style("display", function () {
	    return "inline";
	  }); // Create the umbrella group

	  var rectGroups = svgCB.attr("class", "mapCB").selectAll(".legend").data(Array.from(Array(colourArray.length).keys())); // Append g nodes (to be filled with a rect and a text) to umbrella group

	  var newGroup = rectGroups.enter().append("g").attr("class", "legend").attr("id", function (d, i) {
	    return "cb".concat(i);
	  }); // add rects

	  newGroup.append("rect").attr("width", rectDim).attr("height", rectDim).attr("y", yRect).attr("x", function (d, i) {
	    return 135 + i * rectDim;
	  }).attr("fill", getFill).attr("class", function (d, i) {
	    if (i === numLevels + 1) {
	      return "classNaN";
	    }
	  }); // hover over NaN rect only

	  newGroup.selectAll(".legend rect").on("mouseover", function (d, i) {
	    if (d3.select(this).attr("class") === "classNaN") {
	      var line1 = i18next.t("NaNhover1", {
	        ns: "airUI"
	      });
	      var line2 = i18next.t("NaNhover2", {
	        ns: "airUI",
	        escapeInterpolation: false
	      });
	      divNaN.style("opacity", 0.9).html("<br>" + line1 + "<br>" + line2 + "<br><br>").style("left", d3.event.pageX + 10 + "px").style("top", d3.event.pageY + 10 + "px");
	    }
	  }).on("mouseout", function () {
	    divNaN.style("opacity", 0);
	  }); // add text

	  newGroup.append("text").text(getText).attr("text-anchor", "end").attr("transform", function (d, i) {
	    if (i < numLevels) {
	      return "translate(".concat(140 + i * (rectDim + 0), ", ").concat(yText, ") rotate(-45)");
	    } else if (i === numLevels + 1) {
	      // NaN box in legend
	      return "translate(".concat(156 + i * (rectDim + 0), ", ").concat(yNaNText, ") ");
	    }
	  }).style("display", function () {
	    return "inline";
	  }); // Update rect fill for any new colour arrays passed in

	  rectGroups.select("rect").attr("fill", getFill); // Update rect text for different year selections

	  rectGroups.select("text").text(getText);
	  rectGroups.exit().remove();
	}

	var gOPD = Object.getOwnPropertyDescriptor;

	var f$2 = _descriptors ? gOPD : function getOwnPropertyDescriptor(O, P) {
	  O = _toIobject(O);
	  P = _toPrimitive(P, true);
	  if (_ie8DomDefine) try {
	    return gOPD(O, P);
	  } catch (e) { /* empty */ }
	  if (_has(O, P)) return _propertyDesc(!_objectPie.f.call(O, P), O[P]);
	};

	var _objectGopd = {
		f: f$2
	};

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */


	var check = function (O, proto) {
	  _anObject(O);
	  if (!_isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
	};
	var _setProto = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function (test, buggy, set) {
	      try {
	        set = _ctx(Function.call, _objectGopd.f(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch (e) { buggy = true; }
	      return function setPrototypeOf(O, proto) {
	        check(O, proto);
	        if (buggy) O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

	var setPrototypeOf = _setProto.set;
	var _inheritIfRequired = function (that, target, C) {
	  var S = target.constructor;
	  var P;
	  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && _isObject(P) && setPrototypeOf) {
	    setPrototypeOf(that, P);
	  } return that;
	};

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)

	var hiddenKeys = _enumBugKeys.concat('length', 'prototype');

	var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return _objectKeysInternal(O, hiddenKeys);
	};

	var _objectGopn = {
		f: f$3
	};

	var _stringWs = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
	  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

	var space = '[' + _stringWs + ']';
	var non = '\u200b\u0085';
	var ltrim = RegExp('^' + space + space + '*');
	var rtrim = RegExp(space + space + '*$');

	var exporter = function (KEY, exec, ALIAS) {
	  var exp = {};
	  var FORCE = _fails(function () {
	    return !!_stringWs[KEY]() || non[KEY]() != non;
	  });
	  var fn = exp[KEY] = FORCE ? exec(trim) : _stringWs[KEY];
	  if (ALIAS) exp[ALIAS] = fn;
	  _export(_export.P + _export.F * FORCE, 'String', exp);
	};

	// 1 -> String#trimLeft
	// 2 -> String#trimRight
	// 3 -> String#trim
	var trim = exporter.trim = function (string, TYPE) {
	  string = String(_defined(string));
	  if (TYPE & 1) string = string.replace(ltrim, '');
	  if (TYPE & 2) string = string.replace(rtrim, '');
	  return string;
	};

	var _stringTrim = exporter;

	var gOPN = _objectGopn.f;
	var gOPD$1 = _objectGopd.f;
	var dP$1 = _objectDp.f;
	var $trim = _stringTrim.trim;
	var NUMBER = 'Number';
	var $Number = _global[NUMBER];
	var Base = $Number;
	var proto$1 = $Number.prototype;
	// Opera ~12 has broken Object#toString
	var BROKEN_COF = _cof(_objectCreate(proto$1)) == NUMBER;
	var TRIM = 'trim' in String.prototype;

	// 7.1.3 ToNumber(argument)
	var toNumber = function (argument) {
	  var it = _toPrimitive(argument, false);
	  if (typeof it == 'string' && it.length > 2) {
	    it = TRIM ? it.trim() : $trim(it, 3);
	    var first = it.charCodeAt(0);
	    var third, radix, maxCode;
	    if (first === 43 || first === 45) {
	      third = it.charCodeAt(2);
	      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
	    } else if (first === 48) {
	      switch (it.charCodeAt(1)) {
	        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
	        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
	        default: return +it;
	      }
	      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
	        code = digits.charCodeAt(i);
	        // parseInt parses a string to a first unavailable symbol
	        // but ToNumber should return NaN if a string contains unavailable symbols
	        if (code < 48 || code > maxCode) return NaN;
	      } return parseInt(digits, radix);
	    }
	  } return +it;
	};

	if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
	  $Number = function Number(value) {
	    var it = arguments.length < 1 ? 0 : value;
	    var that = this;
	    return that instanceof $Number
	      // check on 1..constructor(foo) case
	      && (BROKEN_COF ? _fails(function () { proto$1.valueOf.call(that); }) : _cof(that) != NUMBER)
	        ? _inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
	  };
	  for (var keys = _descriptors ? gOPN(Base) : (
	    // ES3:
	    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
	    // ES6 (in case, if modules with ES6 Number statics required before):
	    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
	    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
	  ).split(','), j = 0, key$1; keys.length > j; j++) {
	    if (_has(Base, key$1 = keys[j]) && !_has($Number, key$1)) {
	      dP$1($Number, key$1, gOPD$1(Base, key$1));
	    }
	  }
	  $Number.prototype = proto$1;
	  proto$1.constructor = $Number;
	  _redefine(_global, NUMBER, $Number);
	}

	function fillMapFn (data, colourArray, numLevels) {
	  var nullColour = colourArray.slice(-1)[0]; // data is an Array

	  var thisData = data[0]; // Object

	  var dimExtent = [];
	  var totArray = [];
	  totArray = Object.values(thisData);
	  totArray.sort(function (a, b) {
	    return a - b;
	  });
	  dimExtent = d3.extent(totArray); // colour map to take data value and map it to the colour of the level bin it belongs to

	  var colourMap = d3.scaleQuantize().domain([dimExtent[0], dimExtent[1]]).range(colourArray.slice(0, numLevels));

	  var _loop = function _loop(key) {
	    if (thisData.hasOwnProperty(key)) {
	      d3.select(".dashboard .map").select("." + key).style("fill", function () {
	        return Number(thisData[key]) ? colourMap(thisData[key]) : nullColour;
	      }); // Bruno : Unused code removed following no data message modification
	    }
	  };

	  for (var key in thisData) {
	    _loop(key);
	  }

	  return dimExtent;
	}

	var allCommArr = []; // passed into bubbleTable()

	var selectedOrig = "AT";
	var selectedDest = "QC";
	var selectedComm = "chems";
	var dataTag; // stores `${selectedOrig}_${selectedComm}`;

	var xlabelDY = 1.5; // spacing between areaChart xlabels and ticks

	var data = {}; // stores data for barChart

	var selectedYear = "2016"; // let domain; // Stores domain of flattened origJSON
	// let bar; // stores barChart() call
	// let mapData = {};
	// let canadaMap;
	// ---------------------------------------------------------------------

	/* SVGs */
	// Canada map

	var map = d3.select(".dashboard .map").append("svg"); // Map colour bar

	var margin = {
	  top: 20,
	  right: 0,
	  bottom: 10,
	  left: 20
	};
	var width = 570 - margin.left - margin.right;
	var height = 150 - margin.top - margin.bottom;
	var svgCB = d3.select("#mapColourScale").select("svg").attr("class", "mapCB").attr("width", width).attr("height", height).style("vertical-align", "middle");
	/* -- shim all the SVGs (chart is already shimmed in component) -- */

	d3.stcExt.addIEShim(map, 387.1, 457.5);
	d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
	var chart = d3.select(".data.raildata").append("svg").attr("id", "svgBar");
	var commTable = d3.select("#commgrid").append("svg").attr("id", "svg_commgrid"); // ---------------------------------------------------------------------

	/* load data fn */

	var loadBarData = function loadBarData(selectedOrig, selectedComm, cb) {
	  if (!data[dataTag]) {
	    d3.json("data/rail/" + selectedOrig + "_" + selectedComm + ".json", function (err, filedata) {
	      data[dataTag] = filedata;

	      var s = _objectSpread({}, settingsBar, {
	        filterData: filterDataBar
	      });

	      cb(s);
	    });
	  } else {
	    var s = _objectSpread({}, settingsBar, {
	      filterData: filterDataBar
	    });

	    cb(s);
	  }
	}; // ---------------------------------------------------------------------


	function uiHandler(event) {
	  if (event.target.id === "commodity") {
	    selectedComm = document.getElementById("commodity").value;
	  }

	  if (event.target.id === "originGeo") {
	    selectedOrig = document.getElementById("originGeo").value;
	  }

	  if (event.target.id === "destGeo") {
	    selectedDest = document.getElementById("destGeo").value;
	  }

	  dataTag = "".concat(selectedOrig, "_").concat(selectedComm);
	  updateTitles();
	  loadBarData(selectedOrig, selectedComm, function (s) {
	    showBarChartData(s);
	  });
	} // -----------------------------------------------------------------------------

	/* -- Map interactions -- */
	// -----------------------------------------------------------------------------

	/* FNS */


	function colorMap() {
	  // store map data in array and plot colour
	  var thisTotalArray = [];
	  thisTotalArray.push(data["".concat(selectedOrig, "_").concat(selectedComm)][selectedYear]);
	  var colourArray = ["#AFE2FF", "#72C2FF", "#bc9dff", "#894FFF", "#5D0FBC"];
	  var numLevels = colourArray.length; // colour map with fillMapFn and output dimExtent for colour bar scale

	  var dimExtent = fillMapFn(thisTotalArray, colourArray, numLevels); // colour bar scale and add label

	  mapColourScaleFn(svgCB, colourArray, dimExtent, colourArray.length); // Colourbar label (need be plotted only once)

	  var mapScaleLabel = i18next.t("units", {
	    ns: "rail"
	  });
	  d3.select("#cbTitle").select("text").text(mapScaleLabel).attr("transform", function (d, i) {
	    return "translate(203, 15)";
	  });
	} // ---------------------------------------------------------------------

	/* -- display barChart -- */


	function filterDataBar() {
	  var _this = this;

	  var d = data[dataTag];
	  return [{
	    category: "".concat(this.selectedOrig),
	    values: Object.keys(d).map(function (p) {
	      return {
	        year: p,
	        value: d[p][_this.selectedDest]
	      };
	    })
	  }];
	}

	function showBarChartData(s) {
	  barChart(chart, _objectSpread({}, s, {
	    selectedOrig: selectedOrig,
	    selectedDest: selectedDest
	  }));
	  d3.select("#svgBar").select(".x.axis").select("text").attr("display", "none");
	  d3.select("#svgBar").select(".x.axis").selectAll(".tick text").attr("dy", "".concat(xlabelDY, "em")); // createOverlay(stackedArea, data[selectedRegion], (d) => {
	  //   areaTooltip(stackedArea.settings, divArea, d);
	  // }, () => {
	  //   divArea.style("opacity", 0);
	  // });
	  // // Highlight region selected from menu on map
	  // d3.select(".dashboard .map")
	  //     .select("." + selectedRegion)
	  //     .classed("roadMapHighlight", true)
	  //     .moveToFront();

	  updateTitles(); // plotLegend();
	  // cButton.appendTo(document.getElementById("copy-button-container"));
	  // dataCopyButton(data[selectedRegion]);
	}
	/* -- display areaChart -- */


	function showBubbleTable() {
	  var thisText = i18next.t("tableTitle", {
	    ns: "railBubbleTable"
	  });
	  d3.select("#commTableTitle").text(thisText);
	  bubbleTable(commTable, settBubble, allCommArr);
	}
	/* -- update map and areaChart titles -- */


	function updateTitles() {
	  var thisComm = i18next.t(selectedComm, {
	    ns: "commodities"
	  });
	  var thisOrig = i18next.t(selectedOrig, {
	    ns: "geography"
	  });
	  var thisDest = i18next.t(selectedDest, {
	    ns: "geography"
	  });
	  d3.select("#railTitleBarChart").text("".concat(thisComm, " from ").concat(thisOrig, " to ").concat(thisDest));
	  settingsBar.tableTitle = i18next.t("tableTitle", {
	    ns: "railTable",
	    comm: thisComm,
	    orig: thisOrig,
	    dest: thisDest
	  });
	} // ---------------------------------------------------------------------
	// Landing page displays


	i18n.load(["src/i18n"], function () {
	  settingsBar.x.label = i18next.t("x_label", {
	    ns: "railBar"
	  }), settingsBar.y.label = i18next.t("y_label", {
	    ns: "railBar"
	  }), settingsBar.z.label = i18next.t("z_label", {
	    ns: "railTable"
	  }), d3.queue().defer(d3.json, "data/rail/All_coal.json").defer(d3.json, "data/rail/All_mixed.json").defer(d3.json, "data/rail/All_wheat.json").defer(d3.json, "data/rail/All_ores.json").defer(d3.json, "data/rail/All_potash.json").defer(d3.json, "data/rail/All_lumber.json").defer(d3.json, "data/rail/All_canola.json").defer(d3.json, "data/rail/All_oils.json").defer(d3.json, "data/rail/All_chems.json").defer(d3.json, "data/rail/All_pulp.json").defer(d3.json, "data/road/CANADA.json") // .defer(d3.json, "data/rail/All_other.json")
	  .await(function (error, allcoal, allmixed, allwheat, allores, allpotash, alllumber, allcanola, alloils, allchems, allpulp) {
	    allCommArr.push({
	      "coal": allcoal
	    });
	    allCommArr.push({
	      "mixed": allmixed
	    });
	    allCommArr.push({
	      "wheat": allwheat
	    });
	    allCommArr.push({
	      "ores": allores
	    });
	    allCommArr.push({
	      "potash": allpotash
	    });
	    allCommArr.push({
	      "lumber": alllumber
	    });
	    allCommArr.push({
	      "canola": allcanola
	    });
	    allCommArr.push({
	      "oils": alloils
	    });
	    allCommArr.push({
	      "chems": allchems
	    });
	    allCommArr.push({
	      "pulp": allpulp
	    }); // allCommArr.push({"other": allother});

	    getCanadaMap(map).on("loaded", function () {
	      colorMap();
	    });
	    d3.select("#mapTitleRail").text(i18next.t("mapTitle", {
	      ns: "rail"
	    }));
	    showBubbleTable();
	    d3.json("data/rail/" + selectedOrig + "_" + selectedComm + ".json", function (err, origJSON) {
	      dataTag = "".concat(selectedOrig, "_").concat(selectedComm);
	      data[dataTag] = origJSON;

	      var s = _objectSpread({}, settingsBar, {
	        filterData: filterDataBar
	      });

	      showBarChartData(s, data);
	    }); // outer d3.json

	    updateTitles();
	  });
	});
	$(document).on("change", uiHandler);
	$(document).on("change", uiHandler);

	d3.selection.prototype.moveToFront = function () {
	  return this.each(function () {
	    this.parentNode.appendChild(this);
	  });
	};

	d3.selection.prototype.moveToBack = function () {
	  return this.each(function () {
	    var firstChild = this.parentNode.firstChild;

	    if (firstChild) {
	      this.parentNode.insertBefore(this, firstChild);
	    }
	  });
	};

}());
