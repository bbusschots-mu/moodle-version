(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.MoodleVersion = factory());
}(this, (function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var is = createCommonjsModule(function (module, exports) {
	(function(root, factory) {    // eslint-disable-line no-extra-semi
	    {
	        // Node. Does not work with strict CommonJS, but
	        // only CommonJS-like enviroments that support module.exports,
	        // like Node.
	        module.exports = factory();
	    }
	}(commonjsGlobal, function() {

	    // Baseline
	    /* -------------------------------------------------------------------------- */

	    // define 'is' object and current version
	    var is = {};
	    is.VERSION = '0.8.0';

	    // define interfaces
	    is.not = {};
	    is.all = {};
	    is.any = {};

	    // cache some methods to call later on
	    var toString = Object.prototype.toString;
	    var slice = Array.prototype.slice;
	    var hasOwnProperty = Object.prototype.hasOwnProperty;

	    // helper function which reverses the sense of predicate result
	    function not(func) {
	        return function() {
	            return !func.apply(null, slice.call(arguments));
	        };
	    }

	    // helper function which call predicate function per parameter and return true if all pass
	    function all(func) {
	        return function() {
	            var params = getParams(arguments);
	            var length = params.length;
	            for (var i = 0; i < length; i++) {
	                if (!func.call(null, params[i])) {
	                    return false;
	                }
	            }
	            return true;
	        };
	    }

	    // helper function which call predicate function per parameter and return true if any pass
	    function any(func) {
	        return function() {
	            var params = getParams(arguments);
	            var length = params.length;
	            for (var i = 0; i < length; i++) {
	                if (func.call(null, params[i])) {
	                    return true;
	                }
	            }
	            return false;
	        };
	    }

	    // build a 'comparator' object for various comparison checks
	    var comparator = {
	        '<': function(a, b) { return a < b; },
	        '<=': function(a, b) { return a <= b; },
	        '>': function(a, b) { return a > b; },
	        '>=': function(a, b) { return a >= b; }
	    };

	    // helper function which compares a version to a range
	    function compareVersion(version, range) {
	        var string = (range + '');
	        var n = +(string.match(/\d+/) || NaN);
	        var op = string.match(/^[<>]=?|/)[0];
	        return comparator[op] ? comparator[op](version, n) : (version == n || n !== n);
	    }

	    // helper function which extracts params from arguments
	    function getParams(args) {
	        var params = slice.call(args);
	        var length = params.length;
	        if (length === 1 && is.array(params[0])) {    // support array
	            params = params[0];
	        }
	        return params;
	    }

	    // Type checks
	    /* -------------------------------------------------------------------------- */

	    // is a given value Arguments?
	    is.arguments = function(value) {    // fallback check is for IE
	        return toString.call(value) === '[object Arguments]' ||
	            (value != null && typeof value === 'object' && 'callee' in value);
	    };

	    // is a given value Array?
	    is.array = Array.isArray || function(value) {    // check native isArray first
	        return toString.call(value) === '[object Array]';
	    };

	    // is a given value Boolean?
	    is.boolean = function(value) {
	        return value === true || value === false || toString.call(value) === '[object Boolean]';
	    };

	    // is a given value Char?
	    is.char = function(value) {
	        return is.string(value) && value.length === 1;
	    };

	    // is a given value Date Object?
	    is.date = function(value) {
	        return toString.call(value) === '[object Date]';
	    };

	    // is a given object a DOM node?
	    is.domNode = function(object) {
	        return is.object(object) && object.nodeType > 0;
	    };

	    // is a given value Error object?
	    is.error = function(value) {
	        return toString.call(value) === '[object Error]';
	    };

	    // is a given value function?
	    is['function'] = function(value) {    // fallback check is for IE
	        return toString.call(value) === '[object Function]' || typeof value === 'function';
	    };

	    // is given value a pure JSON object?
	    is.json = function(value) {
	        return toString.call(value) === '[object Object]';
	    };

	    // is a given value NaN?
	    is.nan = function(value) {    // NaN is number :) Also it is the only value which does not equal itself
	        return value !== value;
	    };

	    // is a given value null?
	    is['null'] = function(value) {
	        return value === null;
	    };

	    // is a given value number?
	    is.number = function(value) {
	        return is.not.nan(value) && toString.call(value) === '[object Number]';
	    };

	    // is a given value object?
	    is.object = function(value) {
	        return Object(value) === value;
	    };

	    // is a given value RegExp?
	    is.regexp = function(value) {
	        return toString.call(value) === '[object RegExp]';
	    };

	    // are given values same type?
	    // prevent NaN, Number same type check
	    is.sameType = function(value, other) {
	        var tag = toString.call(value);
	        if (tag !== toString.call(other)) {
	            return false;
	        }
	        if (tag === '[object Number]') {
	            return !is.any.nan(value, other) || is.all.nan(value, other);
	        }
	        return true;
	    };
	    // sameType method does not support 'all' and 'any' interfaces
	    is.sameType.api = ['not'];

	    // is a given value String?
	    is.string = function(value) {
	        return toString.call(value) === '[object String]';
	    };

	    // is a given value undefined?
	    is.undefined = function(value) {
	        return value === void 0;
	    };

	    // is a given value window?
	    // setInterval method is only available for window object
	    is.windowObject = function(value) {
	        return value != null && typeof value === 'object' && 'setInterval' in value;
	    };

	    // Presence checks
	    /* -------------------------------------------------------------------------- */

	    //is a given value empty? Objects, arrays, strings
	    is.empty = function(value) {
	        if (is.object(value)) {
	            var length = Object.getOwnPropertyNames(value).length;
	            if (length === 0 || (length === 1 && is.array(value)) ||
	                    (length === 2 && is.arguments(value))) {
	                return true;
	            }
	            return false;
	        }
	        return value === '';
	    };

	    // is a given value existy?
	    is.existy = function(value) {
	        return value != null;
	    };

	    // is a given value falsy?
	    is.falsy = function(value) {
	        return !value;
	    };

	    // is a given value truthy?
	    is.truthy = not(is.falsy);

	    // Arithmetic checks
	    /* -------------------------------------------------------------------------- */

	    // is a given number above minimum parameter?
	    is.above = function(n, min) {
	        return is.all.number(n, min) && n > min;
	    };
	    // above method does not support 'all' and 'any' interfaces
	    is.above.api = ['not'];

	    // is a given number decimal?
	    is.decimal = function(n) {
	        return is.number(n) && n % 1 !== 0;
	    };

	    // are given values equal? supports numbers, strings, regexes, booleans
	    // TODO: Add object and array support
	    is.equal = function(value, other) {
	        // check 0 and -0 equity with Infinity and -Infinity
	        if (is.all.number(value, other)) {
	            return value === other && 1 / value === 1 / other;
	        }
	        // check regexes as strings too
	        if (is.all.string(value, other) || is.all.regexp(value, other)) {
	            return '' + value === '' + other;
	        }
	        if (is.all.boolean(value, other)) {
	            return value === other;
	        }
	        return false;
	    };
	    // equal method does not support 'all' and 'any' interfaces
	    is.equal.api = ['not'];

	    // is a given number even?
	    is.even = function(n) {
	        return is.number(n) && n % 2 === 0;
	    };

	    // is a given number finite?
	    is.finite = isFinite || function(n) {
	        return is.not.infinite(n) && is.not.nan(n);
	    };

	    // is a given number infinite?
	    is.infinite = function(n) {
	        return n === Infinity || n === -Infinity;
	    };

	    // is a given number integer?
	    is.integer = function(n) {
	        return is.number(n) && n % 1 === 0;
	    };

	    // is a given number negative?
	    is.negative = function(n) {
	        return is.number(n) && n < 0;
	    };

	    // is a given number odd?
	    is.odd = function(n) {
	        return is.number(n) && n % 2 === 1;
	    };

	    // is a given number positive?
	    is.positive = function(n) {
	        return is.number(n) && n > 0;
	    };

	    // is a given number above maximum parameter?
	    is.under = function(n, max) {
	        return is.all.number(n, max) && n < max;
	    };
	    // least method does not support 'all' and 'any' interfaces
	    is.under.api = ['not'];

	    // is a given number within minimum and maximum parameters?
	    is.within = function(n, min, max) {
	        return is.all.number(n, min, max) && n > min && n < max;
	    };
	    // within method does not support 'all' and 'any' interfaces
	    is.within.api = ['not'];

	    // Regexp checks
	    /* -------------------------------------------------------------------------- */
	    // Steven Levithan, Jan Goyvaerts: Regular Expressions Cookbook
	    // Scott Gonzalez: Email address validation

	    // dateString match m/d/yy and mm/dd/yyyy, allowing any combination of one or two digits for the day and month, and two or four digits for the year
	    // eppPhone match extensible provisioning protocol format
	    // nanpPhone match north american number plan format
	    // time match hours, minutes, and seconds, 24-hour clock
	    var regexes = {
	        affirmative: /^(?:1|t(?:rue)?|y(?:es)?|ok(?:ay)?)$/,
	        alphaNumeric: /^[A-Za-z0-9]+$/,
	        caPostalCode: /^(?!.*[DFIOQU])[A-VXY][0-9][A-Z]\s?[0-9][A-Z][0-9]$/,
	        creditCard: /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/,
	        dateString: /^(1[0-2]|0?[1-9])([\/-])(3[01]|[12][0-9]|0?[1-9])(?:\2)(?:[0-9]{2})?[0-9]{2}$/,
	        email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i, // eslint-disable-line no-control-regex
	        eppPhone: /^\+[0-9]{1,3}\.[0-9]{4,14}(?:x.+)?$/,
	        hexadecimal: /^(?:0x)?[0-9a-fA-F]+$/,
	        hexColor: /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
	        ipv4: /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/,
	        ipv6: /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i,
	        nanpPhone: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
	        socialSecurityNumber: /^(?!000|666)[0-8][0-9]{2}-?(?!00)[0-9]{2}-?(?!0000)[0-9]{4}$/,
	        timeString: /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/,
	        ukPostCode: /^[A-Z]{1,2}[0-9RCHNQ][0-9A-Z]?\s?[0-9][ABD-HJLNP-UW-Z]{2}$|^[A-Z]{2}-?[0-9]{4}$/,
	        url: /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i,
	        usZipCode: /^[0-9]{5}(?:-[0-9]{4})?$/
	    };

	    function regexpCheck(regexp, regexes) {
	        is[regexp] = function(value) {
	            return regexes[regexp].test(value);
	        };
	    }

	    // create regexp checks methods from 'regexes' object
	    for (var regexp in regexes) {
	        if (regexes.hasOwnProperty(regexp)) {
	            regexpCheck(regexp, regexes);
	        }
	    }

	    // simplify IP checks by calling the regex helpers for IPv4 and IPv6
	    is.ip = function(value) {
	        return is.ipv4(value) || is.ipv6(value);
	    };

	    // String checks
	    /* -------------------------------------------------------------------------- */

	    // is a given string or sentence capitalized?
	    is.capitalized = function(string) {
	        if (is.not.string(string)) {
	            return false;
	        }
	        var words = string.split(' ');
	        for (var i = 0; i < words.length; i++) {
	            var word = words[i];
	            if (word.length) {
	                var chr = word.charAt(0);
	                if (chr !== chr.toUpperCase()) {
	                    return false;
	                }
	            }
	        }
	        return true;
	    };

	    // is string end with a given target parameter?
	    is.endWith = function(string, target) {
	        if (is.not.string(string)) {
	            return false;
	        }
	        target += '';
	        var position = string.length - target.length;
	        return position >= 0 && string.indexOf(target, position) === position;
	    };
	    // endWith method does not support 'all' and 'any' interfaces
	    is.endWith.api = ['not'];

	    // is a given string include parameter target?
	    is.include = function(string, target) {
	        return string.indexOf(target) > -1;
	    };
	    // include method does not support 'all' and 'any' interfaces
	    is.include.api = ['not'];

	    // is a given string all lowercase?
	    is.lowerCase = function(string) {
	        return is.string(string) && string === string.toLowerCase();
	    };

	    // is a given string palindrome?
	    is.palindrome = function(string) {
	        if (is.not.string(string)) {
	            return false;
	        }
	        string = string.replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
	        var length = string.length - 1;
	        for (var i = 0, half = Math.floor(length / 2); i <= half; i++) {
	            if (string.charAt(i) !== string.charAt(length - i)) {
	                return false;
	            }
	        }
	        return true;
	    };

	    // is a given value space?
	    // horizantal tab: 9, line feed: 10, vertical tab: 11, form feed: 12, carriage return: 13, space: 32
	    is.space = function(value) {
	        if (is.not.char(value)) {
	            return false;
	        }
	        var charCode = value.charCodeAt(0);
	        return (charCode > 8 && charCode < 14) || charCode === 32;
	    };

	    // is string start with a given target parameter?
	    is.startWith = function(string, target) {
	        return is.string(string) && string.indexOf(target) === 0;
	    };
	    // startWith method does not support 'all' and 'any' interfaces
	    is.startWith.api = ['not'];

	    // is a given string all uppercase?
	    is.upperCase = function(string) {
	        return is.string(string) && string === string.toUpperCase();
	    };

	    // Time checks
	    /* -------------------------------------------------------------------------- */

	    var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
	    var months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

	    // is a given dates day equal given day parameter?
	    is.day = function(date, day) {
	        return is.date(date) && day.toLowerCase() === days[date.getDay()];
	    };
	    // day method does not support 'all' and 'any' interfaces
	    is.day.api = ['not'];

	    // is a given date in daylight saving time?
	    is.dayLightSavingTime = function(date) {
	        var january = new Date(date.getFullYear(), 0, 1);
	        var july = new Date(date.getFullYear(), 6, 1);
	        var stdTimezoneOffset = Math.max(january.getTimezoneOffset(), july.getTimezoneOffset());
	        return date.getTimezoneOffset() < stdTimezoneOffset;
	    };

	    // is a given date future?
	    is.future = function(date) {
	        var now = new Date();
	        return is.date(date) && date.getTime() > now.getTime();
	    };

	    // is date within given range?
	    is.inDateRange = function(date, start, end) {
	        if (is.not.date(date) || is.not.date(start) || is.not.date(end)) {
	            return false;
	        }
	        var stamp = date.getTime();
	        return stamp > start.getTime() && stamp < end.getTime();
	    };
	    // inDateRange method does not support 'all' and 'any' interfaces
	    is.inDateRange.api = ['not'];

	    // is a given date in last month range?
	    is.inLastMonth = function(date) {
	        return is.inDateRange(date, new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date());
	    };

	    // is a given date in last week range?
	    is.inLastWeek = function(date) {
	        return is.inDateRange(date, new Date(new Date().setDate(new Date().getDate() - 7)), new Date());
	    };

	    // is a given date in last year range?
	    is.inLastYear = function(date) {
	        return is.inDateRange(date, new Date(new Date().setFullYear(new Date().getFullYear() - 1)), new Date());
	    };

	    // is a given date in next month range?
	    is.inNextMonth = function(date) {
	        return is.inDateRange(date, new Date(), new Date(new Date().setMonth(new Date().getMonth() + 1)));
	    };

	    // is a given date in next week range?
	    is.inNextWeek = function(date) {
	        return is.inDateRange(date, new Date(), new Date(new Date().setDate(new Date().getDate() + 7)));
	    };

	    // is a given date in next year range?
	    is.inNextYear = function(date) {
	        return is.inDateRange(date, new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 1)));
	    };

	    // is the given year a leap year?
	    is.leapYear = function(year) {
	        return is.number(year) && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
	    };

	    // is a given dates month equal given month parameter?
	    is.month = function(date, month) {
	        return is.date(date) && month.toLowerCase() === months[date.getMonth()];
	    };
	    // month method does not support 'all' and 'any' interfaces
	    is.month.api = ['not'];

	    // is a given date past?
	    is.past = function(date) {
	        var now = new Date();
	        return is.date(date) && date.getTime() < now.getTime();
	    };

	    // is a given date in the parameter quarter?
	    is.quarterOfYear = function(date, quarter) {
	        return is.date(date) && is.number(quarter) && quarter === Math.floor((date.getMonth() + 3) / 3);
	    };
	    // quarterOfYear method does not support 'all' and 'any' interfaces
	    is.quarterOfYear.api = ['not'];

	    // is a given date indicate today?
	    is.today = function(date) {
	        var now = new Date();
	        var todayString = now.toDateString();
	        return is.date(date) && date.toDateString() === todayString;
	    };

	    // is a given date indicate tomorrow?
	    is.tomorrow = function(date) {
	        var now = new Date();
	        var tomorrowString = new Date(now.setDate(now.getDate() + 1)).toDateString();
	        return is.date(date) && date.toDateString() === tomorrowString;
	    };

	    // is a given date weekend?
	    // 6: Saturday, 0: Sunday
	    is.weekend = function(date) {
	        return is.date(date) && (date.getDay() === 6 || date.getDay() === 0);
	    };

	    // is a given date weekday?
	    is.weekday = not(is.weekend);

	    // is a given dates year equal given year parameter?
	    is.year = function(date, year) {
	        return is.date(date) && is.number(year) && year === date.getFullYear();
	    };
	    // year method does not support 'all' and 'any' interfaces
	    is.year.api = ['not'];

	    // is a given date indicate yesterday?
	    is.yesterday = function(date) {
	        var now = new Date();
	        var yesterdayString = new Date(now.setDate(now.getDate() - 1)).toDateString();
	        return is.date(date) && date.toDateString() === yesterdayString;
	    };

	    // Environment checks
	    /* -------------------------------------------------------------------------- */

	    var freeGlobal = is.windowObject(typeof commonjsGlobal == 'object' && commonjsGlobal) && commonjsGlobal;
	    var freeSelf = is.windowObject(typeof self == 'object' && self) && self;
	    var thisGlobal = is.windowObject(typeof this == 'object' && this) && this;
	    var root = freeGlobal || freeSelf || thisGlobal || Function('return this')();

	    var document = freeSelf && freeSelf.document;
	    var previousIs = root.is;

	    // store navigator properties to use later
	    var navigator = freeSelf && freeSelf.navigator;
	    var appVersion = (navigator && navigator.appVersion || '').toLowerCase();
	    var userAgent = (navigator && navigator.userAgent || '').toLowerCase();
	    var vendor = (navigator && navigator.vendor || '').toLowerCase();

	    // is current device android?
	    is.android = function() {
	        return /android/.test(userAgent);
	    };
	    // android method does not support 'all' and 'any' interfaces
	    is.android.api = ['not'];

	    // is current device android phone?
	    is.androidPhone = function() {
	        return /android/.test(userAgent) && /mobile/.test(userAgent);
	    };
	    // androidPhone method does not support 'all' and 'any' interfaces
	    is.androidPhone.api = ['not'];

	    // is current device android tablet?
	    is.androidTablet = function() {
	        return /android/.test(userAgent) && !/mobile/.test(userAgent);
	    };
	    // androidTablet method does not support 'all' and 'any' interfaces
	    is.androidTablet.api = ['not'];

	    // is current device blackberry?
	    is.blackberry = function() {
	        return /blackberry/.test(userAgent) || /bb10/.test(userAgent);
	    };
	    // blackberry method does not support 'all' and 'any' interfaces
	    is.blackberry.api = ['not'];

	    // is current browser chrome?
	    // parameter is optional
	    is.chrome = function(range) {
	        var match = /google inc/.test(vendor) ? userAgent.match(/(?:chrome|crios)\/(\d+)/) : null;
	        return match !== null && compareVersion(match[1], range);
	    };
	    // chrome method does not support 'all' and 'any' interfaces
	    is.chrome.api = ['not'];

	    // is current device desktop?
	    is.desktop = function() {
	        return is.not.mobile() && is.not.tablet();
	    };
	    // desktop method does not support 'all' and 'any' interfaces
	    is.desktop.api = ['not'];

	    // is current browser edge?
	    // parameter is optional
	    is.edge = function(range) {
	        var match = userAgent.match(/edge\/(\d+)/);
	        return match !== null && compareVersion(match[1], range);
	    };
	    // edge method does not support 'all' and 'any' interfaces
	    is.edge.api = ['not'];

	    // is current browser firefox?
	    // parameter is optional
	    is.firefox = function(range) {
	        var match = userAgent.match(/(?:firefox|fxios)\/(\d+)/);
	        return match !== null && compareVersion(match[1], range);
	    };
	    // firefox method does not support 'all' and 'any' interfaces
	    is.firefox.api = ['not'];

	    // is current browser internet explorer?
	    // parameter is optional
	    is.ie = function(range) {
	        var match = userAgent.match(/(?:msie |trident.+?; rv:)(\d+)/);
	        return match !== null && compareVersion(match[1], range);
	    };
	    // ie method does not support 'all' and 'any' interfaces
	    is.ie.api = ['not'];

	    // is current device ios?
	    is.ios = function() {
	        return is.iphone() || is.ipad() || is.ipod();
	    };
	    // ios method does not support 'all' and 'any' interfaces
	    is.ios.api = ['not'];

	    // is current device ipad?
	    // parameter is optional
	    is.ipad = function(range) {
	        var match = userAgent.match(/ipad.+?os (\d+)/);
	        return match !== null && compareVersion(match[1], range);
	    };
	    // ipad method does not support 'all' and 'any' interfaces
	    is.ipad.api = ['not'];

	    // is current device iphone?
	    // parameter is optional
	    is.iphone = function(range) {
	        // original iPhone doesn't have the os portion of the UA
	        var match = userAgent.match(/iphone(?:.+?os (\d+))?/);
	        return match !== null && compareVersion(match[1] || 1, range);
	    };
	    // iphone method does not support 'all' and 'any' interfaces
	    is.iphone.api = ['not'];

	    // is current device ipod?
	    // parameter is optional
	    is.ipod = function(range) {
	        var match = userAgent.match(/ipod.+?os (\d+)/);
	        return match !== null && compareVersion(match[1], range);
	    };
	    // ipod method does not support 'all' and 'any' interfaces
	    is.ipod.api = ['not'];

	    // is current operating system linux?
	    is.linux = function() {
	        return /linux/.test(appVersion);
	    };
	    // linux method does not support 'all' and 'any' interfaces
	    is.linux.api = ['not'];

	    // is current operating system mac?
	    is.mac = function() {
	        return /mac/.test(appVersion);
	    };
	    // mac method does not support 'all' and 'any' interfaces
	    is.mac.api = ['not'];

	    // is current device mobile?
	    is.mobile = function() {
	        return is.iphone() || is.ipod() || is.androidPhone() || is.blackberry() || is.windowsPhone();
	    };
	    // mobile method does not support 'all' and 'any' interfaces
	    is.mobile.api = ['not'];

	    // is current state offline?
	    is.offline = not(is.online);
	    // offline method does not support 'all' and 'any' interfaces
	    is.offline.api = ['not'];

	    // is current state online?
	    is.online = function() {
	        return !navigator || navigator.onLine === true;
	    };
	    // online method does not support 'all' and 'any' interfaces
	    is.online.api = ['not'];

	    // is current browser opera?
	    // parameter is optional
	    is.opera = function(range) {
	        var match = userAgent.match(/(?:^opera.+?version|opr)\/(\d+)/);
	        return match !== null && compareVersion(match[1], range);
	    };
	    // opera method does not support 'all' and 'any' interfaces
	    is.opera.api = ['not'];

	    // is current browser phantomjs?
	    // parameter is optional
	    is.phantom = function(range) {
	        var match = userAgent.match(/phantomjs\/(\d+)/);
	        return match !== null && compareVersion(match[1], range);
	    };
	    // phantom method does not support 'all' and 'any' interfaces
	    is.phantom.api = ['not'];

	    // is current browser safari?
	    // parameter is optional
	    is.safari = function(range) {
	        var match = userAgent.match(/version\/(\d+).+?safari/);
	        return match !== null && compareVersion(match[1], range);
	    };
	    // safari method does not support 'all' and 'any' interfaces
	    is.safari.api = ['not'];

	    // is current device tablet?
	    is.tablet = function() {
	        return is.ipad() || is.androidTablet() || is.windowsTablet();
	    };
	    // tablet method does not support 'all' and 'any' interfaces
	    is.tablet.api = ['not'];

	    // is current device supports touch?
	    is.touchDevice = function() {
	        return !!document && ('ontouchstart' in freeSelf ||
	            ('DocumentTouch' in freeSelf && document instanceof DocumentTouch));
	    };
	    // touchDevice method does not support 'all' and 'any' interfaces
	    is.touchDevice.api = ['not'];

	    // is current operating system windows?
	    is.windows = function() {
	        return /win/.test(appVersion);
	    };
	    // windows method does not support 'all' and 'any' interfaces
	    is.windows.api = ['not'];

	    // is current device windows phone?
	    is.windowsPhone = function() {
	        return is.windows() && /phone/.test(userAgent);
	    };
	    // windowsPhone method does not support 'all' and 'any' interfaces
	    is.windowsPhone.api = ['not'];

	    // is current device windows tablet?
	    is.windowsTablet = function() {
	        return is.windows() && is.not.windowsPhone() && /touch/.test(userAgent);
	    };
	    // windowsTablet method does not support 'all' and 'any' interfaces
	    is.windowsTablet.api = ['not'];

	    // Object checks
	    /* -------------------------------------------------------------------------- */

	    // has a given object got parameterized count property?
	    is.propertyCount = function(object, count) {
	        if (is.not.object(object) || is.not.number(count)) {
	            return false;
	        }
	        var n = 0;
	        for (var property in object) {
	            if (hasOwnProperty.call(object, property) && ++n > count) {
	                return false;
	            }
	        }
	        return n === count;
	    };
	    // propertyCount method does not support 'all' and 'any' interfaces
	    is.propertyCount.api = ['not'];

	    // is given object has parameterized property?
	    is.propertyDefined = function(object, property) {
	        return is.object(object) && is.string(property) && property in object;
	    };
	    // propertyDefined method does not support 'all' and 'any' interfaces
	    is.propertyDefined.api = ['not'];

	    // Array checks
	    /* -------------------------------------------------------------------------- */

	    // is a given item in an array?
	    is.inArray = function(value, array) {
	        if (is.not.array(array)) {
	            return false;
	        }
	        for (var i = 0; i < array.length; i++) {
	            if (array[i] === value) {
	                return true;
	            }
	        }
	        return false;
	    };
	    // inArray method does not support 'all' and 'any' interfaces
	    is.inArray.api = ['not'];

	    // is a given array sorted?
	    is.sorted = function(array, sign) {
	        if (is.not.array(array)) {
	            return false;
	        }
	        var predicate = comparator[sign] || comparator['>='];
	        for (var i = 1; i < array.length; i++) {
	            if (!predicate(array[i], array[i - 1])) {
	                return false;
	            }
	        }
	        return true;
	    };

	    // API
	    // Set 'not', 'all' and 'any' interfaces to methods based on their api property
	    /* -------------------------------------------------------------------------- */

	    function setInterfaces() {
	        var options = is;
	        for (var option in options) {
	            if (hasOwnProperty.call(options, option) && is['function'](options[option])) {
	                var interfaces = options[option].api || ['not', 'all', 'any'];
	                for (var i = 0; i < interfaces.length; i++) {
	                    if (interfaces[i] === 'not') {
	                        is.not[option] = not(is[option]);
	                    }
	                    if (interfaces[i] === 'all') {
	                        is.all[option] = all(is[option]);
	                    }
	                    if (interfaces[i] === 'any') {
	                        is.any[option] = any(is[option]);
	                    }
	                }
	            }
	        }
	    }
	    setInterfaces();

	    // Configuration methods
	    // Intentionally added after setInterfaces function
	    /* -------------------------------------------------------------------------- */

	    // change namespace of library to prevent name collisions
	    // var preferredName = is.setNamespace();
	    // preferredName.odd(3);
	    // => true
	    is.setNamespace = function() {
	        root.is = previousIs;
	        return this;
	    };

	    // set optional regexes to methods
	    is.setRegexp = function(regexp, name) {
	        for (var r in regexes) {
	            if (hasOwnProperty.call(regexes, r) && (name === r)) {
	                regexes[r] = regexp;
	            }
	        }
	    };

	    return is;
	}));
	});

	/**
	 * A Moodle version string. These are the version numbers used on the
	 * [Moodle download page](https://download.moodle.org/releases/latest/) and
	 * displayed in the footer of the Moodle admin area.
	 *
	 * Moodle version strings generally consist of the branch string separated from
	 * the release number by a period. The initial release for a given branch is
	 * given the release number zero, which may be omitted. Alpha and Beta releases
	 * have `dev` appended, and weekly releases have a plus symbol appended.
	 *
	 * For example, all the development releases of the Moodle 3.5 branch have the
	 * version string `3.5dev`, the initial release is `3.5`, the
	 * first update release is `3.5.1`, and all weekly releases between the
	 * release of `3.5.1` and `3.5.2` share `3.5.1+`.
	 *
	 * @typedef {string} VersionString
	 * @example '3.5dev'
	 * @example '3.5'
	 * @example '3.5+'
	 * @example '3.5.1'
	 * @example '3.5.1+'
	 */

	/**
	 * A moodle version number. These version numbers are used under-the-hood in
	 * the Moodle source code. They consist of the branch's branch date number
	 * followed by the release number, optionally followed by a period and an
	 * incremental change number.
	 *
	 * For example, the Moodle 3.3.6 release has the version number `2017051506.00`.
	 * The branch date number for Moodle 3.3 is `20170515` (a {@link DateNumber}),
	 * which is then followed by the two-digit form of the release number, `06`, and
	 * an incremental change number of `00`.
	 *
	 * @typedef {string|number} VersionNumber
	 * @example '2017051506.00'
	 * @see DateNumber
	 */

	/**
	 * A Moodle branch string. These are the human-friendly major-version numbers
	 * used throught the official Moodle documentation. They take the form of two
	 * digits separated by a period, e.g. `3.5`.
	 * 
	 * @typedef {string} BranchString
	 * @example '3.5'
	 */

	/**
	 * A Moodle branch number. These are used under-the-hood to represent Moodel
	 * branches within the Moodle code. They take the form of a two-digit integer
	 * number - the human-friendly branch without the period e.g. Moodle 3.5 has a
	 * branch number of `35`.
	 *
	 * @typedef {number|string} BranchNumber
	 * @see BranchString
	 * @example 35
	 */

	/**
	 * A Moodle release string. These are the release strings Moodle's documentation
	 * describes as *human friendly*. They are used in the following contexts:
	 * 
	 * 1. The admin section of web interface
	 * 2. The CLI command `admin/cli/cfg.php --name=release`
	 * 3. The variable `$release` in `version.php`
	 *
	 * In some contexts they're pre-fixed with the word *Moodle*, in others they're
	 * not.
	 *
	 * Examples:
	 * 
	 * * `'3.3.6 (Build: 20180517)'` - the offical Moodle 3.3.6 release.
	 * * `'Moodle 3.5+ (Build: 20180614)'` - a weekly Moodle 3.5.0 release.
	 *
	 * @typedef {string} ReleaseString
	 * @see VersionString
	 * @example '3.3.6 (Build: 20180517)'
	 */

	/**
	 * An integer representing an offical Moodle release within a branch. The
	 * initial release of any branch has the release number 0, subsequent offical
	 * update releases then count up from there.
	 * 
	 * @typedef {number|string} ReleaseNumber
	 */

	/**
	 * Moodle releases are categoriesed into one of three types:
	 *
	 * 1. Development releases, both betas and alphas.
	 * 2. Official stable releases.
	 * 3. Weekly updates to official stable releases.
	 *
	 * These three values are represented as `'development'`, `'official'`, and
	 * `'weekly'`.
	 *
	 * @typedef {string} ReleaseType
	 */

	/**
	 * A release suffix is used to indicate the release type in some Moodle version
	 * strings. Possible values are:
	 *
	 * * `'dev'` for development releases.
	 * * `''` (an empty string) for official stable releases.
	 * * `+` for weekly updates to official stable releases.
	 * 
	 * @typedef {string} ReleaseSuffix
	 */

	/**
	 * Each released moodle build, both the weeklys and the offical updates are
	 * assigned a build number which takes the form of a {@link DateNumber}.
	 * 
	 * @typedef {DateNumber} BuildNumber
	 */

	/**
	 * An 8-digit date representation used within a number of Moodle version
	 * identifiers. The first four digits represent the year, the next two the
	 * month and the last two the day of the month.
	 *
	 * For example, Christmas 2018 has the date number `20181225`.
	 * 
	 * @typedef {string|number} DateNumber
	 * @example '20181225'
	 */

	/**
	 * A mapping form branch numbers to branching date numbers.
	 * 
	 * @type {Map<BranchNumber, DateNumber>}
	 * @protected
	 */
	const BNUM_BDNUM_MAP = {
	    '22': 20111205,
	    '23': 20120625,
	    '24': 20121203,
	    '25': 20130514,
	    '26': 20131118,
	    '27': 20140512,
	    '28': 20141110,
	    '29': 20150511,
	    '30': 20151116,
	    '31': 20160523,
	    '32': 20161205,
	    '33': 20170515,
	    '34': 20171113,
	    '35': 20180517,
		'36': 20181203,
		'37': 20190520,
		'38': 20191118,
		'39': 20200615
	};

	/**
	 * A mapping form branching date numbers to branch numbers.
	 * 
	 * @type {Map<DateNumber, BranchNumber>}
	 * @protected
	 */
	const BDNUM_BNUM_MAP = {};
	for(const bn of Object.keys(BNUM_BDNUM_MAP)){
	    BDNUM_BNUM_MAP[BNUM_BDNUM_MAP[bn]] = parseInt(bn);
	}

	/**
	 * A list of LTS (Long-Term Support) branch numbers.
	 *
	 * @type {Array<number>}
	 * @protected
	 */
	const LTS_BNUMS = [27, 31, 35];

	/**
	 * A lookup table to test if a given branch number is a long-term support (LTS)
	 * branch. This lookup table is generated from {@link LTS_BNUMS}.
	 *
	 * @type {Object}
	 * @protected
	 * @see LTS_BNUMS
	 */
	const BNUM_LTS_LOOKUP = {};
	for(const bnum of LTS_BNUMS){
	    BNUM_LTS_LOOKUP[bnum] = true;
	}

	/**
	 * Convert a value to a string for use in string representations of the
	 * version. `undefined` is returned as `'??'` and all other values are
	 * converted to a string with JavaScript's `String()` function.
	 *
	 * @param {*} val
	 * @return {string}
	 * @private
	*/
	function TO_STR(val){
	    return is.undefined(val) ? '??' : String(val);
	}

	/**
	 * A class for parsing and representing
	 * [version information](https://docs.moodle.org/35/en/Moodle_version) for the
	 * [Moodle VLE](http://moodle.org/).
	 *
	 * The class can parse both the human-friendly Moodle release strings like
	 * `3.3.6 (Build: 20180517)`, and the underlying raw version numbers like
	 * `2017051506`.
	 *
	 * Note that this class only reliably understands version information from
	 * Moodle 2.2 up. The reason for this limitation is that this is the first
	 * Moodle version which uses the now standard versioning conventions.
	 *
	 * @see https://docs.moodle.org/35/en/Moodle_version
	 * @see https://docs.moodle.org/dev/Releases
	 */
	class MoodleVersion {
	    /**
	     * By default version objects contain no information.
	     *
	     * If a string is passed, the object is initialised using
	     * {@link MoodleVersion.fromString}, and if an object is passed then
	     * {@link MoodleVersion.fromObject} is used instead.
	     *
	     * @param {string|Object} versionInfo
	     * @throws TypeError
	     * @throws RangeError
	     */
	    constructor(versionInfo) {
	        let newObj;
	        if(is.not.undefined(versionInfo)){
	            if(is.string(versionInfo)){
	                newObj = MoodleVersion.fromString(versionInfo);
	            }else if(is.object(versionInfo) && is.not.array(versionInfo) && is.not.function(versionInfo) && is.not.error(versionInfo)){
	                newObj = MoodleVersion.fromObject(versionInfo);
	            }else {
	                throw new TypeError('the MoodleVersion constructor only accepts strings and objects');
	            }
	        }
	        
	        /**
	         * @type {BranchNumber|undefined}
	         */
	        this._branchNumber = undefined;
	        if(newObj) this._branchNumber = newObj._branchNumber;
	        
	        /**
	         * @type {DateNumber|undefined}
	         */
	        this._branchingDateNumber = undefined;
	        if(newObj) this._branchingDateNumber = newObj._branchingDateNumber;
	        
	        /**
	         * @type {ReleaseNumber|undefined}
	         */
	        this._releaseNumber = undefined;
	        if(newObj) this._releaseNumber = newObj._releaseNumber;
	        
	        /**
	         * @type {ReleaseType|undefined}
	         */
	        this._releaseType = undefined;
	        if(newObj) this._releaseType = newObj._releaseType;
	        
	        /**
	         * @type {BuildNumber|undefined}
	         */
	        this._buildNumber = undefined;
	        if(newObj) this._buildNumber = newObj._buildNumber;
	    }
	    
	    /**
	     * Test if a given value is a date number, i.e. an 8-digit number of the
	     * form `YYYYMMDD`.
	     *
	     * @param {*} val - the value to test.
	     * @param {boolean} [strictTypeCheck=false] - whether or not to enable
	     * strict type checking. With strict type cheking enabled, string
	     * representation of otherwise valid values will return `false`.
	     * @return {boolean}
	     */
	    static isDateNumber(val, strictTypeCheck){
	        if(is.not.number(val)){
	            if(strictTypeCheck) return false;
	            if(is.not.string(val)) return false;
	        }
	        return String(val).match(/^[12]\d{3}[01]\d[0123]\d$/) ? true : false;
	    }
	    
	    /**
	     * Test if a given value is a branch string, e.g. `'3.5'`.
	     *
	     * @param {*} val - the value to test.
	     * @return {boolean}
	     */
	    static isBranch(val){
	        return is.string(val) && val.match(/^[1-9][.]\d$/) ? true : false;
	    }
	    
	    /**
	     * Test if a given value is a branch number, e.g. `35` or `'35'`.
	     *
	     * @param {*} val - the value to test.
	     * @param {boolean} [strictTypeCheck=false] - whether or not to enable
	     * strict type checking. With strict type cheking enabled, string
	     * representation of otherwise valid values will return `false`.
	     * @return {boolean}
	     */
	    static isBranchNumber(val, strictTypeCheck = false){
	        if(is.not.number(val)){
	            if(strictTypeCheck) return false;
	            if(is.not.string(val)) return false;
	        }
	        return String(val).match(/^[1-9]\d$/) ? true : false;
	    }
	    
	    /**
	     * Test if a given value is a release number.
	     *
	     * Note that if strict type checking is not enabled, the empty string is
	     * considered a valid release number, being synonymous with zero in
	     * Moodle release strings.
	     *
	     * @param {*} val - the value to test.
	     * @param {boolean} [strictTypeCheck=false] - whether or not to enable
	     * strict type checking. With strict type cheking enabled, string
	     * representation of otherwise valid values will return `false`.
	     * @return {boolean}
	     */
	    static isReleaseNumber(val, strictTypeCheck = false){
	        if(is.not.number(val)){
	            if(strictTypeCheck) return false;
	            if(is.not.string(val)) return false;
	        }
	        return val === '' || String(val).match(/^\d+$/) ? true : false;
	    }
	    
	    /**
	     * Test if a given value is a valid release type.
	     *
	     * @param {*} val - the value to test.
	     * @return {boolean}
	     * @see ReleaseType
	     */
	    static isReleaseType(val){
	        return val === 'development' || val === 'official' || val === 'weekly' ? true : false;
	    }
	    
	    /**
	     * Test if a given value is a valid release suffix.
	     *
	     * @param {*} val - the value to test.
	     * @return {boolean}
	     * @see ReleaseSuffix
	     */
	    static isReleaseSuffix(val){
	        return val === 'dev' || val === '' || val === '+' ? true : false;
	    }
	    
	    /**
	     * Convert a branch number into a branch string, i.e. `35` to `'3.5'`.
	     *
	     * @param {BranchNumber} bn
	     * @return {BranchString|undefined} If the passed value can't be converted
	     * to a branch `undefined` is returned.
	     */
	    static branchFromBranchNumber(bn){
	        if(is.undefined(bn)) return undefined;
	        if(!MoodleVersion.isBranchNumber(bn, false)) return undefined;
	        return String(bn).split('').join('.');
	    }
	    
	    /**
	     * Convert a branching date number to a branch, e.g. `20180517` to
	     * `'3.5'`.
	     *
	     * @param {DateNumber} bdn
	     * @return {BranchString|undefined}
	     */
	    static branchFromBranchingDateNumber(bdn){
	        if(is.undefined(bdn)) return undefined;
	        if(!MoodleVersion.isDateNumber(bdn, false)) return undefined;
	        let bn = BDNUM_BNUM_MAP[bdn];
	        if(is.undefined(bn)) return undefined;
	        return MoodleVersion.branchFromBranchNumber(bn);
	    }
	    
	    /**
	     * Convert a branch string into a branch number, i.e. `'3.5'` to `35`.
	     *
	     * @param {BranchString} b
	     * @return {number|undefined} If the passed value can't be converted
	     * to a branch number `undefined` is returned.
	     */
	    static branchNumberFromBranch(b){
	        if(is.undefined(b)) return undefined;
	        if(!MoodleVersion.isBranch(b)) return undefined;
	        return parseInt(b.split(/[.]/).join(''));
	    }
	    
	    /**
	     * Convert a branching date number to a branch number, e.g. `20180517` to
	     * `35`.
	     *
	     * @param {DateNumber} bdn
	     * @return {number|undefined}
	     */
	    static branchNumberFromBranchingDateNumber(bdn){
	        if(is.undefined(bdn)) return undefined;
	        if(!MoodleVersion.isDateNumber(bdn, false)) return undefined;
	        return BDNUM_BNUM_MAP[bdn] ? BDNUM_BNUM_MAP[bdn] : undefined;
	    }
	    
	    /**
	     * Convert a branch to a branching date number, e.g. `'3.5'` to `20180517`.
	     *
	     * @param {BranchString} b
	     * @return {number|undefined}
	     */
	    static branchingDateNumberFromBranch(b){
	        if(is.undefined(b)) return undefined;
	        const bn = MoodleVersion.branchNumberFromBranch(b);
	        if(is.undefined(bn)) return undefined;
	        return BNUM_BDNUM_MAP[bn] ? BNUM_BDNUM_MAP[bn] : undefined;
	    }
	    
	    /**
	     * Convert a branch number to a branching date number, e.g. `35` to `20180517`.
	     *
	     * @param {BranchNumber} bn
	     * @return {number|undefined}
	     */
	    static branchingDateNumberFromBranchNumber(bn){
	        if(is.undefined(bn)) return undefined;
	        return BNUM_BDNUM_MAP[bn] ? BNUM_BDNUM_MAP[bn] : undefined;
	    }
	    
	    /**
	     * Convert a date number to a date object. The date object will represent
	     * midnight UTC on the given date.
	     *
	     * @param {DateNumber} dn
	     * @return {Date}
	     * @throws {TypeError}
	     */
	    static dateFromDateNumber(dn){
	        if(!MoodleVersion.isDateNumber(dn)) throw new TypeError('date number must of the form YYYYMMDD');
	        const parts = String(dn).match(/^(\d{4})(\d{2})(\d{2})$/);
	        return new Date(`${parts[1]}-${parts[2]}-${parts[3]}T00:00:00.000Z`);
	    }
	    
	    /**
	     * Convert a date object to a date number. The date will be interpreted as
	     * UTC.
	     *
	     * @param {Date} d
	     * @return {DateNumber}
	     * @throws {TypeError}
	     */
	    static dateNumberFromDate(d){
	        if(is.not.date(d)) throw new TypeError('date object required');
	        let m = d.getUTCMonth() + 1;
	        let mm = `${m < 10 ? '0' : ''}${m}`;
	        let day = d.getUTCDate();
	        let dd = `${day < 10 ? '0' : ''}${day}`;
	        return parseInt(`${d.getUTCFullYear()}${mm}${dd}`);
	    }
	    
	    /**
	     * Convert a release type to a release suffix, e.g. `'weekly'` to `'+'`.
	     *
	     * @param {ReleaseType} rt
	     * @return {ReleaseSuffix|undefined}
	     */
	    static releaseSuffixFromReleaseType(rt){
	        if(is.not.string(rt)) return undefined;
	        switch(rt.toLowerCase()){
	            case 'development':
	                return 'dev';
	            case 'official':
	                return '';
	            case 'weekly':
	                return '+';
	        }
	        return undefined;
	    }
	    
	    /**
	     * Convert a relase suffix to a release type, e.g. `'+'` to `'weekly'`.
	     *
	     * @param {ReleaseSuffix} rs
	     * @return {ReleaseType|undefined}
	     */
	    static releaseTypeFromReleaseSuffix(rs){
	        if(is.not.string(rs)) return undefined;
	        switch(rs.toLowerCase()){
	            case 'dev':
	                return 'development';
	            case '':
	                return 'official';
	            case '+':
	                return 'weekly';
	        }
	        return undefined;
	    }
	    
	    /**
	     * Convert a release type to a number. Useful for version comparisons.
	     *
	     * All invalid values convert to `0`, `'development'` to `1`, `'official'`
	     * to `2`, and `'weekly'` to 3.
	     *
	     * @param {*} rt
	     * @return {number}
	     */
	    static numberFromReleaseType(rt){
	        if(!MoodleVersion.isReleaseType(rt)) return 0;
	        switch(rt){
	            case 'weekly': return 3;
	            case 'official': return 2;
	            default: return 1;
	        }
	    }
	    
	    /**
	     * Compare two values to see if they represent the same version, a
	     * greater version, or a lesser version.
	     *
	     * When ranking versions, the branch is given the highest weight, then the
	     * release number, then the release type,
	     * and finally the build number. When comparing release types,
	     * `'development'` is considered earlier `'official'`, which is considered
	     * earlier than `'weekly'`.
	     *
	     * @param {*} val1
	     * @param {*} val2
	     * @return {number} Unless both values are moodle vesion objects, `NaN` is
	     * returned. If `val1` represents an earlier version than `val2` `-1` is
	     * returned, if `val1` and `val2` represent the same version `0` is
	     * returned, and if `val1` represents a later version than `val2` `1` is
	     * returned.
	     */
	    static compare(val1, val2){
	        // unless we get two Moodle versions, return NaN
	        if(!((val1 instanceof MoodleVersion) && (val2 instanceof MoodleVersion))) return NaN;
	        
	        // try find a difference in branch
	        const b1 = is.number(val1.branchNumber) ? val1.branchNumber : 0;
	        const b2 = is.number(val2.branchNumber) ? val2.branchNumber : 0;
	        if(b1 < b2) return -1;
	        if(b1 > b2) return 1;
	        
	        // if there was no difference in branch, try find a difference in release number
	        const r1 = is.number(val1.releaseNumber) ? val1.releaseNumber : 0;
	        const r2 = is.number(val2.releaseNumber) ? val2.releaseNumber : 0;
	        if(r1 < r2) return -1;
	        if(r1 > r2) return 1;
	        
	        // if we've still not found a difference, check the release type
	        const t1 = MoodleVersion.numberFromReleaseType(val1.releaseType);
	        const t2 = MoodleVersion.numberFromReleaseType(val2.releaseType);
	        if(t1 < t2) return -1;
	        if(t1 > t2) return 1;
	        
	        // finally, try split the difference with the build number
	        const bn1 = is.number(val1.buildNumber) ? val1.buildNumber : 0;
	        const bn2 = is.number(val2.buildNumber) ? val2.buildNumber : 0;
	        if(bn1 < bn2) return -1;
	        if(bn1 > bn2) return 1;
	        
	        // if we still haven't split the difference, they must be equal
	        return 0;
	    }
	    
	    /**
	     * A factory method for producing a Moodle Version object given all its
	     * properties.
	     *
	     * If only one of the branch and branching date are passed, and if a known
	     * mapping exists, the other is auto-completed.
	     *
	     * This function can be used to create version objects which contain
	     * unknown mappings between Moodle branches and branching dates.
	     *
	     * @param {Object} obj - an object defining zero or more of the following
	     * keys:
	     *
	     * * `branch` (e.g. `'3.5'`) or `branchNumber` (e.g. `35`) - if both are
	     *   specified `branchNumber` takes precedence.
	     * * `branchingDate` or `branchingDateNumber` - if both are specified
	     *   `branchingDateNumber` takes precedence.
	     * * `releaseNumber`
	     * * `releaseType` (e.g. `'weekly'`) or `releaseSuffix` (e.g. `'+'`) - if
	     *   both are specified, `releaseSuffix` takes precedence
	     * * `buildNumber`
	     * @throws {TypeError} A type error is thrown if an object is not passed,
	     * or, if any of the keys within that object map to an invalid value.
	     */
	    static fromObject(obj){
	        if(is.not.object(obj)) throw new TypeError('object required');
	        
	        const ans = new MoodleVersion();
	        
	        // set the branch if passed
	        if(is.propertyDefined(obj, 'branch') || is.propertyDefined(obj, 'branchNumber')){
	            if(is.not.undefined(obj.branchNumber)){
	                if(!MoodleVersion.isBranchNumber(obj.branchNumber)) throw new TypeError('invalid branch number');
	                ans._branchNumber = parseInt(obj.branchNumber);
	            }else if(is.not.undefined(obj.branch)){
	                if(!MoodleVersion.isBranch(obj.branch)) throw new TypeError('invalid branch');
	                ans._branchNumber = MoodleVersion.branchNumberFromBranch(obj.branch);
	            }
	        }
	        
	        // set the branching date if passed
	        if(is.propertyDefined(obj, 'branchingDate') || is.propertyDefined(obj, 'branchingDateNumber')){
	            if(is.not.undefined(obj.branchingDateNumber)){
	                if(!MoodleVersion.isDateNumber(obj.branchingDateNumber)) throw new TypeError('invalid branching date number');
	                ans._branchingDateNumber = parseInt(obj.branchingDateNumber);
	            }else if(is.not.undefined(obj.branchingDate)){
	                if(is.not.date(obj.branchingDate)) throw new TypeError('invalid branching date');
	                ans._branchingDateNumber = MoodleVersion.dateNumberFromDate(obj.branchingDate);
	            }
	        }
	        
	        // set the release number if passed
	        if(is.not.undefined(obj.releaseNumber)){
	            if(!MoodleVersion.isReleaseNumber(obj.releaseNumber)) throw new TypeError('invalid release number');
	            ans._releaseNumber = parseInt(obj.releaseNumber);
	        }
	        
	        // set the release type if passed
	        if(is.propertyDefined(obj, 'releaseType') || is.propertyDefined(obj, 'releaseSuffix')){
	            if(is.not.undefined(obj.releaseSuffix)){
	                if(!MoodleVersion.isReleaseSuffix(obj.releaseSuffix)) throw new TypeError('invalid release suffix');
	                ans._releaseType = MoodleVersion.releaseTypeFromReleaseSuffix(obj.releaseSuffix);
	            }else if(is.not.undefined(obj.releaseType)){
	                if(!MoodleVersion.isReleaseType(obj.releaseType)) throw new TypeError('invalid release type');
	                ans._releaseType = obj.releaseType.toLowerCase();
	            }
	        }
	        
	        // set the build number if passed
	        if(is.not.undefined(obj.buildNumber)){
	            if(!MoodleVersion.isDateNumber(obj.buildNumber)) throw new TypeError('invalid build number');
	            ans._buildNumber = parseInt(obj.buildNumber);
	        }
	        
	        // if there's a branch but no branching date, try auto-complete it
	        if(is.number(ans._branchNumber) && is.undefined(ans._branchingDateNumber) && is.number(BNUM_BDNUM_MAP[ans._branchNumber])){
	            ans._branchingDateNumber = BNUM_BDNUM_MAP[ans._branchNumber];
	        }
	        
	        // if there's a branching date but no branch, try auto-complete it
	        if(is.number(ans._branchingDateNumber) && is.undefined(ans._branchNumber) && is.number(BDNUM_BNUM_MAP[ans._branchingDateNumber])){
	            ans._branchNumber = BDNUM_BNUM_MAP[ans._branchingDateNumber];
	        }
	        
	        return ans;
	    }
	    
	    /**
	     * A regular expression for matching human-friendly Moodle release strings.
	     * This RE is case-insensitive and will allow for the optional pre-fixing of
	     * the word *Moodle* with or whithout a separating space.
	     *
	     * @type {RegExp}
	     * @see {@link ReleaseString}
	     */
	    static get releaseRE(){
	        return /(?:Moodle[ ]?)?(\d[.]\d)(?:[.](\d+))?(dev|[+])?[ ]?[(]Build[:][ ]?(\d{8})[)]/i;
	    }
	    
	    /**
	     * A regular expression for matching short version strings like `'3.5+'` (as
	     * used on the Moodle download page). This RE is case-insensitive and will
	     * allow for the optional pre-fixing of the word *Moodle* with or whithout
	     * a separating space.
	     *
	     * @type {RegExp}
	     * @see {@link VersionString}
	     */
	    static get versionRE(){
	        return /(?:Moodle[ ]?)?(\b\d[.]\d)(?:[.](\d+))?(dev|[+])?/i;
	    }
	    
	    /**
	     * A regular expression for matching under-the-hood version numbers like
	     * `'2017051506'` or `'2017051506.00'`.
	     *
	     * @type {RegExp}
	     * @see {@link VersionNumber}
	     */
	    static get versionNumberRE(){
	        return /(\d{8})(\d{2})(?:[.](\d{2}))?/i;
	    }
	    
	    /**
	     * Build a version object from a version string. The vesion string can be
	     * in one of the following formats:
	     *
	     * * A human-friendly full release string ({@link ReleaseString}), e.g.
	     *   `'Moodle 3.5+ (Build: 20180614)'` (will be accepted with or without
	     *   the `'Moodle'` prefix).
	     * * A human-friendly short version string ({@link VersionString}), e.g.
	     *  `'Moodle 3.3.6+'` (will be accepted with or without the `'Moodle'`
	     *  prefix).
	     * * An under-the-hood version number ({@link VersionNumber}), e.g.
	     * * `'2017051506'` or `'2017051506.00'`.
	     * * A string as returned by calling `.toString()` on an instance of this
	     *   class.
	     *
	     * @param {string} verStr - the version string to parse.
	     * @return {MoodleVersion}
	     * @throws {TypeError}
	     * @throws {RangeError}
	     * @see {@link ReleaseString}
	     * @see {@link VersionString}
	     * @see {@link VersionNumber}
	     * @see {@link MoodleVersion#toString}
	     */
	    static fromString(verStr){
	        if(is.not.string(verStr)) throw new TypeError('version string required');
	        const ans = new MoodleVersion();
	        
	        // first try match against a full human-friendly release string
	        let matched = MoodleVersion.releaseRE.exec(verStr);
	        if(matched){
	            ans.branch = matched[1];
	            ans.releaseNumber = matched[2] ? matched[2] : 0;
	            ans.releaseSuffix = matched[3] ? matched[3] : '';
	            ans.buildNumber = matched[4];
	            return ans;
	        }
	        
	        // then try match against an under-the-hood Moodle version number
	        matched = MoodleVersion.versionNumberRE.exec(verStr);
	        if(matched){
	            ans.branchingDateNumber = matched[1];
	            ans.releaseNumber = matched[2] ? parseInt(matched[2]) : 0;
	            return ans;
	        }
	        
	        // next try match a string as produced by .toString()
	        matched = (/((?:[0-9]|[?]{2})[.](?:[0-9]|[?]{2}))[.]((?:[0-9]+|[?]{2}))(dev|[+])?[ ][(]type[:][ ](development|official|weekly|[?]{2})[,][ ]branching[ ]date[:][ ](\d{8}|[?]{2})[ ][&][ ]build[:][ ](\d{8}|[?]{2})[)]/i).exec(verStr);
	        if(matched){
	            const ansObj = {};
	            if(matched[1] != '??.??') ansObj.branch = matched[1];
	            if(matched[2] != '??') ansObj.releaseNumber = matched[2];
	            if(matched[4] != '??') ansObj.releaseType = matched[4];
	            if(matched[5] != '??') ansObj.branchingDateNumber = matched[5];
	            if(matched[6] != '??') ansObj.buildNumber = matched[6];
	            return MoodleVersion.fromObject(ansObj);
	        }
	        
	        // finally try match against a short human-friendly version string
	        matched = MoodleVersion.versionRE.exec(verStr);
	        if(matched){
	            ans.branch = matched[1];
	            ans.releaseNumber = matched[2] ? matched[2] : 0;
	            ans.releaseSuffix = matched[3] ? matched[3] : '';
	            return ans;
	        }
	        
	        // if no match was found, throw a range error
	        throw new RangeError(`failed to extract Moodle version from string: ${verStr}`);
	    }
	    
	    // TO DO - update constructor to accept strings and objects
	    
	    /**
	     * The version's branch number, if known. This is the two-digit number
	     * used internally within the Moodle code to identify a branch, or major
	     * release.
	     *
	     * For example, all Moodle 3.5.* releases will have the branch number `35`.
	     *
	     * @type {number|undefined}
	     */
	    get branchNumber(){
	        return this._branchNumber;
	    }
	    
	    /**
	     * The branch number must be a two-digit integer between 10 and 99.
	     *
	     * Setting the branch number will also update the branching date to match.
	     *
	     * To create an object with an un-known combination of branch and branching
	     * date, use the {@link MoodleVersion.fromObject} factory method.
	     *
	     * @type {BranchNumber|undefined}
	     * @throws {TypeError}
	     * @throws {RangeError} A range error is thrown if the branch does not have
	     * a known mapping to a branching date.
	     */
	    set branchNumber(bn){
	        // short-circuit requests to set undefined
	        if(is.undefined(bn)){
	            this._branchNumber = undefined;
	            this._branchingDateNumber = undefined;
	            return;
	        }
	        
	        // check the validity of the branch number
	        if(!MoodleVersion.isBranchNumber(bn, false)){
	            throw new TypeError('Branch Numbers must be integers between 10 and 99');
	        }
	        
	        //test if we have a mapping to a branching date
	        let bdn = MoodleVersion.branchingDateNumberFromBranchNumber(bn);
	        if(is.undefined(bdn)){
	            throw new RangeError(`the branch number ${bn} does not have a known mapping to a branching date`);
	        }
	        
	        // set the branch number and branching date
	        this._branchNumber = parseInt(bn);
	        this._branchingDateNumber = bdn;
	    }
	    
	    /**
	     * The major version part of the version number, officially known as the
	     * *branch*.
	     *
	     * For example, the branch for each of the 3.4, 3.4+, 3.4.1, and 3.4.1+
	     * releases is `'3.4'`.
	     *
	     * @type {BranchString|undefined}
	     */
	    get branch(){
	        if(is.undefined(this._branchNumber)) return undefined;
	        return MoodleVersion.branchFromBranchNumber(this._branchNumber);
	    }
	    
	    /**
	     * The branch (AKA major version) must be a string consisting of two
	     * digits separated by a period, e.g. `'3.5'`.
	     *
	     * Setting the branch will also update the branching date to match.
	     *
	     * To create an object with an un-known combination of branch and branching
	     * date, use the {@link MoodleVersion.fromObject} factory method.
	     *
	     * @type {BranchString}
	     * @throws {TypeError}
	     * @throws {RangeError} A range error is thrown if the branch does not have
	     * a known mapping to a branching date.
	     */
	    set branch(b){
	        // short-circuit requests to set undefined
	        if(is.undefined(b)){
	            this._branchNumber = undefined;
	            this._branchingDateNumber = undefined;
	            return;
	        }
	        
	        // try convert the branch to a branch number
	        let bn = MoodleVersion.branchNumberFromBranch(b);
	        if(is.not.number(bn)){
	            throw new TypeError(`branches must be strings consisting of a digit, a period, and another digit. Got: ${b}`);
	        }
	        
	        // test if we have a mapping to a branching date
	        let bdn = MoodleVersion.branchingDateNumberFromBranchNumber(bn);
	        if(is.undefined(bdn)){
	            throw new RangeError(`the branch ${b} does not have a known mapping to a branching date`);
	        }
	        
	        // store the branch number & branching date
	        this._branchNumber = bn;
	        this._branchingDateNumber = bdn;
	    }
	    
	    /**
	     * The branching date as a date object.
	     *
	     * @type {Date|undefined}
	     */
	    get branchingDate(){
	        if(is.undefined(this._branchingDateNumber)) return undefined;
	        return MoodleVersion.dateFromDateNumber(this._branchingDateNumber);
	    }
	    
	    /**
	     * Setting the branching date will update the branch to match.
	     *
	     * To create an object with an un-known combination of branch and branching
	     * date, use the {@link MoodleVersion.fromObject} factory method.
	     *
	     * @type{Date|undefined}
	     * @throws {TypeError}
	     * @throws {RangeError} A range error is thrown if the branching date does
	     * not have a known mapping to a branch.
	     */
	    set branchingDate(bd){
	        // deal with un-setting
	        if(is.undefined(bd)){
	            this._branchNumber = undefined;
	            this._branchingDateNumber = undefined;
	            return;
	        }
	        
	        // make sure we got valid data
	        if(is.not.date(bd)) throw new TypeError('the branching date must be a Date object');
	        
	        // convert the date to a date number
	        let bdn = MoodleVersion.dateNumberFromDate(bd);
	        
	        // test if there's a known mapping to a branch
	        let bn = MoodleVersion.branchNumberFromBranchingDateNumber(bdn);
	        if(is.undefined(bn)){
	            throw new RangeError(`the branching date ${bd.toISOString()} does not have a known mapping to a Moodle branch`);
	        }
	        
	        // set the new values
	        this._branchNumber = bn;
	        this._branchingDateNumber = bdn;
	    }
	    
	    /**
	     * The branching date as a {@link DateNumber}.
	     *
	     * @type {DateNumber|undefined}
	     */
	    get branchingDateNumber(){
	        return this._branchingDateNumber;
	    }
	    
	    /**
	     * Setting the branching date will update the branch to match.
	     *
	     * To create an object with an un-known combination of branch and branching
	     * date, use the {@link MoodleVersion.fromObject} factory method.
	     *
	     * @type{DateNumber|undefined}
	     * @throws {TypeError}
	     * @throws {RangeError} A range error is thrown if the branching date does
	     * not have a known mapping to a branch.
	     */
	    set branchingDateNumber(bdn){
	        // deal with un-setting
	        if(is.undefined(bdn)){
	            this._branchNumber = undefined;
	            this._branchingDateNumber = undefined;
	            return;
	        }
	        
	        // make sure we got valid data
	        if(!MoodleVersion.isDateNumber(bdn)) throw new TypeError('the branching date number must be of the form YYYYMMDD');
	        bdn = parseInt(bdn); // force the date number to a number
	        
	        // test if there's a known mapping to a branch
	        let bn = MoodleVersion.branchNumberFromBranchingDateNumber(bdn);
	        if(is.undefined(bn)){
	            throw new RangeError(`the branching date number ${bdn} does not have a known mapping to a Moodle branch`);
	        }
	        
	        // set the new values
	        this._branchNumber = bn;
	        this._branchingDateNumber = bdn;
	    }
	    
	    /**
	     * The known mappings between Moodle braches and branching date numbers.
	     *
	     * @type{Map<Branch, DateNumber>}
	     */
	    get branchingDateNumbersByBranch(){
	        const ans = {};
	        for(const bn of Object.keys(BNUM_BDNUM_MAP)){
	            ans[MoodleVersion.branchFromBranchNumber(bn)] = BNUM_BDNUM_MAP[bn];
	        }
	        return ans;
	    }
	    
	    /**
	     * The known mappings between Moodle brache numberss and branching date
	     * numbers.
	     *
	     * @type{Map<BranchNumber, DateNumber>}
	     */
	    get branchingDateNumbersByBranchNumber(){
	        const ans = {};
	        for(const bn of Object.keys(BNUM_BDNUM_MAP)){
	            ans[bn] = BNUM_BDNUM_MAP[bn];
	        }
	        return ans;
	    }
	    
	    /**
	     * The known mappings between branching date numbers and Moodle branches.
	     *
	     * @type{Map<DateNumber, Branch>}
	     */
	    get branchesByBranchingDateNumber(){
	        const ans = {};
	        for(const bdn of Object.keys(BDNUM_BNUM_MAP)){
	            ans[bdn] = MoodleVersion.branchFromBranchNumber(BDNUM_BNUM_MAP[bdn]);
	        }
	        return ans;
	    }
	    
	    /**
	     * The known mappings between branching date numbers and Moodle branch
	     * numbers.
	     *
	     * @type{Map<DateNumber, BranchNumber>}
	     */
	    get brancheNumbersByBranchingDateNumber(){
	        const ans = {};
	        for(const bdn of Object.keys(BDNUM_BNUM_MAP)){
	            ans[bdn] = BDNUM_BNUM_MAP[bdn];
	        }
	        return ans;
	    }
	    
	    /**
	     * The release number part of the version number.
	     *
	     * @type {ReleaseNumber|undefined}
	     */
	    get releaseNumber(){
	        return this._releaseNumber;
	    }
	    
	    /**
	     * The release number must be an integer greater than or equal to zero.
	     *
	     * @type {ReleaseNumber|undefined}
	     * @throws {TypeError}
	     */
	    set releaseNumber(rn){
	        // short-circuit requests to set undefined
	        if(is.undefined(rn)){
	            this._releaseNumber = undefined;
	            return;
	        }
	        
	        // check the validity of the release number
	        if(!MoodleVersion.isReleaseNumber(rn, false)){
	            throw new TypeError('Release Numbers must be integers greater than or equal to zero');
	        }
	        
	        // set the branch number (coercing the empty string to 0)
	        this._releaseNumber = rn === '' ? 0 : parseInt(rn);
	    }
	    
	    /**
	     * The release's type, e.g. `'development'`.
	     *
	     * @type {ReleaseType|undefined}
	     */
	    get releaseType(){
	        return this._releaseType;
	    }
	    
	    /**
	     * The release type must be one of `'development'`, `'official'`, or
	     * `'weekly'`. The value will get automatically cast to lower case before
	     * validation is applied.
	     *
	     * @type {ReleaseType|undefined}
	     * @throws {TypeError}
	     */
	    set releaseType(rt){
	        const errMsg = "release type must be one of 'development', 'official', or 'weekly'";
	        if(is.not.string(rt)) throw new TypeError(errMsg);
	        rt = rt.toLowerCase();
	        if(!MoodleVersion.isReleaseType(rt)) throw new TypeError(errMsg);
	        this._releaseType = rt;
	    }
	    
	    /**
	     * The release suffix for the release's type, e.g. `'+'` for weekly
	     * updates to the official releases.
	     *
	     * @type {ReleaseSuffix|undefined}
	     */
	    get releaseSuffix(){
	        return MoodleVersion.releaseSuffixFromReleaseType(this._releaseType);
	    }
	    
	    /**
	     * The release suffix must be one of `'dev'`, an empty string, or `'+'`. The
	     * value will get automatically cast to lower case before validation is
	     * applied.
	     *
	     * @type {ReleaseSuffix|undefined}
	     * @throws {TypeError}
	     */
	    set releaseSuffix(rs){
	        const errMsg = "release suffix must be one of 'dev', '', or '+'";
	        if(is.not.string(rs)) throw new TypeError(errMsg);
	        rs = rs.toLowerCase();
	        if(!MoodleVersion.isReleaseSuffix(rs)) throw new TypeError(errMsg);
	        this._releaseType = MoodleVersion.releaseTypeFromReleaseSuffix(rs);
	    }
	    
	    /**
	     * The build number.
	     *
	     * @type {BuildNumber|undefined}
	     */
	    get buildNumber(){
	        return this._buildNumber;
	    }
	    
	    /**
	     * Build numbers must be valid date numbers, i.e. of the form `YYYYMMDD`.
	     *
	     * @type {ReleaseSuffix|undefined}
	     * @throws {TypeError}
	     */
	    set buildNumber(bn){
	        // short-circuit setting to undefined
	        if(is.undefined(bn)){
	            this._buildNumber = undefined;
	            return;
	        }
	        
	        // make sure we got valid data
	        if(!MoodleVersion.isDateNumber(bn)) throw new TypeError('build number must be of the form YYYYMMDD');
	        
	        // store the build number
	        this._buildNumber = parseInt(bn);
	    }
	    
	    /**
	     * The short human-friendly form of the version number.
	     *
	     * In keeping with how Moodle presents version strings, release numbers of
	     * zero are omitted. If the release type is unknown no suffix is appended.
	     * If the branch is unknown it is represented as `'??.??'`, and if the
	     * release number is unknown it's represented as `'.??'`.
	     *
	     * @type {VersionString}
	     */
	    get version(){
	        let ans = is.undefined(this.branch) ? '??.??' : this.branch;
	        if(this.releaseNumber !== 0) ans += `.${TO_STR(this.releaseNumber)}`;
	        if(is.string(this.releaseSuffix)) ans += this.releaseSuffix;
	        return ans;
	    }
	    
	    /**
	     * The under-the-hood form of the version number.
	     *
	     * If the branch is unknown its replaced with eight question marks, and if
	     * the release number is unknown it's replaced with two.
	     *
	     * @type {VersionNumber}
	     */
	    get versionNumber(){
	        let ans = is.undefined(this.branchingDateNumber) ? '????????' : TO_STR(this.branchingDateNumber);
	        ans += `${this.releaseNumber < 10 ? '0' : ''}${TO_STR(this.releaseNumber)}`;
	        return ans;
	    }
	    
	    /**
	     * The long human-friendly form of the version information.
	     *
	     * In keeping with how Moodle presents version strings, release numbers of
	     * zero are omitted. If the release type is unknown no suffix is appended.
	     * If the branch is unknown it is represented as `'??.??'`, if the
	     * release number is unknown it's represented as `'.??'`, and if the build
	     * number is unknown it's represented as `'????????'`.
	     *
	     * @type {ReleaseString}
	     */
	    get release(){
	        return `${this.version} (Build: ${is.undefined(this.buildNumber) ? '????????' : this.buildNumber})`;
	    }
	    
	    /**
	     * Create a new Moodle version object representing the same version
	     * information.
	     *
	     * @return {MoodleVersion}
	     */
	    clone(){
	        return MoodleVersion.fromObject({
	            branchNumber: this._branchNumber,
	            branchingDateNumber: this._branchingDateNumber,
	            releaseNumber: this._releaseNumber,
	            releaseType: this._releaseType,
	            buildNumber: this._buildNumber
	        });
	    }
	    
	    /**
	     * Return a string representation of the version. The output will be of the
	     * form `B.B.R[S] (type: T, branching date: BD & build: BN)`, e.g.
	     * `3.3.6 (type: official, branching date: 20170515 & build: 20180517)`.
	     * Undefined components will be rendered as `??`.
	     *
	     * @return {string}
	     */
	    toString(){
	        let ans = `${is.undefined(this.branch) ? '??.??' : this.branch }.${TO_STR(this.releaseNumber)}`;
	        if(is.string(this.releaseSuffix)) ans += this.releaseSuffix;
	        ans += ` (type: ${TO_STR(this.releaseType)}, branching date: ${TO_STR(this.branchingDateNumber)} & build: ${TO_STR(this.buildNumber)})`;
	        return ans;
	    }
	    
	    /**
	     * The version as a plain object indexed by zero or more of:
	     *
	     * * `version`
	     * * `versionNumber`
	     * * `release`
	     * * `branch`
	     * * `branchNumber`
	     * * `branchingDateNumber`
	     * * `branchingDate`
	     * * `releaseNumber`
	     * * `releaseType`
	     * * `releaseSuffix`
	     * * `buildNumber`
	     *
	     * @return {Object}
	     */
	    toObject(){
	        return {
	            version: this.version,
	            versionNumber: this.versionNumber,
	            release: this.release,
	            branch: this.branch,
	            branchNumber: this.branchNumber,
	            branchingDateNumber: this.branchingDateNumber,
	            branchingDate: this.branchingDate,
	            releaseNumber: this.releaseNumber,
	            releaseType: this.releaseType,
	            releaseSuffix: this.releaseSuffix,
	            buildNumber: this.buildNumber
	        };
	    }
	    
	    /**
	     * Test if a given value is a Moodle Version object representing the same
	     * version.
	     *
	     * @param {*} val
	     * @return {boolean}
	     */
	    equals(val){
	        return MoodleVersion.compare(this, val) === 0 ? true : false;
	    }
	    
	    /**
	     * Compare this version to another.
	     *
	     * @param {MoodleVersion} mv
	     * @return {number} `-1` returned if passed version is lesser, `0` if the
	     * passed version is the same, and `1` if the passed version is greater. If
	     * the passed value is not a Moodle version object, `NaN` will be returned.
	     */
	    compareTo(mv){
	        return MoodleVersion.compare(mv, this);
	    }
	    
	    /**
	     * Determine whether this versions is on the same branch as a given version.
	     *
	     * @param {MoodleVersion} mv
	     * @return {boolean|undefined} If the two versions share a branch then
	     * `true` is returned, if the branch numbers differ, `false` is returned.
	     * If the value passed is not a Moodle version object, or, the branch
	     * is undefined in both versions, `undefined` is returned.
	     */
	    sameBranch(mv){
	        if(!(mv instanceof MoodleVersion)) return undefined;
	        if(is.all.undefined(this.branch, mv.branch)) return undefined;
	        return this.branch === mv.branch;
	    }
	    
	    /**
	     * Determine whether this version is less than a given version.
	     *
	     * @param {MoodleVersion} mv
	     * @return {boolean|undefined} If the version is definitely lesser then
	     * `true` is returned, and if the version is equal or definitely greater
	     * then `false` is returned. If the value is not a Moodle version object
	     * then `undefined` is returned.
	     */
	    lessThan(mv){
	        const cmp = MoodleVersion.compare(this, mv);
	        if(is.nan(cmp)) return undefined;
	        return cmp === -1 ? true : false;
	    }
	    
	    /**
	     * Determine whether this version is greater than a given version.
	     *
	     * @param {MoodleVersion} mv
	     * @return {boolean|undefined} If the version is definitely greater then
	     * `true` is returned, and if the version is equal or definitely less than
	     * then `false` is returned. If the value is not a Moodle version object
	     * then `undefined` is returned.
	     */
	    greaterThan(mv){
	        const cmp = MoodleVersion.compare(this, mv);
	        if(is.nan(cmp)) return undefined;
	        return cmp === 1 ? true : false;
	    }
	    
	    /**
	     * Is this a stable release? I.e. is the release type `official` or
	     * `weekly`?
	     *
	     * @return {boolean|undefined} Both official and weekly releases are
	     * considered stable, while development releases are not. If the release
	     * type is not defined, `undefined` is returned.
	     */
	    isStable(){
	        if(is.undefined(this.releaseType)) return undefined;
	        return this.releaseType === 'official' || this.releaseType === 'weekly' ? true : false;
	    }
	    
	    /**
	     * Is this version on a branch the library knows about?
	     *
	     * @return {boolean}
	     */
	    isKnownBranch(){
	        return is.not.undefined(BNUM_BDNUM_MAP[this.branchNumber]);
	    }
	    
	    /**
	     * Determine whether or not this is version is on a long-term support
	     * branch. If the branch is not defined or unknown, `undefined` is returned.
	     *
	     * @return {boolean|undefined}
	     */
	    isLTS(){
	        if(is.undefined(this.branchNumber)) return undefined;
	        if(!this.isKnownBranch()) return undefined;
	        return is.not.undefined(BNUM_LTS_LOOKUP[this.branchNumber]);
	    }
	}

	return MoodleVersion;

})));
