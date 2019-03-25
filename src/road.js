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

	// 7.2.8 IsRegExp(argument)


	var MATCH = _wks('match');
	var _isRegexp = function (it) {
	  var isRegExp;
	  return _isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : _cof(it) == 'RegExp');
	};

	// 7.3.20 SpeciesConstructor(O, defaultConstructor)


	var SPECIES = _wks('species');
	var _speciesConstructor = function (O, D) {
	  var C = _anObject(O).constructor;
	  var S;
	  return C === undefined || (S = _anObject(C)[SPECIES]) == undefined ? D : _aFunction(S);
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

	var SPECIES$1 = _wks('species');

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
	      re.constructor[SPECIES$1] = function () { return re; };
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

	var f$1 = {}.propertyIsEnumerable;

	var _objectPie = {
		f: f$1
	};

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

	var TAG$1 = _wks('toStringTag');

	var _setToStringTag = function (it, tag, stat) {
	  if (it && !_has(it = stat ? it : it.prototype, TAG$1)) def(it, TAG$1, { configurable: true, value: tag });
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

	var SPECIES$2 = _wks('species');

	var _arraySpeciesConstructor = function (original) {
	  var C;
	  if (_isArray(original)) {
	    C = original.constructor;
	    // cross-realm fallback
	    if (typeof C == 'function' && (C === Array || _isArray(C.prototype))) C = undefined;
	    if (_isObject(C)) {
	      C = C[SPECIES$2];
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

	var settingsInit = {
	  alt: i18next.t("alt", {
	    ns: "roadArea"
	  }),
	  ns: "roadArea",
	  margin: {
	    top: 50,
	    left: 130,
	    right: 30,
	    bottom: 50
	  },
	  scalef: 1,
	  aspectRatio: 16 / 11,
	  // creates variable d
	  filterData: function filterData(data) {
	    // Flag to check if data has already been padded (i.e. data file has never been loaded)
	    var isOld = false;
	    data.map(function (item) {
	      if (item.isLast) {
	        isOld = isOld || true;
	      }
	    }); // If not padded, pad out the last year out to Jan 10

	    if (!isOld) {
	      var padMonth = 0;
	      var padDay = 10; // (year, month, date, hours, minutes, seconds, ms)

	      data.push({
	        date: new Date(data[data.length - 1].date, padMonth, padDay, 0, 0, 0, 0),
	        diesel: data[data.length - 1].diesel,
	        gas: data[data.length - 1].gas,
	        lpg: data[data.length - 1].lpg,
	        total: data[data.length - 1].total,
	        isLast: true
	      });
	    }

	    return data;
	  },
	  x: {
	    label: i18next.t("x_label", {
	      ns: "roadArea"
	    }),
	    getValue: function getValue(d, i) {
	      return new Date(d.date);
	    },
	    getText: function getText(d) {
	      return d.date;
	    },
	    ticks: 8,
	    tickSizeOuter: 0
	  },
	  y: {
	    label: i18next.t("y_label", {
	      ns: "roadArea"
	    }),
	    getValue: function getValue(d, key) {
	      if (typeof d[key] === "string" || d[key] instanceof String) {
	        return 0;
	      } else return d[key] * 1.0 / 1;
	    },
	    getTotal: function getTotal(d, index, data) {
	      var total;
	      var keys;
	      var sett = this;

	      if (!d[sett.y.totalProperty]) {
	        keys = sett.z.getKeys.call(sett, data);
	        total = 0;

	        for (var k = 0; k < keys.length; k++) {
	          total += sett.y.getValue.call(sett, d, keys[k], data) * 1; // keep in orig scale when summing
	        }

	        d[sett.y.totalProperty] = total;
	      }

	      return isNaN(Number(d[sett.y.totalProperty])) ? 0 : Number(d[sett.y.totalProperty]) * 1.0 / 1;
	    },
	    getText: function getText(d, key) {
	      if (!d.isLast) {
	        return isNaN(Number(d[key])) ? d[key] : Number(d[key]) * 1.0 / 1;
	      }
	    },
	    ticks: 5,
	    tickSizeOuter: 0
	  },
	  z: {
	    label: i18next.t("z_label", {
	      ns: "roadArea"
	    }),
	    getId: function getId(d) {
	      if (d.key !== "isLast") {
	        return d.key;
	      }
	    },
	    getKeys: function getKeys(object) {
	      var sett = this;
	      var keys = Object.keys(object[0]);
	      keys.splice(keys.indexOf("date"), 1);

	      if (keys.indexOf(sett.y.totalProperty) !== -1) {
	        keys.splice(keys.indexOf(sett.y.totalProperty), 1);
	      }

	      if (keys.indexOf("isLast") !== -1) {
	        // temporary key to be removed
	        keys.splice(keys.indexOf("isLast"), 1);
	      }

	      return keys;
	    },
	    origData: function origData(data) {
	      // remove last point which was added in filterData (padded date)
	      var origData = data.slice(0, -1);
	      return origData;
	    },
	    getClass: function getClass() {
	      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      return this.z.getId.apply(this, args);
	    },
	    getText: function getText(d) {
	      return i18next.t(d.key, {
	        ns: "roadArea"
	      });
	    }
	  },
	  datatable: true,
	  tableTitle: "",
	  dataTableTotal: true,
	  // show total in data table
	  transition: false,
	  width: 1050
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
	  var yNaNText = yText + 7;
	  var scalef = settings.scalef ? settings.scalef : 1; // text labels (calculate cbValues)

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
	      var s0 = settings.formatNum()(cbValues[j] / scalef);
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
	    return 160 + i * rectDim;
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
	        ns: "airUI"
	      });
	      divNaN.style("opacity", 0.9).html("<br>" + line1 + "<br>" + line2 + "<br><br>").style("left", d3.event.pageX + 10 + "px").style("top", d3.event.pageY + 10 + "px");
	    }
	  }).on("mouseout", function () {
	    divNaN.style("opacity", 0);
	  }); // add text

	  newGroup.append("text").text(getText).attr("text-anchor", "end").attr("transform", function (d, i) {
	    if (i < numLevels) {
	      // return "translate(" + (165 + (i * (rectDim + 0))) + ", 50) " + "rotate(-45)";
	      return "translate(".concat(165 + i * (rectDim + 0), ", ").concat(yText, ") rotate(-45)");
	    } else if (i === numLevels + 1) {
	      // NaN box in legend
	      return "translate(".concat(181 + i * (rectDim + 0), ", ").concat(yNaNText, ") ");
	    }
	  }).style("display", function () {
	    return "inline";
	  }); // Update rect fill for any new colour arrays passed in

	  rectGroups.select("rect").attr("fill", getFill); // Update rect text for different year selections

	  rectGroups.select("text").text(getText);
	  rectGroups.exit().remove();
	}

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
	      }).classed("classNaN", function () {
	        if (!Number(thisData[key])) {
	          return true;
	        }
	      });
	    }
	  };

	  for (var key in thisData) {
	    _loop(key);
	  }

	  return dimExtent;
	}

	function areaLegendFn (svgLegend, classArray) {
	  var rectDim = 15;
	  var x0 = 50;
	  var scaling = 9.5; // Create the g nodes

	  var rects = svgLegend.selectAll("rect").data(classArray).enter().append("g"); // Append rects onto the g nodes and fill

	  rects.append("rect").attr("width", rectDim).attr("height", rectDim).attr("y", 25).attr("x", function (d, i) {
	    return x0 + i * rectDim * scaling;
	  }).attr("class", function (d, i) {
	    return classArray[i];
	  }); // add text node to rect g

	  rects.append("text"); // Display text in text node

	  d3.select("#areaLegend").selectAll("text").attr("y", 38).attr("x", function (d, i) {
	    return x0 + i * rectDim * scaling + 20;
	  }).style("display", function () {
	    return "inline";
	  });
	}

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

	function areaTooltip (settings, div, d) {
	  var divFactor = settings.scalef ? settings.scalef : 1;
	  var thisMonth = d.date.substring(5, 7) ? i18next.t(d.date.substring(5, 7), {
	    ns: "months"
	  }) : null;
	  var thisYear = d.date.substring(0, 4);
	  var line1 = thisMonth ? "".concat(i18next.t("hoverTitle", {
	    ns: settings.ns
	  }), ", ").concat(thisMonth, " ").concat(thisYear, ": ") : "".concat(i18next.t("hoverTitle", {
	    ns: settings.ns
	  }), ", ").concat(d.date, ": ");
	  var keys = Object.keys(d); // remove unwanted keys

	  keys.splice(keys.indexOf("date"), 1);

	  if (keys.indexOf("total") !== -1) {
	    keys.splice(keys.indexOf("total"), 1);
	  }

	  if (keys.indexOf("isLast") !== -1) {
	    keys.splice(keys.indexOf("isLast"), 1);
	  }

	  var makeTable = function makeTable(line1) {
	    var keyValues = [];

	    for (var idx = 0; idx < keys.length; idx++) {
	      keyValues.push(Number(d[keys[idx]]) ? settings.formatNum.bind(settings)()(d[keys[idx]] / divFactor) : d[keys[idx]]);
	    }

	    var rtnTable = "<b>".concat(line1, "</b><br><br><table>");

	    for (var _idx = 0; _idx < keys.length; _idx++) {
	      rtnTable = rtnTable.concat("<tr><td><b>".concat(i18next.t(keys[_idx], {
	        ns: settings.ns
	      }), "</b>: ").concat(keyValues[_idx], "</td></tr>"));
	    }

	    rtnTable = rtnTable.concat("</table>");
	    return rtnTable;
	  };

	  div.html(makeTable(line1)).style("opacity", .9).style("left", d3.event.pageX + 10 + "px").style("top", d3.event.pageY + 10 + "px").style("pointer-events", "none");
	}

	function createOverlay (chartObj, data, onMouseOverCb, onMouseOutCb) {
	  // TEMP
	  chartObj.svg.datum(chartObj);
	  chartObj.data = data;
	  var bisect = d3.bisector(function (d) {
	    return chartObj.settings.x.getValue(d);
	  }).left;
	  var overlay = chartObj.svg.select(".data .overlay");
	  var rect;
	  var line;

	  if (overlay.empty()) {
	    overlay = chartObj.svg.select(".data").append("g").attr("class", "overlay");
	    rect = overlay.append("rect").style("fill", "none").style("pointer-events", "all").attr("class", "overlay");
	    line = overlay.append("line").attr("class", "hoverLine").style("display", "inline").style("visibility", "hidden");
	  } else {
	    rect = overlay.select("rect");
	    line = overlay.select("line");
	  }

	  rect.attr("width", chartObj.settings.innerWidth).attr("height", chartObj.settings.innerHeight).on("mousemove", function (e) {
	    var chartObj = d3.select(this.ownerSVGElement).datum();
	    var x = d3.mouse(this)[0];
	    var xD = chartObj.x.invert(x);
	    var i = bisect(chartObj.data, xD);
	    var d0 = chartObj.data[i - 1];
	    var d1 = chartObj.data[i];
	    var d;

	    if (d0 && d1) {
	      d = xD - chartObj.settings.x.getValue(d0) > chartObj.settings.x.getValue(d1) - xD ? d1 : d0;
	    } else if (d0) {
	      d = d0;
	    } else {
	      d = d1;
	    }

	    line.attr("x1", chartObj.x(chartObj.settings.x.getValue(d)));
	    line.attr("x2", chartObj.x(chartObj.settings.x.getValue(d)));
	    line.style("visibility", "visible");

	    if (onMouseOverCb && typeof onMouseOverCb === "function") {
	      onMouseOverCb(d);
	    }
	  }).on("mouseout", function () {
	    line.style("visibility", "hidden");

	    if (onMouseOutCb && typeof onMouseOutCb === "function") {
	      onMouseOutCb();
	    }
	  });
	  line.attr("x1", 0).attr("x2", 0).attr("y1", 0).attr("y2", chartObj.settings.innerHeight);
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

	var data = {};
	var stackedArea; // stores areaChart() call

	var mapData = {};
	var selectedRegion = "CANADA";
	var selectedYear = "2017";
	var scalef = 1; // 1e3;

	var xlabelDY = 1.5; // spacing between areaChart xlabels and ticks
	// Add number formatter to stackedArea settings file

	var thisLang = document.getElementsByTagName("html")[0].getAttribute("lang");
	var settingsAux = {
	  formatNum: function formatNum() {
	    var formatNumber;

	    if (thisLang === "fr") {
	      var locale = d3.formatLocale({
	        decimal: ",",
	        thousands: " ",
	        grouping: [3]
	      });
	      formatNumber = locale.format(",d");
	    } else {
	      formatNumber = d3.format(",d");
	    }

	    var format = function format(d) {
	      if (Number(d)) {
	        return formatNumber(d);
	      } else {
	        return d;
	      }
	    };

	    return format;
	  }
	};

	var settings = _objectSpread({}, settingsInit, settingsAux);
	/* Copy Button */
	// -----------------------------------------------------------------------------


	var cButton = new CopyButton(); // -----------------------------------------------------------------------------

	/* SVGs */
	// Fuel sales stacked area chart

	var chart = d3.select(".data").append("svg").attr("id", "svgFuel"); // Canada map

	var map = d3.select(".dashboard .map").append("svg"); // Map colour bar

	var margin = {
	  top: 20,
	  right: 0,
	  bottom: 10,
	  left: 20
	};
	var width = 570 - margin.left - margin.right;
	var height = 150 - margin.top - margin.bottom;
	var svgCB = d3.select("#mapColourScale").select("svg").attr("class", "mapCB").attr("width", width).attr("height", height).style("vertical-align", "middle"); // Area chart legend

	var svgLegend = d3.select("#areaLegend").select("svg").attr("class", "roadAreaCB").attr("width", 650).attr("height", height).style("vertical-align", "middle");
	/* -- shim all the SVGs (chart is already shimmed in component) -- */

	d3.stcExt.addIEShim(map, 387.1, 457.5);
	d3.stcExt.addIEShim(svgCB, height, width);
	d3.stcExt.addIEShim(svgLegend, height, 650); // -----------------------------------------------------------------------------

	/* tooltip */

	var div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
	var divArea = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0); // -----------------------------------------------------------------------------

	/* -- Map interactions -- */

	map.on("mousemove", function () {
	  if (d3.select(d3.event.target).attr("class")) {
	    // const classes = d3.event.target.classList;
	    var classes = (d3.select(d3.event.target).attr("class") || "").split(" "); // IE-compatible

	    if (classes[0] !== "svg-shimmed") {
	      // Highlight map region
	      var selectedPath = d3.select(".dashboard .map").select("." + classes[0]);
	      selectedPath.classed("roadMapHighlight", true);
	      selectedPath.moveToFront(); // Tooltip

	      var key = i18next.t(classes[0], {
	        ns: "roadGeography"
	      });
	      var value = settings.formatNum()(mapData[selectedYear][classes[0]] / scalef);
	      div.style("opacity", .9);
	      div.html("<b>" + key + " (" + i18next.t("units", {
	        ns: "road"
	      }) + ")</b>" + "<br><br>" + "<table>" + "<tr>" + "<td><b>" + value + "</td>" + "</tr>" + "</table>");
	      div.style("left", d3.event.pageX + 10 + "px").style("top", d3.event.pageY + 10 + "px");
	    } else {
	      // clear tooltip for IE
	      div.style("opacity", 0);
	    }
	  }
	});
	map.on("mouseout", function () {
	  div.transition().style("opacity", 0);

	  if (selectedRegion) {
	    d3.select(".map").selectAll("path:not(." + selectedRegion + ")").classed("roadMapHighlight", false);
	  } else {
	    d3.select(".map").selectAll("path").classed("roadMapHighlight", false);
	  }
	});
	map.on("click", function () {
	  // clear any previous clicks
	  d3.select(".map").selectAll("path").classed("roadMapHighlight", false);

	  if (d3.select(d3.event.target).attr("class") && d3.select(d3.event.target).attr("class").indexOf("svg-shimmed") === -1) {
	    var classes = (d3.select(d3.event.target).attr("class") || "").split(" "); // IE-compatible

	    selectedRegion = classes[0];
	    d3.select(".dashboard .map").select("." + classes[0]).classed("roadMapHighlight", true).moveToFront();
	    updateTitles(); // Display selected region in stacked area chart

	    loadData(selectedRegion, function () {
	      showAreaData();
	    }); // update region displayed in dropdown menu

	    d3.select("#groups")._groups[0][0].value = selectedRegion;
	  } else {
	    // reset area chart to Canada
	    selectedRegion = "CANADA";
	    updateTitles();
	    showAreaData(); // update region displayed in dropdown menu

	    d3.select("#groups")._groups[0][0].value = selectedRegion;
	  }
	}); // -----------------------------------------------------------------------------

	/* FNS */

	function colorMap() {
	  // store map data in array and plot colour
	  var thisTotalArray = [];
	  thisTotalArray.push(mapData[selectedYear]);
	  var colourArray = ["#AFE2FF", "#72C2FF", "#bc9dff", "#894FFF", "#5D0FBC"];
	  var numLevels = colourArray.length; // colour map with fillMapFn and output dimExtent for colour bar scale

	  var dimExtent = fillMapFn(thisTotalArray, colourArray, numLevels); // colour bar scale and add label

	  mapColourScaleFn(svgCB, colourArray, dimExtent, colourArray.length, settings); // Colourbar label (need be plotted only once)

	  var mapScaleLabel = i18next.t("units", {
	    ns: "road"
	  });
	  d3.select("#cbTitle").select("text").text(mapScaleLabel).attr("transform", function (d, i) {
	    return "translate(203, 15)";
	  });
	}
	/* -- display areaChart -- */


	function showAreaData() {
	  stackedArea = areaChart(chart, settings, data[selectedRegion]);
	  d3.select("#svgFuel").select(".x.axis").select("text").attr("display", "none");
	  d3.select("#svgFuel").select(".x.axis").selectAll(".tick text").attr("dy", "".concat(xlabelDY, "em"));
	  createOverlay(stackedArea, data[selectedRegion], function (d) {
	    areaTooltip(stackedArea.settings, divArea, d);
	  }, function () {
	    divArea.style("opacity", 0);
	  }); // Highlight region selected from menu on map

	  d3.select(".dashboard .map").select("." + selectedRegion).classed("roadMapHighlight", true).moveToFront();
	  updateTitles();
	  plotLegend();
	  cButton.appendTo(document.getElementById("copy-button-container"));
	  dataCopyButton(data[selectedRegion]);
	}
	/* -- update map and areaChart titles -- */


	function updateTitles() {
	  var geography = i18next.t(selectedRegion, {
	    ns: "roadGeography"
	  });
	  d3.select("#areaTitleRoad").text(i18next.t("chartTitle", {
	    ns: "road"
	  }) + ", " + geography);
	  settings.tableTitle = i18next.t("tableTitle", {
	    ns: "roadArea",
	    geo: geography
	  });
	}

	function plotLegend() {
	  var classArray = ["gas", "diesel", "lpg"];
	  areaLegendFn(svgLegend, classArray);
	  d3.select("#areaLegend").selectAll("text").text(function (d, i) {
	    return i18next.t(classArray[i], {
	      ns: "roadArea"
	    });
	  });
	} // -----------------------------------------------------------------------------

	/* load data fn */


	var loadData = function loadData(selectedRegion, cb) {
	  if (!data[selectedRegion]) {
	    d3.json("data/road/" + selectedRegion + ".json", function (err, filedata) {
	      data[selectedRegion] = filedata;
	      cb();
	    });
	  } else {
	    cb();
	  }
	};
	/* uiHandler*/


	function uiHandler(event) {
	  if (event.target.id === "groups") {
	    selectedRegion = document.getElementById("groups").value; // clear any map region that is highlighted

	    d3.select(".map").selectAll("path").classed("roadMapHighlight", false); // Chart titles

	    updateTitles();
	    loadData(selectedRegion, function () {
	      showAreaData();
	    });
	  }

	  if (event.target.id === "year") {
	    selectedYear = document.getElementById("year").value;
	    d3.select("#mapTitleRoad").text(i18next.t("mapTitle", {
	      ns: "road",
	      year: selectedYear
	    }));
	    colorMap();
	  }
	} // -----------------------------------------------------------------------------

	/* Copy Button*/


	function dataCopyButton(cButtondata) {
	  var lines = [];
	  var geography = i18next.t(selectedRegion, {
	    ns: "roadGeography"
	  });
	  var title = [i18next.t("tableTitle", {
	    ns: "roadArea",
	    geo: geography
	  })];
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
	          if (column != "date" && column != "total" && !isNaN(value)) value /= scalef;
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
	  settings.x.label = i18next.t("x_label", {
	    ns: "roadArea"
	  }), settings.y.label = i18next.t("y_label", {
	    ns: "roadArea"
	  }), settings.tableTitle = i18next.t("tableTitle", {
	    ns: "roadArea",
	    geo: i18next.t(selectedRegion, {
	      ns: "roadGeography"
	    })
	  }), d3.queue().defer(d3.json, "data/road/Annual_Totals.json").defer(d3.json, "data/road/CANADA.json").await(function (error, mapfile, areafile) {
	    mapData = mapfile;
	    data[selectedRegion] = areafile;
	    getCanadaMap(map).on("loaded", function () {
	      colorMap();
	    });
	    d3.select("#mapTitleRoad").text(i18next.t("mapTitle", {
	      ns: "road",
	      year: selectedYear
	    })); // copy button options

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
