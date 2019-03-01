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

	var f = _wks;

	var _wksExt = {
		f: f
	};

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

	var f$1 = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
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
		f: f$1
	};

	var defineProperty = _objectDp.f;
	var _wksDefine = function (name) {
	  var $Symbol = _core.Symbol || (_core.Symbol = _library ? {} : _global.Symbol || {});
	  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: _wksExt.f(name) });
	};

	_wksDefine('asyncIterator');

	var hasOwnProperty = {}.hasOwnProperty;
	var _has = function (it, key) {
	  return hasOwnProperty.call(it, key);
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

	var _meta = createCommonjsModule(function (module) {
	var META = _uid('meta');


	var setDesc = _objectDp.f;
	var id = 0;
	var isExtensible = Object.isExtensible || function () {
	  return true;
	};
	var FREEZE = !_fails(function () {
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function (it) {
	  setDesc(it, META, { value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  } });
	};
	var fastKey = function (it, create) {
	  // return primitive with prefix
	  if (!_isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if (!_has(it, META)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return 'F';
	    // not necessary to add metadata
	    if (!create) return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function (it, create) {
	  if (!_has(it, META)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return true;
	    // not necessary to add metadata
	    if (!create) return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function (it) {
	  if (FREEZE && meta.NEED && isExtensible(it) && !_has(it, META)) setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY: META,
	  NEED: false,
	  fastKey: fastKey,
	  getWeak: getWeak,
	  onFreeze: onFreeze
	};
	});
	var _meta_1 = _meta.KEY;
	var _meta_2 = _meta.NEED;
	var _meta_3 = _meta.fastKey;
	var _meta_4 = _meta.getWeak;
	var _meta_5 = _meta.onFreeze;

	var def = _objectDp.f;

	var TAG = _wks('toStringTag');

	var _setToStringTag = function (it, tag, stat) {
	  if (it && !_has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
	};

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

	var f$2 = Object.getOwnPropertySymbols;

	var _objectGops = {
		f: f$2
	};

	var f$3 = {}.propertyIsEnumerable;

	var _objectPie = {
		f: f$3
	};

	// all enumerable object keys, includes symbols



	var _enumKeys = function (it) {
	  var result = _objectKeys(it);
	  var getSymbols = _objectGops.f;
	  if (getSymbols) {
	    var symbols = getSymbols(it);
	    var isEnum = _objectPie.f;
	    var i = 0;
	    var key;
	    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
	  } return result;
	};

	// 7.2.2 IsArray(argument)

	var _isArray = Array.isArray || function isArray(arg) {
	  return _cof(arg) == 'Array';
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

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)

	var hiddenKeys = _enumBugKeys.concat('length', 'prototype');

	var f$4 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return _objectKeysInternal(O, hiddenKeys);
	};

	var _objectGopn = {
		f: f$4
	};

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window

	var gOPN = _objectGopn.f;
	var toString$1 = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function (it) {
	  try {
	    return gOPN(it);
	  } catch (e) {
	    return windowNames.slice();
	  }
	};

	var f$5 = function getOwnPropertyNames(it) {
	  return windowNames && toString$1.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(_toIobject(it));
	};

	var _objectGopnExt = {
		f: f$5
	};

	var gOPD = Object.getOwnPropertyDescriptor;

	var f$6 = _descriptors ? gOPD : function getOwnPropertyDescriptor(O, P) {
	  O = _toIobject(O);
	  P = _toPrimitive(P, true);
	  if (_ie8DomDefine) try {
	    return gOPD(O, P);
	  } catch (e) { /* empty */ }
	  if (_has(O, P)) return _propertyDesc(!_objectPie.f.call(O, P), O[P]);
	};

	var _objectGopd = {
		f: f$6
	};

	// ECMAScript 6 symbols shim





	var META = _meta.KEY;



















	var gOPD$1 = _objectGopd.f;
	var dP$1 = _objectDp.f;
	var gOPN$1 = _objectGopnExt.f;
	var $Symbol = _global.Symbol;
	var $JSON = _global.JSON;
	var _stringify = $JSON && $JSON.stringify;
	var PROTOTYPE$2 = 'prototype';
	var HIDDEN = _wks('_hidden');
	var TO_PRIMITIVE = _wks('toPrimitive');
	var isEnum = {}.propertyIsEnumerable;
	var SymbolRegistry = _shared('symbol-registry');
	var AllSymbols = _shared('symbols');
	var OPSymbols = _shared('op-symbols');
	var ObjectProto = Object[PROTOTYPE$2];
	var USE_NATIVE = typeof $Symbol == 'function';
	var QObject = _global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE$2] || !QObject[PROTOTYPE$2].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = _descriptors && _fails(function () {
	  return _objectCreate(dP$1({}, 'a', {
	    get: function () { return dP$1(this, 'a', { value: 7 }).a; }
	  })).a != 7;
	}) ? function (it, key, D) {
	  var protoDesc = gOPD$1(ObjectProto, key);
	  if (protoDesc) delete ObjectProto[key];
	  dP$1(it, key, D);
	  if (protoDesc && it !== ObjectProto) dP$1(ObjectProto, key, protoDesc);
	} : dP$1;

	var wrap = function (tag) {
	  var sym = AllSymbols[tag] = _objectCreate($Symbol[PROTOTYPE$2]);
	  sym._k = tag;
	  return sym;
	};

	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  return it instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(it, key, D) {
	  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
	  _anObject(it);
	  key = _toPrimitive(key, true);
	  _anObject(D);
	  if (_has(AllSymbols, key)) {
	    if (!D.enumerable) {
	      if (!_has(it, HIDDEN)) dP$1(it, HIDDEN, _propertyDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if (_has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
	      D = _objectCreate(D, { enumerable: _propertyDesc(0, false) });
	    } return setSymbolDesc(it, key, D);
	  } return dP$1(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P) {
	  _anObject(it);
	  var keys = _enumKeys(P = _toIobject(P));
	  var i = 0;
	  var l = keys.length;
	  var key;
	  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P) {
	  return P === undefined ? _objectCreate(it) : $defineProperties(_objectCreate(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key) {
	  var E = isEnum.call(this, key = _toPrimitive(key, true));
	  if (this === ObjectProto && _has(AllSymbols, key) && !_has(OPSymbols, key)) return false;
	  return E || !_has(this, key) || !_has(AllSymbols, key) || _has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
	  it = _toIobject(it);
	  key = _toPrimitive(key, true);
	  if (it === ObjectProto && _has(AllSymbols, key) && !_has(OPSymbols, key)) return;
	  var D = gOPD$1(it, key);
	  if (D && _has(AllSymbols, key) && !(_has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it) {
	  var names = gOPN$1(_toIobject(it));
	  var result = [];
	  var i = 0;
	  var key;
	  while (names.length > i) {
	    if (!_has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
	  var IS_OP = it === ObjectProto;
	  var names = gOPN$1(IS_OP ? OPSymbols : _toIobject(it));
	  var result = [];
	  var i = 0;
	  var key;
	  while (names.length > i) {
	    if (_has(AllSymbols, key = names[i++]) && (IS_OP ? _has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
	  } return result;
	};

	// 19.4.1.1 Symbol([description])
	if (!USE_NATIVE) {
	  $Symbol = function Symbol() {
	    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
	    var tag = _uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function (value) {
	      if (this === ObjectProto) $set.call(OPSymbols, value);
	      if (_has(this, HIDDEN) && _has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, _propertyDesc(1, value));
	    };
	    if (_descriptors && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
	    return wrap(tag);
	  };
	  _redefine($Symbol[PROTOTYPE$2], 'toString', function toString() {
	    return this._k;
	  });

	  _objectGopd.f = $getOwnPropertyDescriptor;
	  _objectDp.f = $defineProperty;
	  _objectGopn.f = _objectGopnExt.f = $getOwnPropertyNames;
	  _objectPie.f = $propertyIsEnumerable;
	  _objectGops.f = $getOwnPropertySymbols;

	  if (_descriptors && !_library) {
	    _redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }

	  _wksExt.f = function (name) {
	    return wrap(_wks(name));
	  };
	}

	_export(_export.G + _export.W + _export.F * !USE_NATIVE, { Symbol: $Symbol });

	for (var es6Symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), j = 0; es6Symbols.length > j;)_wks(es6Symbols[j++]);

	for (var wellKnownSymbols = _objectKeys(_wks.store), k = 0; wellKnownSymbols.length > k;) _wksDefine(wellKnownSymbols[k++]);

	_export(_export.S + _export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function (key) {
	    return _has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(sym) {
	    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
	    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
	  },
	  useSetter: function () { setter = true; },
	  useSimple: function () { setter = false; }
	});

	_export(_export.S + _export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && _export(_export.S + _export.F * (!USE_NATIVE || _fails(function () {
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it) {
	    var args = [it];
	    var i = 1;
	    var replacer, $replacer;
	    while (arguments.length > i) args.push(arguments[i++]);
	    $replacer = replacer = args[1];
	    if (!_isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
	    if (!_isArray(replacer)) replacer = function (key, value) {
	      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
	      if (!isSymbol(value)) return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});

	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE$2][TO_PRIMITIVE] || _hide($Symbol[PROTOTYPE$2], TO_PRIMITIVE, $Symbol[PROTOTYPE$2].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	_setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	_setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	_setToStringTag(_global.JSON, 'JSON', true);

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

	var _anInstance = function (it, Constructor, name, forbiddenField) {
	  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
	    throw TypeError(name + ': incorrect invocation!');
	  } return it;
	};

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

	var _iterators = {};

	// check on default Array iterator

	var ITERATOR = _wks('iterator');
	var ArrayProto = Array.prototype;

	var _isArrayIter = function (it) {
	  return it !== undefined && (_iterators.Array === it || ArrayProto[ITERATOR] === it);
	};

	var ITERATOR$1 = _wks('iterator');

	var core_getIteratorMethod = _core.getIteratorMethod = function (it) {
	  if (it != undefined) return it[ITERATOR$1]
	    || it['@@iterator']
	    || _iterators[_classof(it)];
	};

	var _forOf = createCommonjsModule(function (module) {
	var BREAK = {};
	var RETURN = {};
	var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
	  var iterFn = ITERATOR ? function () { return iterable; } : core_getIteratorMethod(iterable);
	  var f = _ctx(fn, that, entries ? 2 : 1);
	  var index = 0;
	  var length, step, iterator, result;
	  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
	  // fast case for arrays with default iterator
	  if (_isArrayIter(iterFn)) for (length = _toLength(iterable.length); length > index; index++) {
	    result = entries ? f(_anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
	    if (result === BREAK || result === RETURN) return result;
	  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
	    result = _iterCall(iterator, f, step.value, entries);
	    if (result === BREAK || result === RETURN) return result;
	  }
	};
	exports.BREAK = BREAK;
	exports.RETURN = RETURN;
	});

	// 7.3.20 SpeciesConstructor(O, defaultConstructor)


	var SPECIES = _wks('species');
	var _speciesConstructor = function (O, D) {
	  var C = _anObject(O).constructor;
	  var S;
	  return C === undefined || (S = _anObject(C)[SPECIES]) == undefined ? D : _aFunction(S);
	};

	// fast apply, http://jsperf.lnkit.com/fast-apply/5
	var _invoke = function (fn, args, that) {
	  var un = that === undefined;
	  switch (args.length) {
	    case 0: return un ? fn()
	                      : fn.call(that);
	    case 1: return un ? fn(args[0])
	                      : fn.call(that, args[0]);
	    case 2: return un ? fn(args[0], args[1])
	                      : fn.call(that, args[0], args[1]);
	    case 3: return un ? fn(args[0], args[1], args[2])
	                      : fn.call(that, args[0], args[1], args[2]);
	    case 4: return un ? fn(args[0], args[1], args[2], args[3])
	                      : fn.call(that, args[0], args[1], args[2], args[3]);
	  } return fn.apply(that, args);
	};

	var process = _global.process;
	var setTask = _global.setImmediate;
	var clearTask = _global.clearImmediate;
	var MessageChannel = _global.MessageChannel;
	var Dispatch = _global.Dispatch;
	var counter = 0;
	var queue = {};
	var ONREADYSTATECHANGE = 'onreadystatechange';
	var defer, channel, port;
	var run = function () {
	  var id = +this;
	  // eslint-disable-next-line no-prototype-builtins
	  if (queue.hasOwnProperty(id)) {
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	};
	var listener = function (event) {
	  run.call(event.data);
	};
	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if (!setTask || !clearTask) {
	  setTask = function setImmediate(fn) {
	    var args = [];
	    var i = 1;
	    while (arguments.length > i) args.push(arguments[i++]);
	    queue[++counter] = function () {
	      // eslint-disable-next-line no-new-func
	      _invoke(typeof fn == 'function' ? fn : Function(fn), args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clearTask = function clearImmediate(id) {
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if (_cof(process) == 'process') {
	    defer = function (id) {
	      process.nextTick(_ctx(run, id, 1));
	    };
	  // Sphere (JS game engine) Dispatch API
	  } else if (Dispatch && Dispatch.now) {
	    defer = function (id) {
	      Dispatch.now(_ctx(run, id, 1));
	    };
	  // Browsers with MessageChannel, includes WebWorkers
	  } else if (MessageChannel) {
	    channel = new MessageChannel();
	    port = channel.port2;
	    channel.port1.onmessage = listener;
	    defer = _ctx(port.postMessage, port, 1);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if (_global.addEventListener && typeof postMessage == 'function' && !_global.importScripts) {
	    defer = function (id) {
	      _global.postMessage(id + '', '*');
	    };
	    _global.addEventListener('message', listener, false);
	  // IE8-
	  } else if (ONREADYSTATECHANGE in _domCreate('script')) {
	    defer = function (id) {
	      _html.appendChild(_domCreate('script'))[ONREADYSTATECHANGE] = function () {
	        _html.removeChild(this);
	        run.call(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function (id) {
	      setTimeout(_ctx(run, id, 1), 0);
	    };
	  }
	}
	var _task = {
	  set: setTask,
	  clear: clearTask
	};

	var macrotask = _task.set;
	var Observer = _global.MutationObserver || _global.WebKitMutationObserver;
	var process$1 = _global.process;
	var Promise$1 = _global.Promise;
	var isNode = _cof(process$1) == 'process';

	var _microtask = function () {
	  var head, last, notify;

	  var flush = function () {
	    var parent, fn;
	    if (isNode && (parent = process$1.domain)) parent.exit();
	    while (head) {
	      fn = head.fn;
	      head = head.next;
	      try {
	        fn();
	      } catch (e) {
	        if (head) notify();
	        else last = undefined;
	        throw e;
	      }
	    } last = undefined;
	    if (parent) parent.enter();
	  };

	  // Node.js
	  if (isNode) {
	    notify = function () {
	      process$1.nextTick(flush);
	    };
	  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
	  } else if (Observer && !(_global.navigator && _global.navigator.standalone)) {
	    var toggle = true;
	    var node = document.createTextNode('');
	    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
	    notify = function () {
	      node.data = toggle = !toggle;
	    };
	  // environments with maybe non-completely correct, but existent Promise
	  } else if (Promise$1 && Promise$1.resolve) {
	    // Promise.resolve without an argument throws an error in LG WebOS 2
	    var promise = Promise$1.resolve(undefined);
	    notify = function () {
	      promise.then(flush);
	    };
	  // for other environments - macrotask based on:
	  // - setImmediate
	  // - MessageChannel
	  // - window.postMessag
	  // - onreadystatechange
	  // - setTimeout
	  } else {
	    notify = function () {
	      // strange IE + webpack dev server bug - use .call(global)
	      macrotask.call(_global, flush);
	    };
	  }

	  return function (fn) {
	    var task = { fn: fn, next: undefined };
	    if (last) last.next = task;
	    if (!head) {
	      head = task;
	      notify();
	    } last = task;
	  };
	};

	// 25.4.1.5 NewPromiseCapability(C)


	function PromiseCapability(C) {
	  var resolve, reject;
	  this.promise = new C(function ($$resolve, $$reject) {
	    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
	    resolve = $$resolve;
	    reject = $$reject;
	  });
	  this.resolve = _aFunction(resolve);
	  this.reject = _aFunction(reject);
	}

	var f$7 = function (C) {
	  return new PromiseCapability(C);
	};

	var _newPromiseCapability = {
		f: f$7
	};

	var _perform = function (exec) {
	  try {
	    return { e: false, v: exec() };
	  } catch (e) {
	    return { e: true, v: e };
	  }
	};

	var navigator = _global.navigator;

	var _userAgent = navigator && navigator.userAgent || '';

	var _promiseResolve = function (C, x) {
	  _anObject(C);
	  if (_isObject(x) && x.constructor === C) return x;
	  var promiseCapability = _newPromiseCapability.f(C);
	  var resolve = promiseCapability.resolve;
	  resolve(x);
	  return promiseCapability.promise;
	};

	var _redefineAll = function (target, src, safe) {
	  for (var key in src) _redefine(target, key, src[key], safe);
	  return target;
	};

	var SPECIES$1 = _wks('species');

	var _setSpecies = function (KEY) {
	  var C = _global[KEY];
	  if (_descriptors && C && !C[SPECIES$1]) _objectDp.f(C, SPECIES$1, {
	    configurable: true,
	    get: function () { return this; }
	  });
	};

	var ITERATOR$2 = _wks('iterator');
	var SAFE_CLOSING = false;

	try {
	  var riter = [7][ITERATOR$2]();
	  riter['return'] = function () { SAFE_CLOSING = true; };
	} catch (e) { /* empty */ }

	var _iterDetect = function (exec, skipClosing) {
	  if (!skipClosing && !SAFE_CLOSING) return false;
	  var safe = false;
	  try {
	    var arr = [7];
	    var iter = arr[ITERATOR$2]();
	    iter.next = function () { return { done: safe = true }; };
	    arr[ITERATOR$2] = function () { return iter; };
	    exec(arr);
	  } catch (e) { /* empty */ }
	  return safe;
	};

	var task = _task.set;
	var microtask = _microtask();




	var PROMISE = 'Promise';
	var TypeError$1 = _global.TypeError;
	var process$2 = _global.process;
	var versions = process$2 && process$2.versions;
	var v8 = versions && versions.v8 || '';
	var $Promise = _global[PROMISE];
	var isNode$1 = _classof(process$2) == 'process';
	var empty = function () { /* empty */ };
	var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
	var newPromiseCapability = newGenericPromiseCapability = _newPromiseCapability.f;

	var USE_NATIVE$1 = !!function () {
	  try {
	    // correct subclassing with @@species support
	    var promise = $Promise.resolve(1);
	    var FakePromise = (promise.constructor = {})[_wks('species')] = function (exec) {
	      exec(empty, empty);
	    };
	    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
	    return (isNode$1 || typeof PromiseRejectionEvent == 'function')
	      && promise.then(empty) instanceof FakePromise
	      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
	      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
	      // we can't detect it synchronously, so just check versions
	      && v8.indexOf('6.6') !== 0
	      && _userAgent.indexOf('Chrome/66') === -1;
	  } catch (e) { /* empty */ }
	}();

	// helpers
	var isThenable = function (it) {
	  var then;
	  return _isObject(it) && typeof (then = it.then) == 'function' ? then : false;
	};
	var notify = function (promise, isReject) {
	  if (promise._n) return;
	  promise._n = true;
	  var chain = promise._c;
	  microtask(function () {
	    var value = promise._v;
	    var ok = promise._s == 1;
	    var i = 0;
	    var run = function (reaction) {
	      var handler = ok ? reaction.ok : reaction.fail;
	      var resolve = reaction.resolve;
	      var reject = reaction.reject;
	      var domain = reaction.domain;
	      var result, then, exited;
	      try {
	        if (handler) {
	          if (!ok) {
	            if (promise._h == 2) onHandleUnhandled(promise);
	            promise._h = 1;
	          }
	          if (handler === true) result = value;
	          else {
	            if (domain) domain.enter();
	            result = handler(value); // may throw
	            if (domain) {
	              domain.exit();
	              exited = true;
	            }
	          }
	          if (result === reaction.promise) {
	            reject(TypeError$1('Promise-chain cycle'));
	          } else if (then = isThenable(result)) {
	            then.call(result, resolve, reject);
	          } else resolve(result);
	        } else reject(value);
	      } catch (e) {
	        if (domain && !exited) domain.exit();
	        reject(e);
	      }
	    };
	    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
	    promise._c = [];
	    promise._n = false;
	    if (isReject && !promise._h) onUnhandled(promise);
	  });
	};
	var onUnhandled = function (promise) {
	  task.call(_global, function () {
	    var value = promise._v;
	    var unhandled = isUnhandled(promise);
	    var result, handler, console;
	    if (unhandled) {
	      result = _perform(function () {
	        if (isNode$1) {
	          process$2.emit('unhandledRejection', value, promise);
	        } else if (handler = _global.onunhandledrejection) {
	          handler({ promise: promise, reason: value });
	        } else if ((console = _global.console) && console.error) {
	          console.error('Unhandled promise rejection', value);
	        }
	      });
	      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
	      promise._h = isNode$1 || isUnhandled(promise) ? 2 : 1;
	    } promise._a = undefined;
	    if (unhandled && result.e) throw result.v;
	  });
	};
	var isUnhandled = function (promise) {
	  return promise._h !== 1 && (promise._a || promise._c).length === 0;
	};
	var onHandleUnhandled = function (promise) {
	  task.call(_global, function () {
	    var handler;
	    if (isNode$1) {
	      process$2.emit('rejectionHandled', promise);
	    } else if (handler = _global.onrejectionhandled) {
	      handler({ promise: promise, reason: promise._v });
	    }
	  });
	};
	var $reject = function (value) {
	  var promise = this;
	  if (promise._d) return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap
	  promise._v = value;
	  promise._s = 2;
	  if (!promise._a) promise._a = promise._c.slice();
	  notify(promise, true);
	};
	var $resolve = function (value) {
	  var promise = this;
	  var then;
	  if (promise._d) return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap
	  try {
	    if (promise === value) throw TypeError$1("Promise can't be resolved itself");
	    if (then = isThenable(value)) {
	      microtask(function () {
	        var wrapper = { _w: promise, _d: false }; // wrap
	        try {
	          then.call(value, _ctx($resolve, wrapper, 1), _ctx($reject, wrapper, 1));
	        } catch (e) {
	          $reject.call(wrapper, e);
	        }
	      });
	    } else {
	      promise._v = value;
	      promise._s = 1;
	      notify(promise, false);
	    }
	  } catch (e) {
	    $reject.call({ _w: promise, _d: false }, e); // wrap
	  }
	};

	// constructor polyfill
	if (!USE_NATIVE$1) {
	  // 25.4.3.1 Promise(executor)
	  $Promise = function Promise(executor) {
	    _anInstance(this, $Promise, PROMISE, '_h');
	    _aFunction(executor);
	    Internal.call(this);
	    try {
	      executor(_ctx($resolve, this, 1), _ctx($reject, this, 1));
	    } catch (err) {
	      $reject.call(this, err);
	    }
	  };
	  // eslint-disable-next-line no-unused-vars
	  Internal = function Promise(executor) {
	    this._c = [];             // <- awaiting reactions
	    this._a = undefined;      // <- checked in isUnhandled reactions
	    this._s = 0;              // <- state
	    this._d = false;          // <- done
	    this._v = undefined;      // <- value
	    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
	    this._n = false;          // <- notify
	  };
	  Internal.prototype = _redefineAll($Promise.prototype, {
	    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
	    then: function then(onFulfilled, onRejected) {
	      var reaction = newPromiseCapability(_speciesConstructor(this, $Promise));
	      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
	      reaction.fail = typeof onRejected == 'function' && onRejected;
	      reaction.domain = isNode$1 ? process$2.domain : undefined;
	      this._c.push(reaction);
	      if (this._a) this._a.push(reaction);
	      if (this._s) notify(this, false);
	      return reaction.promise;
	    },
	    // 25.4.5.1 Promise.prototype.catch(onRejected)
	    'catch': function (onRejected) {
	      return this.then(undefined, onRejected);
	    }
	  });
	  OwnPromiseCapability = function () {
	    var promise = new Internal();
	    this.promise = promise;
	    this.resolve = _ctx($resolve, promise, 1);
	    this.reject = _ctx($reject, promise, 1);
	  };
	  _newPromiseCapability.f = newPromiseCapability = function (C) {
	    return C === $Promise || C === Wrapper
	      ? new OwnPromiseCapability(C)
	      : newGenericPromiseCapability(C);
	  };
	}

	_export(_export.G + _export.W + _export.F * !USE_NATIVE$1, { Promise: $Promise });
	_setToStringTag($Promise, PROMISE);
	_setSpecies(PROMISE);
	Wrapper = _core[PROMISE];

	// statics
	_export(_export.S + _export.F * !USE_NATIVE$1, PROMISE, {
	  // 25.4.4.5 Promise.reject(r)
	  reject: function reject(r) {
	    var capability = newPromiseCapability(this);
	    var $$reject = capability.reject;
	    $$reject(r);
	    return capability.promise;
	  }
	});
	_export(_export.S + _export.F * (_library || !USE_NATIVE$1), PROMISE, {
	  // 25.4.4.6 Promise.resolve(x)
	  resolve: function resolve(x) {
	    return _promiseResolve(_library && this === Wrapper ? $Promise : this, x);
	  }
	});
	_export(_export.S + _export.F * !(USE_NATIVE$1 && _iterDetect(function (iter) {
	  $Promise.all(iter)['catch'](empty);
	})), PROMISE, {
	  // 25.4.4.1 Promise.all(iterable)
	  all: function all(iterable) {
	    var C = this;
	    var capability = newPromiseCapability(C);
	    var resolve = capability.resolve;
	    var reject = capability.reject;
	    var result = _perform(function () {
	      var values = [];
	      var index = 0;
	      var remaining = 1;
	      _forOf(iterable, false, function (promise) {
	        var $index = index++;
	        var alreadyCalled = false;
	        values.push(undefined);
	        remaining++;
	        C.resolve(promise).then(function (value) {
	          if (alreadyCalled) return;
	          alreadyCalled = true;
	          values[$index] = value;
	          --remaining || resolve(values);
	        }, reject);
	      });
	      --remaining || resolve(values);
	    });
	    if (result.e) reject(result.v);
	    return capability.promise;
	  },
	  // 25.4.4.4 Promise.race(iterable)
	  race: function race(iterable) {
	    var C = this;
	    var capability = newPromiseCapability(C);
	    var reject = capability.reject;
	    var result = _perform(function () {
	      _forOf(iterable, false, function (promise) {
	        C.resolve(promise).then(capability.resolve, reject);
	      });
	    });
	    if (result.e) reject(result.v);
	    return capability.promise;
	  }
	});

	// 22.1.3.31 Array.prototype[@@unscopables]
	var UNSCOPABLES = _wks('unscopables');
	var ArrayProto$1 = Array.prototype;
	if (ArrayProto$1[UNSCOPABLES] == undefined) _hide(ArrayProto$1, UNSCOPABLES, {});
	var _addToUnscopables = function (key) {
	  ArrayProto$1[UNSCOPABLES][key] = true;
	};

	var _iterStep = function (done, value) {
	  return { value: value, done: !!done };
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
	var ObjectProto$1 = Object.prototype;

	var _objectGpo = Object.getPrototypeOf || function (O) {
	  O = _toObject(O);
	  if (_has(O, IE_PROTO$2)) return O[IE_PROTO$2];
	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto$1 : null;
	};

	var ITERATOR$3 = _wks('iterator');
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
	  var $native = proto[ITERATOR$3] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
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
	      if (typeof IteratorPrototype[ITERATOR$3] != 'function') _hide(IteratorPrototype, ITERATOR$3, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if (DEF_VALUES && $native && $native.name !== VALUES) {
	    VALUES_BUG = true;
	    $default = function values() { return $native.call(this); };
	  }
	  // Define iterator
	  if (BUGGY || VALUES_BUG || !proto[ITERATOR$3]) {
	    _hide(proto, ITERATOR$3, $default);
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

	var ITERATOR$4 = _wks('iterator');
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
	    if (!proto[ITERATOR$4]) _hide(proto, ITERATOR$4, ArrayValues);
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

	// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()

	var getTime = Date.prototype.getTime;
	var $toISOString = Date.prototype.toISOString;

	var lz = function (num) {
	  return num > 9 ? num : '0' + num;
	};

	// PhantomJS / old WebKit has a broken implementations
	var _dateToIsoString = (_fails(function () {
	  return $toISOString.call(new Date(-5e13 - 1)) != '0385-07-25T07:06:39.999Z';
	}) || !_fails(function () {
	  $toISOString.call(new Date(NaN));
	})) ? function toISOString() {
	  if (!isFinite(getTime.call(this))) throw RangeError('Invalid time value');
	  var d = this;
	  var y = d.getUTCFullYear();
	  var m = d.getUTCMilliseconds();
	  var s = y < 0 ? '-' : y > 9999 ? '+' : '';
	  return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
	    '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
	    'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
	    ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
	} : $toISOString;

	// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()



	// PhantomJS / old WebKit has a broken implementations
	_export(_export.P + _export.F * (Date.prototype.toISOString !== _dateToIsoString), 'Date', {
	  toISOString: _dateToIsoString
	});

	var _strictMethod = function (method, arg) {
	  return !!method && _fails(function () {
	    // eslint-disable-next-line no-useless-call
	    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
	  });
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

	// 7.2.8 IsRegExp(argument)


	var MATCH = _wks('match');
	var _isRegexp = function (it) {
	  var isRegExp;
	  return _isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : _cof(it) == 'RegExp');
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

	var at = _stringAt(true);

	 // `AdvanceStringIndex` abstract operation
	// https://tc39.github.io/ecma262/#sec-advancestringindex
	var _advanceStringIndex = function (S, index, unicode) {
	  return index + (unicode ? at(S, index).length : 1);
	};

	var builtinExec = RegExp.prototype.exec;

	 // `RegExpExec` abstract operation
	// https://tc39.github.io/ecma262/#sec-regexpexec
	var _regexpExecAbstract = function (R, S) {
	  var exec = R.exec;
	  if (typeof exec === 'function') {
	    var result = exec.call(R, S);
	    if (typeof result !== 'object') {
	      throw new TypeError('RegExp exec method returned something other than an Object or null');
	    }
	    return result;
	  }
	  if (_classof(R) !== 'RegExp') {
	    throw new TypeError('RegExp#exec called on incompatible receiver');
	  }
	  return builtinExec.call(R, S);
	};

	// 21.2.5.3 get RegExp.prototype.flags

	var _flags = function () {
	  var that = _anObject(this);
	  var result = '';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.unicode) result += 'u';
	  if (that.sticky) result += 'y';
	  return result;
	};

	var nativeExec = RegExp.prototype.exec;
	// This always refers to the native implementation, because the
	// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
	// which loads this file before patching the method.
	var nativeReplace = String.prototype.replace;

	var patchedExec = nativeExec;

	var LAST_INDEX = 'lastIndex';

	var UPDATES_LAST_INDEX_WRONG = (function () {
	  var re1 = /a/,
	      re2 = /b*/g;
	  nativeExec.call(re1, 'a');
	  nativeExec.call(re2, 'a');
	  return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
	})();

	// nonparticipating capturing group, copied from es5-shim's String#split patch.
	var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

	var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

	if (PATCH) {
	  patchedExec = function exec(str) {
	    var re = this;
	    var lastIndex, reCopy, match, i;

	    if (NPCG_INCLUDED) {
	      reCopy = new RegExp('^' + re.source + '$(?!\\s)', _flags.call(re));
	    }
	    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

	    match = nativeExec.call(re, str);

	    if (UPDATES_LAST_INDEX_WRONG && match) {
	      re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
	    }
	    if (NPCG_INCLUDED && match && match.length > 1) {
	      // Fix browsers whose `exec` methods don't consistently return `undefined`
	      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
	      // eslint-disable-next-line no-loop-func
	      nativeReplace.call(match[0], reCopy, function () {
	        for (i = 1; i < arguments.length - 2; i++) {
	          if (arguments[i] === undefined) match[i] = undefined;
	        }
	      });
	    }

	    return match;
	  };
	}

	var _regexpExec = patchedExec;

	_export({
	  target: 'RegExp',
	  proto: true,
	  forced: _regexpExec !== /./.exec
	}, {
	  exec: _regexpExec
	});

	var SPECIES$2 = _wks('species');

	var REPLACE_SUPPORTS_NAMED_GROUPS = !_fails(function () {
	  // #replace needs built-in support for named groups.
	  // #match works fine because it just return the exec results, even if it has
	  // a "grops" property.
	  var re = /./;
	  re.exec = function () {
	    var result = [];
	    result.groups = { a: '7' };
	    return result;
	  };
	  return ''.replace(re, '$<a>') !== '7';
	});

	var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
	  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
	  var re = /(?:)/;
	  var originalExec = re.exec;
	  re.exec = function () { return originalExec.apply(this, arguments); };
	  var result = 'ab'.split(re);
	  return result.length === 2 && result[0] === 'a' && result[1] === 'b';
	})();

	var _fixReWks = function (KEY, length, exec) {
	  var SYMBOL = _wks(KEY);

	  var DELEGATES_TO_SYMBOL = !_fails(function () {
	    // String methods call symbol-named RegEp methods
	    var O = {};
	    O[SYMBOL] = function () { return 7; };
	    return ''[KEY](O) != 7;
	  });

	  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !_fails(function () {
	    // Symbol-named RegExp methods call .exec
	    var execCalled = false;
	    var re = /a/;
	    re.exec = function () { execCalled = true; return null; };
	    if (KEY === 'split') {
	      // RegExp[@@split] doesn't call the regex's exec method, but first creates
	      // a new one. We need to return the patched regex when creating the new one.
	      re.constructor = {};
	      re.constructor[SPECIES$2] = function () { return re; };
	    }
	    re[SYMBOL]('');
	    return !execCalled;
	  }) : undefined;

	  if (
	    !DELEGATES_TO_SYMBOL ||
	    !DELEGATES_TO_EXEC ||
	    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
	    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
	  ) {
	    var nativeRegExpMethod = /./[SYMBOL];
	    var fns = exec(
	      _defined,
	      SYMBOL,
	      ''[KEY],
	      function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
	        if (regexp.exec === _regexpExec) {
	          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
	            // The native String method already delegates to @@method (this
	            // polyfilled function), leasing to infinite recursion.
	            // We avoid it by directly calling the native @@method method.
	            return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
	          }
	          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
	        }
	        return { done: false };
	      }
	    );
	    var strfn = fns[0];
	    var rxfn = fns[1];

	    _redefine(String.prototype, KEY, strfn);
	    _hide(RegExp.prototype, SYMBOL, length == 2
	      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
	      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
	      ? function (string, arg) { return rxfn.call(string, this, arg); }
	      // 21.2.5.6 RegExp.prototype[@@match](string)
	      // 21.2.5.9 RegExp.prototype[@@search](string)
	      : function (string) { return rxfn.call(string, this); }
	    );
	  }
	};

	var $min = Math.min;
	var $push = [].push;
	var $SPLIT = 'split';
	var LENGTH = 'length';
	var LAST_INDEX$1 = 'lastIndex';
	var MAX_UINT32 = 0xffffffff;

	// babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
	var SUPPORTS_Y = !_fails(function () { });

	// @@split logic
	_fixReWks('split', 2, function (defined, SPLIT, $split, maybeCallNative) {
	  var internalSplit;
	  if (
	    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
	    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
	    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
	    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
	    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
	    ''[$SPLIT](/.?/)[LENGTH]
	  ) {
	    // based on es5-shim implementation, need to rework it
	    internalSplit = function (separator, limit) {
	      var string = String(this);
	      if (separator === undefined && limit === 0) return [];
	      // If `separator` is not a regex, use native split
	      if (!_isRegexp(separator)) return $split.call(string, separator, limit);
	      var output = [];
	      var flags = (separator.ignoreCase ? 'i' : '') +
	                  (separator.multiline ? 'm' : '') +
	                  (separator.unicode ? 'u' : '') +
	                  (separator.sticky ? 'y' : '');
	      var lastLastIndex = 0;
	      var splitLimit = limit === undefined ? MAX_UINT32 : limit >>> 0;
	      // Make `global` and avoid `lastIndex` issues by working with a copy
	      var separatorCopy = new RegExp(separator.source, flags + 'g');
	      var match, lastIndex, lastLength;
	      while (match = _regexpExec.call(separatorCopy, string)) {
	        lastIndex = separatorCopy[LAST_INDEX$1];
	        if (lastIndex > lastLastIndex) {
	          output.push(string.slice(lastLastIndex, match.index));
	          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
	          lastLength = match[0][LENGTH];
	          lastLastIndex = lastIndex;
	          if (output[LENGTH] >= splitLimit) break;
	        }
	        if (separatorCopy[LAST_INDEX$1] === match.index) separatorCopy[LAST_INDEX$1]++; // Avoid an infinite loop
	      }
	      if (lastLastIndex === string[LENGTH]) {
	        if (lastLength || !separatorCopy.test('')) output.push('');
	      } else output.push(string.slice(lastLastIndex));
	      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
	    };
	  // Chakra, V8
	  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
	    internalSplit = function (separator, limit) {
	      return separator === undefined && limit === 0 ? [] : $split.call(this, separator, limit);
	    };
	  } else {
	    internalSplit = $split;
	  }

	  return [
	    // `String.prototype.split` method
	    // https://tc39.github.io/ecma262/#sec-string.prototype.split
	    function split(separator, limit) {
	      var O = defined(this);
	      var splitter = separator == undefined ? undefined : separator[SPLIT];
	      return splitter !== undefined
	        ? splitter.call(separator, O, limit)
	        : internalSplit.call(String(O), separator, limit);
	    },
	    // `RegExp.prototype[@@split]` method
	    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
	    //
	    // NOTE: This cannot be properly polyfilled in engines that don't support
	    // the 'y' flag.
	    function (regexp, limit) {
	      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== $split);
	      if (res.done) return res.value;

	      var rx = _anObject(regexp);
	      var S = String(this);
	      var C = _speciesConstructor(rx, RegExp);

	      var unicodeMatching = rx.unicode;
	      var flags = (rx.ignoreCase ? 'i' : '') +
	                  (rx.multiline ? 'm' : '') +
	                  (rx.unicode ? 'u' : '') +
	                  (SUPPORTS_Y ? 'y' : 'g');

	      // ^(? + rx + ) is needed, in combination with some S slicing, to
	      // simulate the 'y' flag.
	      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
	      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	      if (lim === 0) return [];
	      if (S.length === 0) return _regexpExecAbstract(splitter, S) === null ? [S] : [];
	      var p = 0;
	      var q = 0;
	      var A = [];
	      while (q < S.length) {
	        splitter.lastIndex = SUPPORTS_Y ? q : 0;
	        var z = _regexpExecAbstract(splitter, SUPPORTS_Y ? S : S.slice(q));
	        var e;
	        if (
	          z === null ||
	          (e = $min(_toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
	        ) {
	          q = _advanceStringIndex(S, q, unicodeMatching);
	        } else {
	          A.push(S.slice(p, q));
	          if (A.length === lim) return A;
	          for (var i = 1; i <= z.length - 1; i++) {
	            A.push(z[i]);
	            if (A.length === lim) return A;
	          }
	          q = p = e;
	        }
	      }
	      A.push(S.slice(p));
	      return A;
	    }
	  ];
	});

	var SPECIES$3 = _wks('species');

	var _arraySpeciesConstructor = function (original) {
	  var C;
	  if (_isArray(original)) {
	    C = original.constructor;
	    // cross-realm fallback
	    if (typeof C == 'function' && (C === Array || _isArray(C.prototype))) C = undefined;
	    if (_isObject(C)) {
	      C = C[SPECIES$3];
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

	var $map = _arrayMethods(1);

	_export(_export.P + _export.F * !_strictMethod([].map, true), 'Array', {
	  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
	  map: function map(callbackfn /* , thisArg */) {
	    return $map(this, callbackfn, arguments[1]);
	  }
	});

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

	var gOPN$2 = _objectGopn.f;
	var gOPD$2 = _objectGopd.f;
	var dP$2 = _objectDp.f;
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
	  for (var keys = _descriptors ? gOPN$2(Base) : (
	    // ES3:
	    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
	    // ES6 (in case, if modules with ES6 Number statics required before):
	    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
	    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
	  ).split(','), j$1 = 0, key$1; keys.length > j$1; j$1++) {
	    if (_has(Base, key$1 = keys[j$1]) && !_has($Number, key$1)) {
	      dP$2($Number, key$1, gOPD$2(Base, key$1));
	    }
	  }
	  $Number.prototype = proto$1;
	  proto$1.constructor = $Number;
	  _redefine(_global, NUMBER, $Number);
	}

	var settings = {
	  alt: i18next.t("alt", {
	    ns: "airPassengers"
	  }),
	  margin: {
	    top: 50,
	    left: 90,
	    right: 30,
	    bottom: 50
	  },
	  filterData: function filterData(data) {
	    return baseDateFilter(data);
	  },
	  x: {
	    getLabel: function getLabel() {
	      return i18next.t("x_label", {
	        ns: "airPassengers"
	      });
	    },
	    getValue: function getValue(d, i) {
	      // return new Date(d.date + "-01");
	      // for first year, start at Jan -01T00:00:00.000Z
	      // for last year, end one ms past midnight so that year label gets plotted
	      return i === 0 ? new Date(d.date + "-01") : new Date(d.date, 0, 1, 0, 0, 0, 1);
	    },
	    getText: function getText(d) {
	      return d.date;
	    },
	    ticks: 7
	  },
	  y: {
	    label: i18next.t("y_label", {
	      ns: "airPassengers"
	    }),
	    getLabel: function getLabel() {
	      return i18next.t("y_label", {
	        ns: "airPassengers"
	      });
	    },
	    getValue: function getValue(d, key) {
	      if (d[key] === "x" || d[key] === "..") {
	        return undefined;
	      } else return Number(d[key]) * 1.0 / 1000;
	    },
	    getTotal: function getTotal(d, index, data) {
	      var total;
	      var keys;
	      var sett = this;

	      if (!d[sett.y.totalProperty]) {
	        keys = sett.z.getKeys.call(sett, data);
	        total = 0;

	        for (var k = 0; k < keys.length; k++) {
	          total += sett.y.getValue.call(sett, d, keys[k], data);
	        }

	        d[sett.y.totalProperty] = total;
	      }

	      return d[sett.y.totalProperty];
	    },
	    getText: function getText(d, key) {
	      if (d[key] === "x" || d[key] === "..") {
	        return d[key];
	      } else return Number(d[key]) * 1.0 / 1000;
	    },
	    ticks: 5
	  },
	  z: {
	    label: i18next.t("z_label", {
	      ns: "airPassengers"
	    }),
	    getId: function getId(d) {
	      return d.key;
	    },
	    getKeys: function getKeys(object) {
	      var sett = this;
	      var keys = Object.keys(object[0]);
	      keys.splice(keys.indexOf("date"), 1);

	      if (keys.indexOf(sett.y.totalProperty) !== -1) {
	        keys.splice(keys.indexOf(sett.y.totalProperty), 1);
	      }

	      return keys; // return keys.sort();
	      // return ["local", "Remaining_local", "itinerant", "Remaining_itinerant"];
	    },
	    getClass: function getClass() {
	      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      return this.z.getId.apply(this, args);
	    },
	    getText: function getText(d) {
	      return i18next.t(d.key, {
	        ns: "airPassengers"
	      });
	    }
	  },
	  datatable: true,
	  dataTableTotal: true,
	  // show total in data table
	  areaTableID: "areaTable",
	  // summaryId: "chrt-dt-tbl",
	  transition: true,
	  width: 1050
	};

	var baseDateFilter = function baseDateFilter(data) {
	  var minDate = new Date("2010");
	  var newData = [];

	  for (var s = 0; s < data.length; s++) {
	    var date = new Date(data[s].date);

	    if (date >= minDate) {
	      newData.push(data[s]);
	    }
	  }

	  return newData;
	};

	var settingsMajorAirports = {
	  alt: i18next.t("alt", {
	    ns: "airPassengers"
	  }),
	  margin: {
	    top: 50,
	    left: 90,
	    right: 30,
	    bottom: 50
	  },
	  filterData: function filterData(data) {
	    return baseDateFilter$1(data);
	  },
	  x: {
	    getLabel: function getLabel() {
	      return i18next.t("x_label", {
	        ns: "airPassengers"
	      });
	    },
	    getValue: function getValue(d, i) {
	      // return new Date(d.date + "-01");
	      // for first year, start at Jan -01T00:00:00.000Z
	      // for last year, end one ms past midnight so that year label gets plotted
	      return new Date(d.date + "-01"); // return i === 0 ? new Date(d.date + "-01") :
	      //   new Date(d.date, 0, 1, 0, 0, 0, 1);
	    },
	    getText: function getText(d) {
	      return d.date;
	    },
	    ticks: 7 * 6
	  },
	  y: {
	    label: i18next.t("y_label", {
	      ns: "airPassengers"
	    }),
	    getLabel: function getLabel() {
	      return i18next.t("y_label", {
	        ns: "airPassengers"
	      });
	    },
	    getValue: function getValue(d, key) {
	      if (d[key] === "x" || d[key] === "..") {
	        return 0;
	      } else return Number(d[key]) * 1.0 / 1000;
	    },
	    getTotal: function getTotal(d, index, data) {
	      var total;
	      var keys;
	      var sett = this;

	      if (!d[sett.y.totalProperty]) {
	        keys = sett.z.getKeys.call(sett, data);
	        total = 0;

	        for (var k = 0; k < keys.length; k++) {
	          total += sett.y.getValue.call(sett, d, keys[k], data);
	        }

	        d[sett.y.totalProperty] = total;
	      }

	      return d[sett.y.totalProperty];
	    },
	    getText: function getText(d, key) {
	      if (d[key] === "x" || d[key] === "..") {
	        return d[key];
	      } else return Number(d[key]) * 1.0 / 1000;
	    },
	    ticks: 5
	  },
	  z: {
	    label: i18next.t("z_label", {
	      ns: "airPassengers"
	    }),
	    getId: function getId(d) {
	      return d.key;
	    },
	    getKeys: function getKeys(object) {
	      var sett = this;
	      var keys = Object.keys(object[0]);
	      keys.splice(keys.indexOf("date"), 1);

	      if (keys.indexOf(sett.y.totalProperty) !== -1) {
	        keys.splice(keys.indexOf(sett.y.totalProperty), 1);
	      }

	      return keys; // return keys.sort();
	      // return ["local", "Remaining_local", "itinerant", "Remaining_itinerant"];
	    },
	    getClass: function getClass() {
	      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      return this.z.getId.apply(this, args);
	    },
	    getText: function getText(d) {
	      return i18next.t(d.key, {
	        ns: "airPassengers"
	      });
	    }
	  },
	  datatable: true,
	  dataTableTotal: true,
	  // show total in data table
	  areaTableID: "areaTable",
	  // summaryId: "chrt-dt-tbl",
	  transition: true,
	  width: 1050
	};

	var baseDateFilter$1 = function baseDateFilter(data) {
	  var minDate = new Date("2010");
	  var newData = [];

	  for (var s = 0; s < data.length; s++) {
	    var date = new Date(data[s].date);

	    if (date >= minDate) {
	      newData.push(data[s]);
	    }
	  }

	  return newData;
	};

	function mapColourScaleFn (svgCB, colourArray, dimExtent) {
	  var scalef = 1e3; // scale factor; MUST BE SAME AS IN AREA CHART SETTINGS

	  var rectDim = 35;
	  var formatComma = d3.format(",d"); // Create the g nodes

	  var rects = svgCB.attr("class", "mapCB").selectAll("rect").data(colourArray).enter().append("g"); // Append rects onto the g nodes and fill

	  rects.append("rect").attr("width", rectDim).attr("height", rectDim).attr("y", 5).attr("x", function (d, i) {
	    return 175 + i * rectDim;
	  }).attr("fill", function (d, i) {
	    return colourArray[i];
	  }); // define rect text labels (calculate cbValues)

	  var delta = (dimExtent[1] - dimExtent[0]) / colourArray.length;
	  var cbValues = [];
	  cbValues[0] = dimExtent[0];

	  for (var idx = 1; idx < colourArray.length; idx++) {
	    cbValues.push(Math.round(idx * delta + dimExtent[0]));
	  } // add text node to rect g


	  rects.append("text"); // Display text in text node

	  var updateText;
	  d3.select("#mapColourScale .mapCB").selectAll("text").text(function (i, j) {
	    var s0 = formatComma(cbValues[j] / scalef);
	    updateText = s0 + "+";
	    return updateText;
	  }).attr("text-anchor", "end").attr("transform", function (d, i) {
	    return "translate(" + (180 + i * (rectDim + 0)) + ", 50) " + "rotate(-45)";
	  }).style("display", function () {
	    return "inline";
	  });
	}

	function areaLegendFn (svgLegend, classArray) {
	  var rectDim = 35; // Create the g nodes

	  var rects = svgLegend.selectAll("rect").data(classArray).enter().append("g"); // Append rects onto the g nodes and fill

	  rects.append("rect").attr("width", rectDim).attr("height", rectDim).attr("y", 25).attr("x", function (d, i) {
	    return 57 + i * rectDim * 5.2;
	  }).attr("class", function (d, i) {
	    return classArray[i];
	  }); // add text node to rect g

	  rects.append("text"); // Display text in text node

	  d3.select("#areaLegend").selectAll("text").attr("y", 48).attr("x", function (d, i) {
	    return 57 + i * rectDim * 5.2 + 40;
	  }).style("display", function () {
	    return "inline";
	  });
	}

	var arraySlice = [].slice;
	var factories = {};

	var construct = function (F, len, args) {
	  if (!(len in factories)) {
	    for (var n = [], i = 0; i < len; i++) n[i] = 'a[' + i + ']';
	    // eslint-disable-next-line no-new-func
	    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
	  } return factories[len](F, args);
	};

	var _bind = Function.bind || function bind(that /* , ...args */) {
	  var fn = _aFunction(this);
	  var partArgs = arraySlice.call(arguments, 1);
	  var bound = function (/* args... */) {
	    var args = partArgs.concat(arraySlice.call(arguments));
	    return this instanceof bound ? construct(fn, args.length, args) : _invoke(fn, args, that);
	  };
	  if (_isObject(fn.prototype)) bound.prototype = fn.prototype;
	  return bound;
	};

	// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)


	_export(_export.P, 'Function', { bind: _bind });

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;
	    Object.defineProperty(target, descriptor.key, descriptor);
	  }
	}

	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  return Constructor;
	}

	var CopyButton =
	/*#__PURE__*/
	function () {
	  function CopyButton(pNode, options) {
	    _classCallCheck(this, CopyButton);

	    this.pNode = pNode ? pNode : document.createElement("div");
	    this.options = options ? options : {};
	    this.nodes = {};
	    this.data = null;
	    this.instanceNumber = ++CopyButton.n;
	    this.class = this.options.class || "";
	    /* this.data = shall be an array (i.e called rowsArray) of arrays (i.e each is called row).
	      each array on rowsArray represents a row on the table.
	      this.data must be set/updated by the code that uses this button
	      [
	        ["title"]
	        ["columna1" , "columna2" ,..., "columnaN"]
	        ["value1Row1", "value2Row1",..., "valueNRowN"]
	        ["value1Row2", "value2Row2",..., "valueNRowN"]
	      ]
	    */
	  }

	  _createClass(CopyButton, [{
	    key: "build",
	    value: function build(options) {
	      if (options) this.options = options; // workAround;

	      if (options.pNode) this.pNode = options.pNode; // workAround;

	      if (options.class) this.class = options.class; // workAround;

	      this.root = document.createElement("div");
	      this.root.setAttribute("class", "copy-button button-" + this.instanceNumber + " " + this.class);
	      this.pNode.appendChild(this.root);
	      this.nodes.btnCopy = document.createElement("button");
	      this.nodes.btnCopy.setAttribute("type", "button");
	      this.nodes.btnCopy.setAttribute("class", "btn btn-primary copy button-" + this.instanceNumber + " " + this.class);
	      this.nodes.btnCopy.setAttribute("title", this.options.title || "");
	      this.root.appendChild(this.nodes.btnCopy);
	      var icon = document.createElement("span");
	      icon.setAttribute("class", "fa fa-clipboard clipboard button-" + this.instanceNumber + " " + this.class);
	      this.nodes.btnCopy.appendChild(icon);
	      var accessibility = document.createElement("span");
	      accessibility.setAttribute("class", "wb-inv button-" + this.instanceNumber + " " + this.class);
	      accessibility.innerHTML = this.options.accessibility || "";
	      this.nodes.btnCopy.appendChild(accessibility);
	      this.nodes.msgCopyConfirm = document.createElement("div");
	      this.nodes.msgCopyConfirm.setAttribute("class", "copy-confirm button-" + this.instanceNumber + " " + this.class);
	      this.nodes.msgCopyConfirm.setAttribute("aria-live", "polite");
	      this.nodes.msgCopyConfirm.innerHTML = this.options.msgCopyConfirm || "";
	      this.root.appendChild(this.nodes.msgCopyConfirm);
	      this.nodes.btnCopy.addEventListener("click", this.onBtnClick.bind(this));
	    }
	  }, {
	    key: "onBtnClick",
	    value: function onBtnClick(ev) {
	      this.copyData(this.data);
	    }
	  }, {
	    key: "copyData",
	    value: function copyData(lines) {
	      var linesTemp = lines ? lines : [];
	      this.clipboard(this.toCSV("\t", linesTemp), this.root);
	      this.fade(this.nodes.msgCopyConfirm, true);
	      setTimeout(function (ev) {
	        this.fade(this.nodes.msgCopyConfirm, false);
	      }.bind(this), 1500);
	    }
	  }, {
	    key: "toCSV",
	    value: function toCSV(separator, lines) {
	      var csv = lines.map(function (line) {
	        return line.join(separator);
	      });
	      return csv.join("\r\n");
	    }
	  }, {
	    key: "clipboard",
	    value: function clipboard(string, target) {
	      if (this.isIE()) window.clipboardData.setData("Text", string);else {
	        // Copying the string
	        var aux = document.createElement("textarea");
	        aux.textContent = string;
	        target.appendChild(aux);
	        aux.select();
	        document.execCommand("copy");
	        target.removeChild(aux);
	      }
	    }
	  }, {
	    key: "fade",
	    value: function fade(node, visible) {
	      var clss = ["copy-confirm button-" + this.instanceNumber + " " + this.class];
	      var add = visible ? "fadeIn" : "fadeOut";
	      clss.push(add);
	      node.setAttribute("class", clss.join(" "));
	    } // work around for when tables are destroyed

	  }, {
	    key: "appendTo",
	    value: function appendTo(pNode) {
	      this.pNode = pNode;
	      this.pNode.appendChild(this.root);
	      this.nodes.msgCopyConfirm.setAttribute("class", "copy-confirm button-" + this.instanceNumber + " " + this.class);
	    }
	  }, {
	    key: "isIE",
	    value: function isIE() {
	      var ua = window.navigator.userAgent;
	      var msie = ua.indexOf("MSIE ");

	      if (msie > 0) {
	        // IE 10 or older => return version number
	        return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10);
	      }

	      var trident = ua.indexOf("Trident/");

	      if (trident > 0) {
	        // IE 11 => return version number
	        var rv = ua.indexOf("rv:");
	        return parseInt(ua.substring(rv + 3, ua.indexOf(".", rv)), 10);
	      }

	      var edge = ua.indexOf("Edge/");

	      if (edge > 0) {
	        // Edge (IE 12+) => return version number
	        return parseInt(ua.substring(edge + 5, ua.indexOf(".", edge)), 10);
	      } // other browser


	      return false;
	    }
	  }]);

	  return CopyButton;
	}();
	CopyButton.n = 0;

	// const majorAirportMode = "majorAirport"; // TODO

	/* Copy Button */
	// -----------------------------------------------------------------------------

	var cButton = new CopyButton(); // -----------------------------------------------------------------------------

	var data = {
	  "passengers": {},
	  "major_airports": {}
	};
	var passengerDropdownData = {
	  "Canada": "CANADA",
	  "Newfoundland and Labrador": "NL",
	  "St John's International": "YYT",
	  "Prince Edward Island": "PE",
	  "Nova Scotia (no data)": "NS",
	  "Halifax/Robert L Stanfield International": "YHZ",
	  "New Brunswick (no data)": "NB",
	  "Moncton/Greater Moncton International": "YQM",
	  "Quebec": "QC",
	  "Montréal/Pierre Elliott Trudeau International": "YUL",
	  "Québec/Jean Lesage International": "YQB",
	  "Ontario": "ON",
	  "Ottawa/Macdonald-Cartier International": "YOW",
	  "Toronto/Lester B Pearson International": "YYZ",
	  "Manitoba": "MB",
	  "Winnipeg/James Armstrong Richardson International": "NL",
	  "Saskatchewan": "SK",
	  "Alberta": "AB",
	  "Calgary International": "YYC",
	  "Edmonton International": "YEG",
	  "British Columbia": "BC",
	  "Vancouver International": "YVR",
	  "Victoria International": "YYJ",
	  "Yukon (no data)": "YT",
	  "Northwest Territories": "NT",
	  "Nunavut": "NU"
	};
	var majorDropdownData = {
	  "Canada": "CANADA",
	  "Newfoundland and Labrador": "NL",
	  "St John's International": "YYT",
	  "Prince Edward Island": "PE",
	  "Charlottetown": "YYG",
	  "Nova Scotia (no data)": "NS",
	  "Halifax/Robert L Stanfield International": "YHZ",
	  "New Brunswick (no data)": "NB",
	  "Moncton/Greater Moncton International": "YQM",
	  "Fredericton International": "YFC",
	  "Saint John": "YSJ",
	  "Quebec": "QC",
	  "Montréal/Pierre Elliott Trudeau International": "YUL",
	  "Québec/Jean Lesage International": "YQB",
	  "Montréal Mirabel International": "YMX",
	  "Ontario": "ON",
	  "Ottawa/Macdonald-Cartier International": "YOW",
	  "Toronto/Lester B Pearson International": "YYZ",
	  "Thunder Bay International": "YQT",
	  "London International": "YXU",
	  "Manitoba": "MB",
	  "Winnipeg/James Armstrong Richardson International": "NL",
	  "Saskatchewan": "SK",
	  "Regina International": "YQR",
	  "Saskatoon John G. Diefenbaker International": "YXE",
	  "Alberta": "AB",
	  "Calgary International": "YYC",
	  "Edmonton International": "YEG",
	  "British Columbia": "BC",
	  "Vancouver International": "YVR",
	  "Victoria International": "YYJ",
	  "Kelowna International": "YLW",
	  "Prince George Airpor": "YXS",
	  "Yukon (no data)": "YT",
	  "Erik Nielsen Whitehorse International": "YXY",
	  "Northwest Territories": "NT",
	  "Yellowknife": "YZF",
	  "Nunavut": "NU",
	  "Iqaluit": "YFB"
	};
	var selectedDropdown = passengerDropdownData;
	var totals;
	var passengerTotals;
	var majorTotals; // TODO

	var canadaMap;
	var selectedDataset = "passengers";
	var selectedYear = "2017";
	var selectedMonth = "01";
	var selectedDate = selectedYear;
	var selectedRegion = "CANADA"; // default region for areaChart

	var selectedSettings = settings;
	var selectedAirpt; // NB: NEEDS TO BE DEFINED AFTER canadaMap; see colorMap()

	var lineData = {}; // which data set to use. 0 for passenger, 1 for movements/major airports
	// let dataSet = 0; // TODO

	var formatComma = d3.format(",d");
	var scalef = 1e3;
	var stackedArea; // stores areaChart() call
	// -----------------------------------------------------------------------------

	/* SVGs */

	var map = d3.select(".dashboard .map").append("svg");
	var movementsButton = d3.select("#major");
	var passengerButton = d3.select("#movements");
	var monthDropdown = d3.select("#months"); // map colour bar

	var margin = {
	  top: 20,
	  right: 0,
	  bottom: 10,
	  left: 20
	};
	var width = 380 - margin.left - margin.right;
	var height = 150 - margin.top - margin.bottom;
	var svgCB = d3.select("#mapColourScale").select("svg").attr("class", "airCB").attr("width", width).attr("height", height).style("vertical-align", "middle");
	var widthNaN = 55;
	var svgNaN = d3.select("#mapColourScaleNaN").select("svg").attr("class", "airCB").attr("width", widthNaN).attr("height", height).style("vertical-align", "middle").attr("transform", "translate(0, 0)");
	var chart = d3.select(".data").append("svg").attr("id", "svg_areaChartAir"); // area chart legend

	var svgLegend = d3.select("#areaLegend").select("svg").attr("class", "airAreaCB").attr("width", 650).attr("height", height).style("vertical-align", "middle");
	/* -- shim all the SVGs -- */

	d3.stcExt.addIEShim(map, 387.1, 457.5);
	d3.stcExt.addIEShim(svgCB, height, width);
	d3.stcExt.addIEShim(svgLegend, height, 650);
	d3.stcExt.addIEShim(svgNaN, height, widthNaN); // -----------------------------------------------------------------------------

	/* letiables */
	// For map circles

	var path;
	var defaultPointRadius = 1.3;
	var zoomedPointRadius = 0.9; // const airportGroup = map.append("g");

	var airportGroup;
	var allAirports; // -----------------------------------------------------------------------------

	/* tooltip */

	/* -- for map -- */

	var div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
	/* -- for map NaN legend -- */

	var divNaN = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
	/* -- for areaChart 1 -- */

	var divArea = d3.select("body").append("div").attr("class", "tooltip").style("pointer-events", "none").style("opacity", 0);
	/* vertical line to attach to cursor */

	var hoverLine = chart.append("line").attr("class", "hoverLine").style("display", "none"); // -----------------------------------------------------------------------------

	/* UI Handler */

	$(".data_set_selector").on("click", function (event) {
	  if (event.target.id === "major") {
	    movementsButton.attr("class", "btn btn-primary major data_set_selector").attr("aria-pressed", true);
	    passengerButton.attr("class", "btn btn-default movements data_set_selector").attr("aria-pressed", false);
	    monthDropdown.style("visibility", "visible");
	    selectedDate = selectedYear + "-" + selectedMonth;
	    selectedDataset = "major_airports";
	    selectedDropdown = majorDropdownData;
	    selectedSettings = settingsMajorAirports;
	    createDropdown();
	    totals = majorTotals;
	    getData();
	    showAreaData();
	  }

	  if (event.target.id === "movements") {
	    movementsButton.attr("class", "btn btn-default major data_set_selector").attr("aria-pressed", false);
	    passengerButton.attr("class", "btn btn-primary movements data_set_selector").attr("aria-pressed", true);
	    monthDropdown.style("visibility", "hidden");
	    selectedDate = selectedYear;
	    selectedDataset = "passengers";
	    selectedDropdown = passengerDropdownData;
	    selectedSettings = settings;
	    createDropdown();
	    totals = passengerTotals;
	    getData();
	    showAreaData();
	  }
	});

	function uiHandler(event) {
	  if (event.target.id === "groups") {
	    // clear any map region that is highlighted
	    d3.select(".map").selectAll("path").classed("airMapHighlight", false);
	    selectedRegion = document.getElementById("groups").value;
	    showAreaData();
	  }

	  if (event.target.id === "yearSelector") {
	    selectedYear = document.getElementById("yearSelector").value;

	    if (selectedDataset === "major_airports") {
	      selectedDate = selectedYear + "-" + selectedMonth;
	    } else {
	      selectedDate = selectedYear;
	    }

	    colorMap();
	  }

	  if (event.target.id === "monthSelector") {
	    selectedMonth = document.getElementById("monthSelector").value;
	    selectedDate = selectedYear + selectedMonth;
	    colorMap();
	  }
	}

	function getData() {
	  if (!data[selectedDataset][selectedRegion]) {
	    d3.json("data/air/".concat(selectedDataset, "/").concat(selectedRegion, ".json"), function (err, filedata) {
	      data[selectedDataset][selectedRegion] = filedata.map(function (obj) {
	        var rObj = {};
	        rObj.date = obj.date;
	        rObj.domestic = obj.domestic;
	        rObj.transborder = obj.transborder;
	        rObj.international = obj.international;
	        return rObj;
	      });
	      showAreaData();
	    });
	  } else {
	    showAreaData();
	  }
	} // -----------------------------------------------------------------------------

	/* Interactions */

	/* -- Map interactions -- */


	map.on("mousemove", function () {
	  if (d3.select(d3.event.target).attr("class")) {
	    // const classes = d3.event.target.classList;
	    var classes = (d3.select(d3.event.target).attr("class") || "").split(" "); // IE-compatible

	    if (classes[0] !== "svg-shimmed") {
	      var key = i18next.t(classes[0], {
	        ns: "airGeography"
	      });

	      if (key !== "airport") {
	        // Highlight map region
	        d3.select(".dashboard .map").select("." + classes[0]).classed("airMapHighlight", true); // Tooltip

	        var value = formatComma(totals[selectedDate][classes[0]] / 1e3);
	        div.style("opacity", .9);
	        div.html( // **** CHANGE ns WITH DATASET ****
	        "<b>" + key + " (" + i18next.t("scalef", {
	          ns: "airPassengers"
	        }) + ")</b>" + "<br><br>" + "<table>" + "<tr>" + "<td><b>" + value + " " + i18next.t("units", {
	          ns: "airPassengers"
	        }) + "</td>" + "</tr>" + "</table>").style("pointer-events", "none");
	        div.style("left", d3.event.pageX + 10 + "px").style("top", d3.event.pageY + 10 + "px");
	      }
	    }
	  }
	});
	map.on("mouseout", function () {
	  div.style("opacity", 0);

	  if (selectedRegion) {
	    d3.select(".map").selectAll("path:not(." + selectedRegion + ")").classed("airMapHighlight", false);
	  } else {
	    d3.select(".map").selectAll("path").classed("airMapHighlight", false);
	  }
	});
	map.on("click", function () {
	  // clear any previous clicks
	  d3.select(".map").selectAll("path").classed("airMapHighlight", false); // const transition = d3.transition().duration(1000);
	  // User clicks on region

	  if (d3.select(d3.event.target).attr("class") && d3.select(d3.event.target).attr("class").indexOf("svg-shimmed") === -1) {
	    var classes = (d3.select(d3.event.target).attr("class") || "").split(" "); // IE-compatible
	    // ---------------------------------------------------------------------
	    // Region highlight

	    selectedRegion = classes[0];
	    d3.select(".dashboard .map").select("." + classes[0]).classed("airMapHighlight", true); // Display selected region in stacked area chart

	    getData(); // update region displayed in dropdown menu

	    d3.select("#groups")._groups[0][0].value = selectedRegion; // ---------------------------------------------------------------------
	    // zoom

	    if (classes[0] !== "airport") {
	      // to avoid zooming airport cirlces
	      if (classes[1] === "zoomed" || classes.length === 0) {
	        // return circles to original size
	        path.pointRadius(function (d, i) {
	          return defaultPointRadius;
	        });
	        return canadaMap.zoom();
	      }

	      path.pointRadius(function (d, i) {
	        return zoomedPointRadius;
	      });
	      canadaMap.zoom(classes[0]);
	    }
	  } else {
	    // user clicks outside map
	    // reset circle size
	    path.pointRadius(function (d, i) {
	      return defaultPointRadius;
	    }); // reset area chart to Canada

	    selectedRegion = "CANADA";
	    showAreaData(); // update region displayed in dropdown menu

	    d3.select("groups")._groups[0][0].value = selectedRegion; // Chart titles

	    updateTitles();

	    if (d3.select("." + selectedRegion + ".zoomed")) {
	      // clear zoom
	      return canadaMap.zoom();
	    }
	  } // Chart titles


	  updateTitles();
	});
	/* --  areaChart interactions -- */
	// vertical line to attach to cursor

	function plotHoverLine() {
	  hoverLine.attr("x1", stackedArea.settings.margin.left).attr("x2", stackedArea.settings.margin.left).attr("y1", stackedArea.settings.margin.top).attr("y2", stackedArea.settings.innerHeight + stackedArea.settings.margin.top);
	}

	function findAreaData(mousex) {
	  var bisectDate = d3.bisector(function (d) {
	    return d.date;
	  }).left;
	  var x0 = stackedArea.x.invert(mousex);
	  var chartData = data[selectedDataset][selectedRegion];
	  var d;
	  var i;

	  if (selectedDataset === "passenger") {
	    i = bisectDate(chartData, x0.toISOString().substring(0, 4));
	  } else {
	    i = bisectDate(chartData, x0.toISOString().substring(0, 7));
	  }

	  var d0 = chartData[i - 1];
	  var d1 = chartData[i];

	  if (d0 && d1) {
	    d = x0 - new Date(d0.date) > new Date(d1.date) - x0 ? d1 : d0;
	  } else if (d0) {
	    d = d0;
	  } else {
	    d = d1;
	  }

	  return d;
	} // area chart hover


	function areaInteraction() {
	  d3.select("#svg_areaChartAir .data").on("mousemove", function () {
	    var mousex = d3.mouse(this)[0];
	    var hoverValue = findAreaData(mousex);
	    var thisDomestic = formatComma(hoverValue.domestic / scalef);
	    var thisTrans = formatComma(hoverValue.transborder / scalef);
	    var thisInter = formatComma(hoverValue.international / scalef);
	    divArea.html("<b>" + "Passenger movements (" + i18next.t("units", {
	      ns: "airPassengers"
	    }) + ") in " + hoverValue.date + ":</b>" + "<br><br>" + "<table>" + "<tr>" + "<td><b>" + i18next.t("domestic", {
	      ns: "airPassengers"
	    }) + "</b>: " + thisDomestic + "</td>" + "</tr>" + "<tr>" + "<td><b>" + i18next.t("transborder", {
	      ns: "airPassengers"
	    }) + "</b>: " + thisTrans + "</td>" + "</tr>" + "<tr>" + "<td><b>" + i18next.t("international", {
	      ns: "airPassengers"
	    }) + "</b>: " + thisInter + "</td>" + "</tr>" + "</table>");
	    divArea.style("left", d3.event.pageX + 10 + "px").style("top", d3.event.pageY + 10 + "px").style("pointer-events", "none");
	    hoverLine.style("display", null);
	    hoverLine.style("transform", "translate(" + stackedArea.x(new Date(hoverValue.date)) + "px)");
	    hoverLine.moveToFront();
	  }).on("mouseover", function () {
	    divArea.style("opacity", .9);
	  }).on("mouseout", function (d, i) {
	    // Clear tooltip
	    hoverLine.style("display", "none");
	    divArea.style("opacity", 0);
	  });
	} // -----------------------------------------------------------------------------

	/* FNS */

	/* -- plot circles on map -- */


	var refreshMap = function refreshMap() {
	  path = d3.geoPath().projection(canadaMap.settings.projection).pointRadius(defaultPointRadius);
	  airportGroup.selectAll("path").data(allAirports.features).enter().append("path").attr("d", path).attr("id", function (d, i) {
	    return "airport" + d.properties.id;
	  }).attr("class", function (d, i) {
	    return "airport " + selectedDataset + " " + d.properties.hasPlanedData;
	  });
	};

	function colorMap() {
	  var colourArray = ["#AFE2FF", "#72C2FF", "#bc9dff", "#894FFF", "#5D0FBC"];
	  var dimExtent = []; // map.selectAll("path").style("stroke", "black");

	  var totArr = [];

	  var _arr = Object.keys(totals[selectedDate]);

	  for (var _i = 0; _i < _arr.length; _i++) {
	    var sales = _arr[_i];
	    totArr.push(totals[selectedDate][sales]);
	  } // colour map to take data value and map it to the colour of the level bin it belongs to


	  dimExtent = d3.extent(totArr);
	  var colourMap = d3.scaleQuantile().domain([dimExtent[0], dimExtent[1]]).range(colourArray);

	  for (var key in totals[selectedDate]) {
	    if (totals[selectedDate].hasOwnProperty(key)) {
	      // d3.select(".dashboard .map")
	      map.select("." + key).style("fill", colourMap(totals[selectedDate][key]));
	    }
	  } // colour bar scale and add label


	  var mapScaleLabel = i18next.t("mapScaleLabel", {
	    ns: "airPassengers"
	  }) + " (" + i18next.t("scalef", {
	    ns: "airPassengers"
	  }) + ")";
	  mapColourScaleFn(svgCB, colourArray, dimExtent);
	  mapColourScaleNaN(svgNaN); // Colourbar label (need be plotted only once)

	  var label = d3.select("#mapColourScale").append("div").attr("class", "airmapCBlabel");

	  if (d3.select(".airmapCBlabel").text() === "") {
	    label.append("text").text(mapScaleLabel);
	  } // DEFINE AIRPORTGROUP HERE, AFTER CANADA MAP IS FINISHED, OTHERWISE
	  // CIRCLES WILL BE PLOTTED UNDERNEATH THE MAP PATHS!


	  airportGroup = map.append("g"); // d3.stcExt.addIEShim(map, 387.1, 457.5);
	}

	function mapColourScaleNaN(svg) {
	  var rectDim = 35;
	  var rects = svg.attr("class", "mapCB").selectAll("rect").data(["#888"]).enter().append("g").attr("class", "legendNaN"); // Append rects onto the g nodes and fill

	  rects.append("rect").attr("width", rectDim).attr("height", rectDim).attr("y", 5).attr("x", 10).attr("fill", "#424242"); // add text node to rect g

	  rects.append("text"); // Display text in text node

	  d3.select("#mapColourScaleNaN .mapCB").selectAll("text").text("x") // .attr("text-anchor", "end")
	  .attr("transform", function (d, i) {
	    return "translate(24, 60) " + "rotate(0)";
	  }).style("display", function () {
	    return "inline";
	  });
	  rects.on("mousemove", function () {
	    // Tooltip
	    divNaN.style("opacity", .9);
	    divNaN.html("<table>" + "<tr>" + "<td>" + i18next.t("NaNhover1", {
	      ns: "airUI"
	    }) + "</td>" + "</tr>" + "<tr>" + "<td>" + i18next.t("NaNhover2", {
	      ns: "airUI"
	    }) + "</td>" + "</tr>" + "</table>").style("pointer-events", "none");
	    divNaN.style("left", d3.event.pageX + 10 + "px").style("top", d3.event.pageY + 10 + "px");
	  });
	  rects.on("mouseout", function () {
	    divNaN.style("opacity", 0);
	  });
	}
	/* -- stackedArea chart for Passenger or Major Airports data -- */


	function showAreaData() {
	  updateTitles();

	  var showChart = function showChart() {
	    stackedArea = areaChart(chart, selectedSettings, data[selectedDataset][selectedRegion]); // Highlight region selected from menu on map

	    d3.select(".dashboard .map").select("." + selectedRegion).classed("airMapHighlight", true); // ------------------copy button---------------------------------
	    // need to re-apend the button since table is being re-build

	    if (cButton.pNode) cButton.appendTo(document.getElementById("copy-button-container"));
	    dataCopyButton(data[selectedDataset][selectedRegion]); // ---------------------------------------------------------------

	    areaInteraction();
	    plotLegend();
	  };

	  if (!data[selectedDataset][selectedRegion]) {
	    loadData().then(function (ptData) {
	      data[selectedDataset][selectedRegion] = ptData.map(function (obj) {
	        var rObj = {};
	        rObj.date = obj.date;
	        rObj.domestic = obj.domestic;
	        rObj.transborder = obj.transborder;
	        rObj.international = obj.international;
	        rObj.total = obj.total;
	        return rObj;
	      });
	      showChart();
	    }).catch(function (error) {
	      console.log(error);
	    });
	  } else {
	    showChart(); // plotHoverLine();
	  }
	}

	function loadData() {
	  return new Promise(function (resolve, reject) {
	    d3.json("data/air/".concat(selectedDataset, "/").concat(selectedRegion, ".json"), function (err, ptData) {
	      if (err) {
	        reject(err);
	      } else {
	        resolve(ptData);
	      }
	    });
	  });
	}

	function filterDates(data) {
	  for (var year in data) {
	    if (data[year].date === selectedDate) {
	      return data[year];
	    }
	  }
	}

	function createDropdown() {
	  var dropdown = $("#groups");
	  dropdown.empty(); // remove old options

	  $.each(selectedDropdown, function (key, value) {
	    dropdown.append($("<option></option>").attr("value", value).text(key));
	  });
	}
	/* -- stackedArea chart for airports -- */


	var showAirport = function showAirport() {
	  if (!lineData[selectedAirpt]) {
	    var fname = "data/air/".concat(selectedDataset, "/").concat(selectedAirpt, ".json");
	    return d3.json(fname, function (aptData) {
	      if (aptData) {
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	          for (var _iterator = aptData[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var year = _step.value;

	            for (var key in year) {
	              if (year[key] === "x" || year[key] === "..") {
	                year[key] = 0;
	              }
	            }
	          }
	        } catch (err) {
	          _didIteratorError = true;
	          _iteratorError = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion && _iterator.return != null) {
	              _iterator.return();
	            }
	          } finally {
	            if (_didIteratorError) {
	              throw _iteratorError;
	            }
	          }
	        }

	        lineData[selectedAirpt] = aptData;
	        var divData = filterDates(lineData[selectedAirpt]);
	        div.style("opacity", .9);
	        div.html( // **** CHANGE ns WITH DATASET ****
	        "<b>placeholder title</b>" + "<br><br>" + "<table>" + "<tr>" + "<td><b> enplaned: " + divData.enplaned + " </td>" + "<td><b> deplaned: " + divData.deplaned + "</td>" + "</tr>" + "</table>").style("pointer-events", "none"); // Titles
	        // const fullName = i18next.t(selectedAirpt, {ns: "airports"});
	      }
	    });
	  } // airport chart title


	  d3.select("#svg_aptChart").select(".areaChartTitle").text(i18next.t(selectedAirpt, {
	    ns: "airports"
	  }));
	};
	/* -- update map and areaChart titles -- */


	function updateTitles() {
	  var geography = i18next.t(selectedRegion, {
	    ns: "airGeography"
	  });
	  d3.select("#mapTitleAir").text(i18next.t("mapTitle", {
	    ns: "airPassengers"
	  }) + ", " + geography + ", " + selectedDate);
	  d3.select("#areaTitleAir").text(i18next.t("chartTitle", {
	    ns: "airPassengers"
	  }) + ", " + geography);
	  selectedSettings.tableTitle = i18next.t("tableTitle", {
	    ns: "airPassengers",
	    geo: geography
	  });
	}

	function plotLegend() {
	  var classArray = ["domestic", "transborder", "international"];
	  areaLegendFn(svgLegend, classArray);
	  d3.select("#areaLegend").selectAll("text").text(function (d, i) {
	    return i18next.t(classArray[i], {
	      ns: "airPassengers"
	    });
	  });
	} // -----------------------------------------------------------------------------

	/* Copy Button*/


	function dataCopyButton(cButtondata) {
	  var lines = [];
	  var geography = i18next.t(selectedRegion, {
	    ns: "airGeography"
	  });
	  var title = [i18next.t("tableTitle", {
	    ns: "airPassengerAirports",
	    geo: geography
	  })];
	  var columns = [""];

	  for (var concept in cButtondata[0]) {
	    if (concept != "date") columns.push(i18next.t(concept, {
	      ns: "airPassengers"
	    }));
	  }

	  lines.push(title, [], columns);

	  for (var row in cButtondata) {
	    if (Object.prototype.hasOwnProperty.call(cButtondata, row)) {
	      var auxRow = [];

	      for (var column in cButtondata[row]) {
	        if (Object.prototype.hasOwnProperty.call(cButtondata[row], column)) {
	          var value = cButtondata[row][column];
	          if (column != "date" && column != "total" && !isNaN(value)) value /= 1000;
	          auxRow.push(value);
	        }
	      }

	      lines.push(auxRow);
	    }
	  }

	  cButton.data = lines;
	} // -----------------------------------------------------------------------------


	i18n.load(["src/i18n"], function () {
	  settings.x.label = i18next.t("x_label", {
	    ns: "airPassengers"
	  }), settings.y.label = i18next.t("y_label", {
	    ns: "airPassengers"
	  }), settingsMajorAirports.x.label = i18next.t("x_label", {
	    ns: "airPassengers"
	  }), settingsMajorAirports.y.label = i18next.t("y_label", {
	    ns: "airPassengers"
	  }), d3.queue().defer(d3.json, "data/air/passengers/Annual_Totals.json").defer(d3.json, "data/air/major_airports/Annual_Totals.json").defer(d3.json, "geojson/vennAirport_with_dataFlag.geojson").defer(d3.json, "data/air/passengers/".concat(selectedRegion, ".json")).await(function (error, passengerTotal, majorTotal, airports, areaData) {
	    if (error) throw error;
	    totals = passengerTotal;
	    passengerTotals = passengerTotal;
	    majorTotals = majorTotal;
	    data[selectedDataset][selectedRegion] = areaData;
	    selectedDate = document.getElementById("yearSelector").value;
	    selectedMonth = document.getElementById("monthSelector").value;
	    createDropdown();
	    canadaMap = getCanadaMap(map).on("loaded", function () {
	      allAirports = airports;
	      colorMap();
	      refreshMap();
	      airportGroup.selectAll("path").on("mouseover", function (d) {
	        selectedAirpt = d.properties.id;

	        if (d.properties.hasPlanedData !== "noYears") {
	          showAirport();
	        }
	      });
	      map.style("visibility", "visible");
	      d3.select(".canada-map").moveToBack();
	    }); // copy button options

	    var cButtonOptions = {
	      pNode: document.getElementById("copy-button-container"),
	      title: i18next.t("CopyButton_Title", {
	        ns: "CopyButton"
	      }),
	      msgCopyConfirm: i18next.t("CopyButton_Confirm", {
	        ns: "CopyButton"
	      }),
	      accessibility: i18next.t("CopyButton_Title", {
	        ns: "CopyButton"
	      })
	    }; // build nodes on copy button

	    cButton.build(cButtonOptions);
	    showAreaData();
	    plotLegend();
	    areaInteraction();
	    plotHoverLine(); // Show chart titles based on default menu options

	    updateTitles();
	  });
	});
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
