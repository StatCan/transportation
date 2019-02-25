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

	var TAG = _wks('toStringTag');
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
	    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
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

	// 22.1.3.31 Array.prototype[@@unscopables]
	var UNSCOPABLES = _wks('unscopables');
	var ArrayProto = Array.prototype;
	if (ArrayProto[UNSCOPABLES] == undefined) _hide(ArrayProto, UNSCOPABLES, {});
	var _addToUnscopables = function (key) {
	  ArrayProto[UNSCOPABLES][key] = true;
	};

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

	var $filter = _arrayMethods(2);

	_export(_export.P + _export.F * !_strictMethod([].filter, true), 'Array', {
	  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
	  filter: function filter(callbackfn /* , thisArg */) {
	    return $filter(this, callbackfn, arguments[1]);
	  }
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
	      }) + ": </td>" + "<td style='padding: 5px 10px 5px 5px;'><b>" + format(d.value) + " people</td>" + "</tr>" + "</table>").style("left", d3.event.pageX + "px").style("top", d3.event.pageY - tooltipShiftY + "px");
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
	        }) + "</b>" + "<br><br>" + "<table>" + "<tr>" + "<td>" + "Total:" + "</td>" + "<td style='padding: 5px 10px 5px 5px;'><b>" + format(d.value) + " people</td>" + "</tr>" + "</table>").style("left", d3.event.pageX + "px").style("top", d3.event.pageY - tooltipShiftY + "px");
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
	        return d.dy / 2.5;
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
	        var dy = parseFloat(text.attr("dy"));
	        var tspan = text.text(null).append("tspan").attr("x", xcoord).attr("y", y).attr("dy", dy + "em");

	        while (word = words.pop()) {
	          line.push(word);
	          tspan.text(line.join(" "));

	          if (tspan.node().getComputedTextLength() > width) {
	            line.pop();
	            tspan.text(line.join(" "));
	            line = [word];
	            tspan = text.append("tspan").attr("x", xcoord).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
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
	      var source = i18next.t(d.source.name, {
	        ns: "modes"
	      });
	      var target = i18next.t(d.target.name, {
	        ns: "modes"
	      });
	      return "".concat(source, " -> ").concat(target);
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

	/* Copy Button */
	// -----------------------------------------------------------------------------

	var cButton = new CopyButton(); // -----------------------------------------------------------------------------

	var selectedRegion = "Canada";
	var selectedMonth = "01";
	var selectedYear = "2018";
	var data = {}; // global nodes

	var nodes = [{
	  "node": 0,
	  "name": "intl"
	}, {
	  "node": 1,
	  "name": "USres"
	}, {
	  "node": 2,
	  "name": "nonUSres"
	}, {
	  "node": 3,
	  "name": "cdnFromUS"
	}, {
	  "node": 4,
	  "name": "cdnFromOther"
	}, {
	  "node": 5,
	  "name": "USres_air"
	}, {
	  "node": 6,
	  "name": "USres_marine"
	}, {
	  "node": 7,
	  "name": "USres_land"
	}, {
	  "node": 8,
	  "name": "nonUSres_air"
	}, {
	  "node": 9,
	  "name": "nonUSres_marine"
	}, {
	  "node": 10,
	  "name": "nonUSres_land"
	}, {
	  "node": 11,
	  "name": "cdnFromUS_air"
	}, {
	  "node": 12,
	  "name": "cdnFromUS_marine"
	}, {
	  "node": 13,
	  "name": "cdnFromUS_land"
	}, {
	  "node": 14,
	  "name": "cdnFromOther_air"
	}, {
	  "node": 15,
	  "name": "cdnFromOther_marine"
	}, {
	  "node": 16,
	  "name": "cdnFromOther_land"
	}, {
	  "node": 17,
	  "name": "USres_car"
	}, {
	  "node": 18,
	  "name": "USres_bus"
	}, {
	  "node": 19,
	  "name": "USres_train"
	}, {
	  "node": 20,
	  "name": "USres_other"
	}, {
	  "node": 21,
	  "name": "cdnFromUS_car"
	}, {
	  "node": 22,
	  "name": "cdnFromUS_bus"
	}, {
	  "node": 23,
	  "name": "cdnFromUS_train"
	}, {
	  "node": 24,
	  "name": "cdnFromUS_other"
	}]; // ------------

	var loadData = function loadData(selectedYear, selectedMonth, cb) {
	  if (!data[selectedYear + "-" + selectedMonth]) {
	    d3.json("data/modes/" + selectedYear + "-" + selectedMonth + ".json", function (err, json) {
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
	    d3.select("#zeroFlag").text("Zero international travellers for ".concat(selectedRegion, ",\n          ").concat(thisMonth, " ").concat(selectedYear));
	  } else {
	    d3.selectAll("svg > *").remove();
	    makeSankey(sankeyChart, {}, {
	      nodes: nodes,
	      links: data[selectedYear + "-" + selectedMonth][selectedRegion]
	    });
	  }

	  drawTable(table, tableSettings, data[selectedYear + "-" + selectedMonth][selectedRegion].map(function (d) {
	    return {
	      source: nodes[d.source],
	      target: nodes[d.target],
	      value: d.value
	    };
	  }));
	  updateTitles(); // ------------------copy button---------------------------------
	  // dataCopyButton(nodes);

	  cButton.appendTo(document.getElementById("copy-button-container")); // dataCopyButton(nodes);

	  dataCopyButton(data[selectedYear + "-" + selectedMonth][selectedRegion]); // ---------------------------------------------------------------
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
	  }) + " " + thisGeo + " in " + thisMonth + " " + selectedYear + ", by type of transport";
	  d3.select("#only-dt-tbl").text(thisTitle);
	} // -----------------------------------------------------------------------------

	/* Copy Button*/


	function dataCopyButton(cButtondata) {
	  var lines = [];
	  var geography = i18next.t(selectedRegion, {
	    ns: "roadGeography"
	  });
	  var title = ["Sales of fuel in ".concat(geography, " used for road motor vehicles, annual (millions of dollars)")];
	  var columns = [""];

	  for (var concept in cButtondata[0]) {
	    if (concept != "date") columns.push(i18next.t(concept, {
	      ns: "roadArea"
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

	/* Initial page load */


	i18n.load(["src/i18n"], function () {
	  // copy button options
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
