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

	var hasOwnProperty = {}.hasOwnProperty;
	var _has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var toString = {}.toString;

	var _cof = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	var _isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	var _anObject = function (it) {
	  if (!_isObject(it)) throw TypeError(it + ' is not an object!');
	  return it;
	};

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

	var f = {}.propertyIsEnumerable;

	var _objectPie = {
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

	var gOPD = Object.getOwnPropertyDescriptor;

	var f$1 = _descriptors ? gOPD : function getOwnPropertyDescriptor(O, P) {
	  O = _toIobject(O);
	  P = _toPrimitive(P, true);
	  if (_ie8DomDefine) try {
	    return gOPD(O, P);
	  } catch (e) { /* empty */ }
	  if (_has(O, P)) return _propertyDesc(!_objectPie.f.call(O, P), O[P]);
	};

	var _objectGopd = {
		f: f$1
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

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)

	var hiddenKeys = _enumBugKeys.concat('length', 'prototype');

	var f$2 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return _objectKeysInternal(O, hiddenKeys);
	};

	var _objectGopn = {
		f: f$2
	};

	var dP = Object.defineProperty;

	var f$3 = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
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
		f: f$3
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

	var gOPN = _objectGopn.f;
	var gOPD$1 = _objectGopd.f;
	var dP$1 = _objectDp.f;
	var $trim = _stringTrim.trim;
	var NUMBER = 'Number';
	var $Number = _global[NUMBER];
	var Base = $Number;
	var proto = $Number.prototype;
	// Opera ~12 has broken Object#toString
	var BROKEN_COF = _cof(_objectCreate(proto)) == NUMBER;
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
	      && (BROKEN_COF ? _fails(function () { proto.valueOf.call(that); }) : _cof(that) != NUMBER)
	        ? _inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
	  };
	  for (var keys = _descriptors ? gOPN(Base) : (
	    // ES3:
	    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
	    // ES6 (in case, if modules with ES6 Number statics required before):
	    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
	    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
	  ).split(','), j = 0, key; keys.length > j; j++) {
	    if (_has(Base, key = keys[j]) && !_has($Number, key)) {
	      dP$1($Number, key, gOPD$1(Base, key));
	    }
	  }
	  $Number.prototype = proto;
	  proto.constructor = $Number;
	  _redefine(_global, NUMBER, $Number);
	}

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
	  var proto$1 = Collection && Collection.prototype;
	  var key$1;
	  if (proto$1) {
	    if (!proto$1[ITERATOR$1]) _hide(proto$1, ITERATOR$1, ArrayValues);
	    if (!proto$1[TO_STRING_TAG]) _hide(proto$1, TO_STRING_TAG, NAME);
	    _iterators[NAME] = ArrayValues;
	    if (explicit) for (key$1 in es6_array_iterator) if (!proto$1[key$1]) _redefine(proto$1, key$1, es6_array_iterator[key$1], true);
	  }
	}

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

	var $forEach = _arrayMethods(0);
	var STRICT = _strictMethod([].forEach, true);

	_export(_export.P + _export.F * !STRICT, 'Array', {
	  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
	  forEach: function forEach(callbackfn /* , thisArg */) {
	    return $forEach(this, callbackfn, arguments[1]);
	  }
	});

	var $map = _arrayMethods(1);

	_export(_export.P + _export.F * !_strictMethod([].map, true), 'Array', {
	  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
	  map: function map(callbackfn /* , thisArg */) {
	    return $map(this, callbackfn, arguments[1]);
	  }
	});

	var _arrayReduce = function (that, callbackfn, aLen, memo, isRight) {
	  _aFunction(callbackfn);
	  var O = _toObject(that);
	  var self = _iobject(O);
	  var length = _toLength(O.length);
	  var index = isRight ? length - 1 : 0;
	  var i = isRight ? -1 : 1;
	  if (aLen < 2) for (;;) {
	    if (index in self) {
	      memo = self[index];
	      index += i;
	      break;
	    }
	    index += i;
	    if (isRight ? index < 0 : length <= index) {
	      throw TypeError('Reduce of empty array with no initial value');
	    }
	  }
	  for (;isRight ? index >= 0 : length > index; index += i) if (index in self) {
	    memo = callbackfn(memo, self[index], index, O);
	  }
	  return memo;
	};

	_export(_export.P + _export.F * !_strictMethod([].reduce, true), 'Array', {
	  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
	  reduce: function reduce(callbackfn /* , initialValue */) {
	    return _arrayReduce(this, callbackfn, arguments.length, arguments[1], false);
	  }
	});

	// 7.2.8 IsRegExp(argument)


	var MATCH = _wks('match');
	var _isRegexp = function (it) {
	  var isRegExp;
	  return _isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : _cof(it) == 'RegExp');
	};

	// 7.3.20 SpeciesConstructor(O, defaultConstructor)


	var SPECIES$1 = _wks('species');
	var _speciesConstructor = function (O, D) {
	  var C = _anObject(O).constructor;
	  var S;
	  return C === undefined || (S = _anObject(C)[SPECIES$1]) == undefined ? D : _aFunction(S);
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

	var dP$2 = _objectDp.f;
	var FProto = Function.prototype;
	var nameRE = /^\s*function ([^ (]*)/;
	var NAME$1 = 'name';

	// 19.2.4.2 name
	NAME$1 in FProto || _descriptors && dP$2(FProto, NAME$1, {
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

	// https://github.com/tc39/Array.prototype.includes

	var $includes = _arrayIncludes(true);

	_export(_export.P, 'Array', {
	  includes: function includes(el /* , fromIndex = 0 */) {
	    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	_addToUnscopables('includes');

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

	function _slicedToArray(arr, i) {
	  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
	}

	function _arrayWithHoles(arr) {
	  if (Array.isArray(arr)) return arr;
	}

	function _iterableToArrayLimit(arr, i) {
	  var _arr = [];
	  var _n = true;
	  var _d = false;
	  var _e = undefined;

	  try {
	    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
	      _arr.push(_s.value);

	      if (i && _arr.length === i) break;
	    }
	  } catch (err) {
	    _d = true;
	    _e = err;
	  } finally {
	    try {
	      if (!_n && _i["return"] != null) _i["return"]();
	    } finally {
	      if (_d) throw _e;
	    }
	  }

	  return _arr;
	}

	function _nonIterableRest() {
	  throw new TypeError("Invalid attempt to destructure non-iterable instance");
	}

	var $filter = _arrayMethods(2);

	_export(_export.P + _export.F * !_strictMethod([].filter, true), 'Array', {
	  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
	  filter: function filter(callbackfn /* , thisArg */) {
	    return $filter(this, callbackfn, arguments[1]);
	  }
	});

	// function makeSankey(svgID, graph) {
	var defaults = {
	  aspectRatio: 16 / 10,
	  width: 900,
	  margin: {
	    top: 30,
	    right: 10,
	    bottom: 30,
	    left: 10
	  }
	};
	function makeSankey (svg, settings, data) {
	  // set the dimensions and margins of the graph
	  var mergedSettings = defaults;
	  var outerWidth = mergedSettings.width;
	  var outerHeight = Math.ceil(outerWidth / mergedSettings.aspectRatio);
	  var innerHeight = mergedSettings.innerHeight = outerHeight - mergedSettings.margin.top - mergedSettings.margin.bottom;
	  var innerWidth = mergedSettings.innerWidth = outerWidth - mergedSettings.margin.left - mergedSettings.margin.right;
	  var chartInner = svg.select("g.margin-offset");
	  var dataLayer = chartInner.select(".data");
	  var nonZeroNodes = [];
	  data = {
	    links: data.links.map(function (d) {
	      return _objectSpread({}, d);
	    }).filter(function (d) {
	      if (d.value > 0) {
	        nonZeroNodes.push(d.source, d.target);
	        return true;
	      }

	      return false;
	    }),
	    nodes: data.nodes.map(function (d) {
	      return _objectSpread({}, d);
	    }).filter(function (d) {
	      return nonZeroNodes.includes(d.node);
	    })
	  };
	  mergedSettings.innerHeight = outerHeight - mergedSettings.margin.top - mergedSettings.margin.bottom; // format variables

	  var formatNumber = d3.format(",.0f"); // zero decimal places

	  var format = function format(d) {
	    return formatNumber(d);
	  };

	  var tooltipShiftY = 90; // amount to raise tooltip in y-dirn
	  // Set the sankey diagram properties

	  var sankey = d3.sankey().size([innerWidth, innerHeight]);
	  var path = sankey.link();

	  function make() {
	    sankey.nodes(data.nodes).links(data.links).layout(32); // tooltip div

	    var div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

	    if (dataLayer.empty()) {
	      dataLayer = chartInner.append("g").attr("class", "data");
	    } // add in the links


	    var link = dataLayer.append("g").selectAll(".link").data(sankey.links()).enter().append("path").attr("class", "link").attr("d", path).style("stroke-width", function (d) {
	      return Math.max(1, d.dy);
	    }).sort(function (a, b) {
	      return b.dy - a.dy;
	    }).on("mousemove", function (d) {
	      // Tooltip
	      var sourceName = d.source.name;
	      div.transition().style("opacity", .9);
	      div.html("<b>" + i18next.t(sourceName, {
	        ns: "modes"
	      }) + "</b>" + "<br><br>" + "<table>" + "<tr>" + "<td>" + i18next.t(d.target.name, {
	        ns: "modes"
	      }) + ": </td>" + "<td style='padding: 5px 10px 5px 5px;'><b>" + format(d.value) + " " + i18next.t("units", {
	        ns: "modes_sankey"
	      }) + "</td>" + "</tr>" + "</table>").style("left", d3.event.pageX + "px").style("top", d3.event.pageY - tooltipShiftY + "px");
	    }).on("mouseout", function (d) {
	      div.transition().style("opacity", 0);
	    }); // DO NOT PLOT IF DATA IS COMPLETELY ZERO

	    if (data.links.length !== 0) {
	      // add in the nodes
	      var node = dataLayer.append("g").selectAll(".node").data(sankey.nodes()).enter().append("g").attr("class", function (d) {
	        return "node " + d.name; // d.name to fill by class in css
	      }).attr("transform", function (d) {
	        return "translate(".concat(d.x || 0, ", ").concat(d.y || 0, ")");
	      }).call(d3.drag().subject(function (d) {
	        return d;
	      }).on("start", function () {
	        this.parentNode.appendChild(this);
	      }).on("drag", dragmove));
	      node.on("mousemove", function (d) {
	        div.transition().style("opacity", .9);
	        div.html("<b>" + i18next.t(d.name, {
	          ns: "modes"
	        }) + "</b>" + "<br><br>" + "<table>" + "<tr>" + "<td>" + "Total:" + "</td>" + "<td style='padding: 5px 10px 5px 5px;'><b>" + format(d.value) + " " + i18next.t("units", {
	          ns: "modes_sankey"
	        }) + "</td>" + "</tr>" + "</table>").style("left", d3.event.pageX + "px").style("top", d3.event.pageY - tooltipShiftY + "px");
	      }).on("mouseout", function (d) {
	        div.transition().style("opacity", 0);
	      }); // add the rectangles for the nodes

	      node.append("rect").attr("height", function (d) {
	        return d.dy;
	      }).attr("width", sankey.nodeWidth()).style("stroke", function (d) {
	        return d3.rgb(d.color).darker(2);
	      }).text(function (d) {
	        return i18next.t(d.name, {
	          ns: "modes"
	        }) + "\n" + format(d.value);
	      }); // add in the title for the nodes

	      node.append("text").attr("x", -6).attr("y", function (d) {
	        return d.dy / 2;
	      }).attr("dy", ".35em").attr("text-anchor", "end").attr("transform", null).text(function (d) {
	        if (d.value != 0) return i18next.t(d.name, {
	          ns: "modes"
	        });
	      }).filter(function (d) {
	        return d.x < innerWidth / 2;
	      }).attr("x", 6 + sankey.nodeWidth()).attr("text-anchor", "start").call(wrap, 200);
	    } // the function for moving the nodes


	    function dragmove(d) {
	      d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(innerHeight - d.dy, d3.event.y))) + ")");
	      sankey.relayout();
	      link.attr("d", path);
	    }

	    function wrap(text, width) {
	      var xcoord = 40;
	      text.each(function () {
	        var text = d3.select(this);
	        var words = text.text().split(/\s+/).reverse();
	        var word;
	        var line = [];
	        var lineNumber = 0;
	        var lineHeight = 1.1; // ems

	        var y = text.attr("y");
	        var dy = parseFloat(text.attr("dy")) - lineHeight / 2; // added this to shift all lines up

	        var tspan = text.text(null).append("tspan").attr("class", "nowrap").attr("x", xcoord).attr("y", y).attr("dy", dy + "em");

	        while (word = words.pop()) {
	          line.push(word);
	          tspan.text(line.join(" "));

	          if (tspan.node().getComputedTextLength() > width) {
	            line.pop();
	            tspan.text(line.join(" "));
	            line = [word]; // console.log("dy: ", dy)

	            tspan = text.append("tspan").attr("class", "wordwrap").attr("x", xcoord).attr("y", y).attr("dy", function () {
	              return ++lineNumber * lineHeight + dy + "em";
	            }).text(word);
	          }
	        }
	      });
	    }
	  } // end make()


	  svg.attr("viewBox", "0 0 " + outerWidth + " " + outerHeight).attr("preserveAspectRatio", "xMidYMid meet").attr("role", "img").attr("aria-label", mergedSettings.altText);

	  if (chartInner.empty()) {
	    chartInner = svg.append("g").attr("class", "margin-offset").attr("transform", "translate(" + mergedSettings.margin.left + "," + mergedSettings.margin.top + ")");
	  }

	  d3.stcExt.addIEShim(svg, outerHeight, outerWidth);
	  make();
	} // end makeSankey()

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
	  tableTitle: i18next.t("alt", {
	    ns: "modes"
	  }),
	  y: {
	    getValue: function getValue(d, key) {
	      return d[key]; // Number, not a string, do not pass through i18next
	    }
	  },
	  z: {
	    getId: function getId(d) {
	      return d.name;
	    },
	    getKeys: function getKeys(object) {
	      var sett = this; // const keys = Object.keys(object[0]);

	      var keys = ["name", "value"];

	      if (keys.indexOf(sett.y.totalProperty) !== -1) {
	        keys.splice(keys.indexOf(sett.y.totalProperty), 1);
	      }

	      return keys;
	    },
	    getKeyText: function getKeyText(key) {
	      return i18next.t(key, {
	        ns: "modes_sankey"
	      });
	    },
	    getText: function getText(d) {
	      return i18next.t(d.name, {
	        ns: "modes"
	      });
	    }
	  }
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

	var $entries = _objectToArray(true);

	_export(_export.S, 'Object', {
	  entries: function entries(it) {
	    return $entries(it);
	  }
	});

	// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)

	var $find = _arrayMethods(5);
	var KEY = 'find';
	var forced = true;
	// Shouldn't skip holes
	if (KEY in []) Array(1)[KEY](function () { forced = false; });
	_export(_export.P + _export.F * forced, 'Array', {
	  find: function find(callbackfn /* , that = undefined */) {
	    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});
	_addToUnscopables(KEY);

	var NodesTree =
	/*#__PURE__*/
	function () {
	  function NodesTree() {
	    _classCallCheck(this, NodesTree);

	    this.tree = this.buildTree();
	    this.data = null;
	  }

	  _createClass(NodesTree, [{
	    key: "setData",
	    value: function setData(data) {
	      this.data = data;
	      this.iterTree(this.tree, addData);
	      this.tree.value = 0;
	      this.tree.children.forEach(function (child) {
	        this.tree.value += child.value;
	      }.bind(this));

	      function addData(tree) {
	        var node = data.find(function (dataNode) {
	          return dataNode.target == tree.target;
	        });
	        tree.value = node != undefined ? node.value : 0;
	      }
	    }
	  }, {
	    key: "iterTree",
	    value: function iterTree(tree, fn) {
	      var _this = this;

	      fn(tree);

	      if (tree.children.length > 0) {
	        tree.children.forEach(function (branch) {
	          return _this.iterTree(branch, fn);
	        });
	      }
	    }
	  }, {
	    key: "toArray",
	    value: function toArray() {
	      var treeAsArray = [];
	      this.iterTree(this.tree, fillArray);
	      return treeAsArray;

	      function fillArray(tree) {
	        treeAsArray.push(cloneItem(tree));
	      }

	      function cloneItem(item) {
	        var itemTemp = {};

	        var _arr = Object.entries(item);

	        for (var _i = 0; _i < _arr.length; _i++) {
	          var _arr$_i = _slicedToArray(_arr[_i], 1),
	              key = _arr$_i[0];

	          itemTemp[key] = item[key];
	        }

	        return itemTemp;
	      }
	    }
	  }, {
	    key: "toLines",
	    value: function toLines(title, columns) {
	      var lines = [];
	      var titleRow = [title];
	      var columsRow = columns;
	      var data = this.toArray();
	      lines.push(titleRow, [], columsRow);
	      data.forEach(function (item) {
	        lines.push([i18next.t(item.name, {
	          ns: "modes"
	        }), item.value]);
	      });
	      return lines;
	    }
	  }, {
	    key: "buildTree",
	    value: function buildTree() {
	      var tree = [{
	        "node": 0,
	        "target": 0,
	        "level": 0,
	        "value": null,
	        "name": "intl",
	        "children": [{
	          "node": 1,
	          "target": 1,
	          "level": 1,
	          "value": null,
	          "name": "USres",
	          "children": [{
	            "node": 5,
	            "target": 5,
	            "level": 2,
	            "value": null,
	            "name": "USres_air",
	            "children": []
	          }, {
	            "node": 6,
	            "target": 6,
	            "level": 2,
	            "value": null,
	            "name": "USres_marine",
	            "children": []
	          }, {
	            "node": 7,
	            "target": 7,
	            "level": 2,
	            "value": null,
	            "name": "USres_land",
	            "children": [{
	              "node": 17,
	              "target": 17,
	              "level": 3,
	              "value": null,
	              "name": "USres_car",
	              "children": []
	            }, {
	              "node": 18,
	              "target": 18,
	              "level": 3,
	              "value": null,
	              "name": "USres_bus",
	              "children": []
	            }, {
	              "node": 19,
	              "target": 19,
	              "level": 3,
	              "value": null,
	              "name": "USres_train",
	              "children": []
	            }, {
	              "node": 20,
	              "target": 20,
	              "level": 3,
	              "value": null,
	              "name": "USres_other",
	              "children": []
	            }]
	          }]
	        }, {
	          "node": 2,
	          "target": 2,
	          "level": 1,
	          "value": null,
	          "name": "nonUSres",
	          "children": [{
	            "node": 8,
	            "target": 8,
	            "level": 2,
	            "value": null,
	            "name": "nonUSres_air",
	            "children": []
	          }, {
	            "node": 9,
	            "target": 9,
	            "level": 2,
	            "value": null,
	            "name": "nonUSres_marine",
	            "children": []
	          }, {
	            "node": 10,
	            "target": 10,
	            "level": 2,
	            "value": null,
	            "name": "nonUSres_land",
	            "children": []
	          }]
	        }, {
	          "node": 3,
	          "target": 3,
	          "level": 1,
	          "value": null,
	          "name": "cdnFromUS",
	          "children": [{
	            "node": 11,
	            "target": 11,
	            "level": 2,
	            "value": null,
	            "name": "cdnFromUS_air",
	            "children": []
	          }, {
	            "node": 12,
	            "target": 12,
	            "level": 2,
	            "value": null,
	            "name": "cdnFromUS_marine",
	            "children": []
	          }, {
	            "node": 13,
	            "target": 13,
	            "level": 2,
	            "value": null,
	            "name": "cdnFromUS_land",
	            "children": [{
	              "node": 21,
	              "target": 21,
	              "level": 3,
	              "value": null,
	              "name": "cdnFromUS_car",
	              "children": []
	            }, {
	              "node": 22,
	              "target": 22,
	              "level": 3,
	              "value": null,
	              "name": "cdnFromUS_bus",
	              "children": []
	            }, {
	              "node": 23,
	              "target": 23,
	              "level": 3,
	              "value": null,
	              "name": "cdnFromUS_train",
	              "children": []
	            }, {
	              "node": 24,
	              "target": 24,
	              "level": 3,
	              "value": null,
	              "name": "cdnFromUS_other",
	              "children": []
	            }]
	          }]
	        }, {
	          "node": 4,
	          "target": 4,
	          "level": 1,
	          "value": null,
	          "name": "cdnFromOther",
	          "children": [{
	            "node": 14,
	            "target": 14,
	            "level": 2,
	            "value": null,
	            "name": "cdnFromOther_air",
	            "children": []
	          }, {
	            "node": 15,
	            "target": 15,
	            "level": 2,
	            "value": null,
	            "name": "cdnFromOther_marine",
	            "children": []
	          }, {
	            "node": 16,
	            "target": 16,
	            "level": 2,
	            "value": null,
	            "name": "cdnFromOther_land",
	            "children": []
	          }]
	        }]
	      }];
	      return tree[0]; // returns root of tree
	    }
	  }]);

	  return NodesTree;
	}();

	/* Copy Button and DataTree*/
	// -----------------------------------------------------------------------------

	var cButton = new CopyButton();
	var dataTree = new NodesTree(); // -----------------------------------------------------------------------------

	var selectedRegion = "Canada";
	var selectedMonth = "01";
	var selectedYear = "2018";
	var dateRange;
	var data = {}; // global used on sankey

	var sankeyNodes = dataTree.toArray(); // ------------

	var loadData = function loadData(selectedYear, selectedMonth, cb) {
	  if (!data[selectedYear + "-" + selectedMonth]) {
	    d3.json("data/modes/" + selectedYear + "-" + selectedMonth + ".json", function (err, json) {
	      if (err) {
	        console.log("file does not exist");
	      }

	      data[selectedYear + "-" + selectedMonth] = json;
	      cb();
	    });
	  } else {
	    cb();
	  }
	}; // SVGs


	var sankeyChart = d3.select("#sankeyGraph").append("svg").attr("id", "svg_sankeyChart");
	var table = d3.select(".tabledata"); // .attr("id", "modesTable");

	function uiHandler(event) {
	  // clear any tooltips
	  d3.selectAll(".tooltip").style("opacity", 0);

	  if (event.target.id === "groups" || event.target.id === "month" || event.target.id === "year") {
	    selectedRegion = document.getElementById("groups").value;
	    selectedMonth = document.getElementById("month").value;
	    selectedYear = document.getElementById("year").value; // clear any zeroFlag message

	    if (d3.select("#zeroFlag").text() !== "") d3.select("#zeroFlag").text("");
	    loadData(selectedYear, selectedMonth, function () {
	      showData();
	    });
	  }
	}

	function showData() {
	  var thisMonth = i18next.t(selectedMonth, {
	    ns: "modesMonth"
	  });
	  var thisRegion = i18next.t(selectedRegion, {
	    ns: "modesGeography"
	  });
	  var thisData = data[selectedYear + "-" + selectedMonth][selectedRegion]; // Check that the sum of all nodes is not zero

	  var travellerTotal = function travellerTotal() {
	    return thisData.map(function (item) {
	      return item.value;
	    }).reduce(function (prev, next) {
	      return prev + next;
	    });
	  };

	  if (travellerTotal() === 0) {
	    d3.selectAll("svg > *").remove();
	    d3.select("#zeroFlag").text("".concat(i18next.t("noData", {
	      ns: "modes_sankey"
	    }), " ").concat(thisRegion, ",\n          ").concat(thisMonth, " ").concat(selectedYear));
	  } else {
	    d3.selectAll("svg > *").remove();
	    makeSankey(sankeyChart, {}, {
	      nodes: sankeyNodes,
	      links: data[selectedYear + "-" + selectedMonth][selectedRegion]
	    });
	  }

	  var dataTable = data[selectedYear + "-" + selectedMonth][selectedRegion];
	  dataTree.setData(dataTable);
	  var auxArray = dataTree.toArray();
	  auxArray.forEach(function (item) {});
	  drawTable(table, tableSettings, auxArray);
	  updateTitles(); // ------------------copy button---------------------------------

	  cButton.appendTo(document.getElementById("copy-button-container"));
	  dataCopyButton(); // ---------------------------------------------------------------
	}
	/* -- update table title -- */


	function updateTitles() {
	  var thisGeo = i18next.t(selectedRegion, {
	    ns: "modesGeography"
	  });
	  var thisMonth = i18next.t(selectedMonth, {
	    ns: "modesMonth"
	  });
	  var thisTitle = i18next.t("tableTitle", {
	    ns: "modes_sankey"
	  }) + " " + thisGeo + ", " + thisMonth + " " + selectedYear + ", " + i18next.t("byType", {
	    ns: "modes_sankey"
	  });
	  d3.select("#only-dt-tbl").text(thisTitle);
	} // create year dropdown based on data


	function createDropdown() {
	  var yearDropdown = $("#year"); // date dropdown creation

	  yearDropdown.empty();

	  for (var i = Number(dateRange.min.substring(0, 4)); i <= Number(dateRange.max.substring(0, 4)); i++) {
	    yearDropdown.append($("<option></option>").attr("value", i).html(i));
	  }

	  d3.select("#year")._groups[0][0].value = selectedYear;
	  var maxMonth = Number(dateRange.max.substring(5, 7));
	  $("#month > option").each(function () {
	    if (Number(this.value) > maxMonth) {
	      this.disabled = true;
	    }
	  });
	} // -----------------------------------------------------------------------------

	/* Copy Button*/


	function dataCopyButton() {
	  var geo = i18next.t(selectedRegion, {
	    ns: "modesGeography"
	  });
	  var month = i18next.t(selectedMonth, {
	    ns: "modesMonth"
	  });
	  var title = i18next.t("tableTitle", {
	    ns: "modes_sankey"
	  }) + " " + geo + ", " + month + " " + selectedYear + ", " + i18next.t("byType", {
	    ns: "modes_sankey"
	  });
	  var columns = [i18next.t("name", {
	    ns: "modes_sankey"
	  }), i18next.t("value", {
	    ns: "modes_sankey"
	  })];
	  cButton.data = dataTree.toLines(title, columns);
	} // -----------------------------------------------------------------------------

	/* Initial page load */


	i18n.load(["src/i18n"], function () {
	  d3.queue().defer(d3.json, "data/modes/dateRange.json").await(function (error, dataDateRange) {
	    dateRange = dataDateRange;
	    createDropdown();
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
	  loadData(selectedYear, selectedMonth, showData);
	});
	$(document).on("change", uiHandler);

}());
