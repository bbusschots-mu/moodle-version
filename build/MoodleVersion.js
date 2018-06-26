// Generated by uRequire v0.7.0-beta.33  template: 'combined'
// Combined template optimized with RequireJS/r.js v2.2.0 & almond v0.3.3.
(function (global, window){
  
var __isAMD = !!(typeof define === 'function' && define.amd),
    __isNode = (typeof exports === 'object'),
    __isWeb = !__isNode;


  var __nodeRequire = (__isNode ? require : function(dep){
        throw new Error("uRequire: combined template 'undefined', trying to load `node` dep `" + dep + "` in non-nodejs runtime (browser).")
      }),
      __throwMissing = function(dep, vars) {
        throw new Error("uRequire: combined template 'undefined', detected missing dependency `" + dep + "` - all it's known binding variables `" + vars + "` were undefined")
      },
      __throwExcluded = function(dep, descr) {
        throw new Error("uRequire: combined template 'undefined', trying to access unbound / excluded `" + descr + "` dependency `" + dep + "` on browser");
      };
var bundleFactory = function(is) {
/**
 * @license almond 0.3.3 Copyright jQuery Foundation and other contributors.
 * Released under MIT license, http://github.com/requirejs/almond/LICENSE
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part, normalizedBaseParts,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name) {
            name = name.split('/');
            lastIndex = name.length - 1;

            // If wanting node ID compatibility, strip .js from end
            // of IDs. Have to do this here, and not in nameToUrl
            // because node allows either .js or non .js to map
            // to same file.
            if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
            }

            // Starts with a '.' so need the baseName
            if (name[0].charAt(0) === '.' && baseParts) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that 'directory' and not name of the baseName's
                //module. For instance, baseName of 'one/two/three', maps to
                //'one/two/three.js', but we want the directory, 'one/two' for
                //this normalization.
                normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                name = normalizedBaseParts.concat(name);
            }

            //start trimDots
            for (i = 0; i < name.length; i++) {
                part = name[i];
                if (part === '.') {
                    name.splice(i, 1);
                    i -= 1;
                } else if (part === '..') {
                    // If at the start, or previous value is still ..,
                    // keep them so that when converted to a path it may
                    // still work when converted to a path, even though
                    // as an ID it is less than ideal. In larger point
                    // releases, may be better to just kick out an error.
                    if (i === 0 || (i === 1 && name[2] === '..') || name[i - 1] === '..') {
                        continue;
                    } else if (i > 0) {
                        name.splice(i - 1, 2);
                        i -= 2;
                    }
                }
            }
            //end trimDots

            name = name.join('/');
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    //Creates a parts array for a relName where first part is plugin ID,
    //second part is resource ID. Assumes relName has already been normalized.
    function makeRelParts(relName) {
        return relName ? splitPrefix(relName) : [];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relParts) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0],
            relResourceName = relParts[1];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relResourceName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relResourceName));
            } else {
                name = normalize(name, relResourceName);
            }
        } else {
            name = normalize(name, relResourceName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i, relParts,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;
        relParts = makeRelParts(relName);

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relParts);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, makeRelParts(callback)).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {
        if (typeof name !== 'string') {
            throw new Error('See almond README: incorrect module build, no module name');
        }

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("almond", function(){});

define('is_js',[],function () {
  if (__isNode) {
  return __nodeRequire('is_js');
} else {
    return (typeof is !== 'undefined') ? is : __throwMissing('is_js', 'is')
}
});
define('MoodleVersion',['require', 'exports', 'module', 'is_js'], function (require, exports, module) {
  var __umodule__ = (function (require, exports, module) {
  

const is = require("is_js");
const BNUM_BDNUM_MAP = {
  "22": 20111205,
  "23": 20120625,
  "24": 20121203,
  "25": 20130514,
  "26": 20131118,
  "27": 20140512,
  "28": 20141110,
  "29": 20150511,
  "30": 20151116,
  "31": 20160523,
  "32": 20161205,
  "33": 20170515,
  "34": 20171113,
  "35": 20180517
};
const BDNUM_BNUM_MAP = {};
for (const bn of Object.keys(BNUM_BDNUM_MAP)) {
  BDNUM_BNUM_MAP[BNUM_BDNUM_MAP[bn]] = parseInt(bn);
}
const LTS_BNUMS = [
  27,
  31,
  35
];
const BNUM_LTS_LOOKUP = {};
for (const bnum of LTS_BNUMS) {
  BNUM_LTS_LOOKUP[bnum] = true;
}
function TO_STR(val) {
  return is.undefined(val) ? "??" : String(val);
}
module.exports = class MoodleVersion {
  constructor(versionInfo) {
    let newObj;
    if (is.not.undefined(versionInfo)) {
      if (is.string(versionInfo)) {
        newObj = MoodleVersion.fromString(versionInfo);
      } else if (is.object(versionInfo) && is.not.array(versionInfo) && is.not.function(versionInfo) && is.not.error(versionInfo)) {
        newObj = MoodleVersion.fromObject(versionInfo);
      } else {
        throw new TypeError("the MoodleVersion constructor only accepts strings and objects");
      }
    }
    this._branchNumber = undefined;
    if (newObj)
      this._branchNumber = newObj._branchNumber;
    this._branchingDateNumber = undefined;
    if (newObj)
      this._branchingDateNumber = newObj._branchingDateNumber;
    this._releaseNumber = undefined;
    if (newObj)
      this._releaseNumber = newObj._releaseNumber;
    this._releaseType = undefined;
    if (newObj)
      this._releaseType = newObj._releaseType;
    this._buildNumber = undefined;
    if (newObj)
      this._buildNumber = newObj._buildNumber;
  }
  static isDateNumber(val, strictTypeCheck) {
    if (is.not.number(val)) {
      if (strictTypeCheck)
        return false;
      if (is.not.string(val))
        return false;
    }
    return String(val).match(/^[12]\d{3}[01]\d[0123]\d$/) ? true : false;
  }
  static isBranch(val) {
    return is.string(val) && val.match(/^[1-9][.]\d$/) ? true : false;
  }
  static isBranchNumber(val, strictTypeCheck = false) {
    if (is.not.number(val)) {
      if (strictTypeCheck)
        return false;
      if (is.not.string(val))
        return false;
    }
    return String(val).match(/^[1-9]\d$/) ? true : false;
  }
  static isReleaseNumber(val, strictTypeCheck = false) {
    if (is.not.number(val)) {
      if (strictTypeCheck)
        return false;
      if (is.not.string(val))
        return false;
    }
    return val === "" || String(val).match(/^\d+$/) ? true : false;
  }
  static isReleaseType(val) {
    return val === "development" || val === "official" || val === "weekly" ? true : false;
  }
  static isReleaseSuffix(val) {
    return val === "dev" || val === "" || val === "+" ? true : false;
  }
  static branchFromBranchNumber(bn) {
    if (is.undefined(bn))
      return undefined;
    if (!MoodleVersion.isBranchNumber(bn, false))
      return undefined;
    return String(bn).split("").join(".");
  }
  static branchFromBranchingDateNumber(bdn) {
    if (is.undefined(bdn))
      return undefined;
    if (!MoodleVersion.isDateNumber(bdn, false))
      return undefined;
    let bn = BDNUM_BNUM_MAP[bdn];
    if (is.undefined(bn))
      return undefined;
    return MoodleVersion.branchFromBranchNumber(bn);
  }
  static branchNumberFromBranch(b) {
    if (is.undefined(b))
      return undefined;
    if (!MoodleVersion.isBranch(b))
      return undefined;
    return parseInt(b.split(/[.]/).join(""));
  }
  static branchNumberFromBranchingDateNumber(bdn) {
    if (is.undefined(bdn))
      return undefined;
    if (!MoodleVersion.isDateNumber(bdn, false))
      return undefined;
    return BDNUM_BNUM_MAP[bdn] ? BDNUM_BNUM_MAP[bdn] : undefined;
  }
  static branchingDateNumberFromBranch(b) {
    if (is.undefined(b))
      return undefined;
    const bn = MoodleVersion.branchNumberFromBranch(b);
    if (is.undefined(bn))
      return undefined;
    return BNUM_BDNUM_MAP[bn] ? BNUM_BDNUM_MAP[bn] : undefined;
  }
  static branchingDateNumberFromBranchNumber(bn) {
    if (is.undefined(bn))
      return undefined;
    return BNUM_BDNUM_MAP[bn] ? BNUM_BDNUM_MAP[bn] : undefined;
  }
  static dateFromDateNumber(dn) {
    if (!MoodleVersion.isDateNumber(dn))
      throw new TypeError("date number must of the form YYYYMMDD");
    const parts = String(dn).match(/^(\d{4})(\d{2})(\d{2})$/);
    return new Date(`${ parts[1] }-${ parts[2] }-${ parts[3] }T00:00:00.000Z`);
  }
  static dateNumberFromDate(d) {
    if (is.not.date(d))
      throw new TypeError("date object required");
    let m = d.getUTCMonth() + 1;
    let mm = `${ m < 10 ? "0" : "" }${ m }`;
    let day = d.getUTCDate();
    let dd = `${ day < 10 ? "0" : "" }${ day }`;
    return parseInt(`${ d.getUTCFullYear() }${ mm }${ dd }`);
  }
  static releaseSuffixFromReleaseType(rt) {
    if (is.not.string(rt))
      return undefined;
    switch (rt.toLowerCase()) {
    case "development":
      return "dev";
    case "official":
      return "";
    case "weekly":
      return "+";
    }
    return undefined;
  }
  static releaseTypeFromReleaseSuffix(rs) {
    if (is.not.string(rs))
      return undefined;
    switch (rs.toLowerCase()) {
    case "dev":
      return "development";
    case "":
      return "official";
    case "+":
      return "weekly";
    }
    return undefined;
  }
  static numberFromReleaseType(rt) {
    if (!MoodleVersion.isReleaseType(rt))
      return 0;
    switch (rt) {
    case "weekly":
      return 3;
    case "official":
      return 2;
    default:
      return 1;
    }
  }
  static compare(val1, val2) {
    if (!(val1 instanceof MoodleVersion && val2 instanceof MoodleVersion))
      return NaN;
    const b1 = is.number(val1.branchNumber) ? val1.branchNumber : 0;
    const b2 = is.number(val2.branchNumber) ? val2.branchNumber : 0;
    if (b1 < b2)
      return -1;
    if (b1 > b2)
      return 1;
    const r1 = is.number(val1.releaseNumber) ? val1.releaseNumber : 0;
    const r2 = is.number(val2.releaseNumber) ? val2.releaseNumber : 0;
    if (r1 < r2)
      return -1;
    if (r1 > r2)
      return 1;
    const t1 = MoodleVersion.numberFromReleaseType(val1.releaseType);
    const t2 = MoodleVersion.numberFromReleaseType(val2.releaseType);
    if (t1 < t2)
      return -1;
    if (t1 > t2)
      return 1;
    const bn1 = is.number(val1.buildNumber) ? val1.buildNumber : 0;
    const bn2 = is.number(val2.buildNumber) ? val2.buildNumber : 0;
    if (bn1 < bn2)
      return -1;
    if (bn1 > bn2)
      return 1;
    return 0;
  }
  static fromObject(obj) {
    if (is.not.object(obj))
      throw new TypeError("object required");
    const ans = new MoodleVersion();
    if (is.propertyDefined(obj, "branch") || is.propertyDefined(obj, "branchNumber")) {
      if (is.not.undefined(obj.branchNumber)) {
        if (!MoodleVersion.isBranchNumber(obj.branchNumber))
          throw new TypeError("invalid branch number");
        ans._branchNumber = parseInt(obj.branchNumber);
      } else if (is.not.undefined(obj.branch)) {
        if (!MoodleVersion.isBranch(obj.branch))
          throw new TypeError("invalid branch");
        ans._branchNumber = MoodleVersion.branchNumberFromBranch(obj.branch);
      }
    }
    if (is.propertyDefined(obj, "branchingDate") || is.propertyDefined(obj, "branchingDateNumber")) {
      if (is.not.undefined(obj.branchingDateNumber)) {
        if (!MoodleVersion.isDateNumber(obj.branchingDateNumber))
          throw new TypeError("invalid branching date number");
        ans._branchingDateNumber = parseInt(obj.branchingDateNumber);
      } else if (is.not.undefined(obj.branchingDate)) {
        if (is.not.date(obj.branchingDate))
          throw new TypeError("invalid branching date");
        ans._branchingDateNumber = MoodleVersion.dateNumberFromDate(obj.branchingDate);
      }
    }
    if (is.not.undefined(obj.releaseNumber)) {
      if (!MoodleVersion.isReleaseNumber(obj.releaseNumber))
        throw new TypeError("invalid release number");
      ans._releaseNumber = parseInt(obj.releaseNumber);
    }
    if (is.propertyDefined(obj, "releaseType") || is.propertyDefined(obj, "releaseSuffix")) {
      if (is.not.undefined(obj.releaseSuffix)) {
        if (!MoodleVersion.isReleaseSuffix(obj.releaseSuffix))
          throw new TypeError("invalid release suffix");
        ans._releaseType = MoodleVersion.releaseTypeFromReleaseSuffix(obj.releaseSuffix);
      } else if (is.not.undefined(obj.releaseType)) {
        if (!MoodleVersion.isReleaseType(obj.releaseType))
          throw new TypeError("invalid release type");
        ans._releaseType = obj.releaseType.toLowerCase();
      }
    }
    if (is.not.undefined(obj.buildNumber)) {
      if (!MoodleVersion.isDateNumber(obj.buildNumber))
        throw new TypeError("invalid build number");
      ans._buildNumber = parseInt(obj.buildNumber);
    }
    if (is.number(ans._branchNumber) && is.undefined(ans._branchingDateNumber) && is.number(BNUM_BDNUM_MAP[ans._branchNumber])) {
      ans._branchingDateNumber = BNUM_BDNUM_MAP[ans._branchNumber];
    }
    if (is.number(ans._branchingDateNumber) && is.undefined(ans._branchNumber) && is.number(BDNUM_BNUM_MAP[ans._branchingDateNumber])) {
      ans._branchNumber = BDNUM_BNUM_MAP[ans._branchingDateNumber];
    }
    return ans;
  }
  static get releaseRE() {
    return /(?:Moodle[ ]?)?(\d[.]\d)(?:[.](\d+))?(dev|[+])?[ ]?[(]Build[:][ ]?(\d{8})[)]/i;
  }
  static get versionRE() {
    return /(?:Moodle[ ]?)?(\b\d[.]\d)(?:[.](\d+))?(dev|[+])?/i;
  }
  static get versionNumberRE() {
    return /(\d{8})(\d{2})(?:[.](\d{2}))?/i;
  }
  static fromString(verStr) {
    if (is.not.string(verStr))
      throw new TypeError("version string required");
    const ans = new MoodleVersion();
    let matched = MoodleVersion.releaseRE.exec(verStr);
    if (matched) {
      ans.branch = matched[1];
      ans.releaseNumber = matched[2] ? matched[2] : 0;
      ans.releaseSuffix = matched[3] ? matched[3] : "";
      ans.buildNumber = matched[4];
      return ans;
    }
    matched = MoodleVersion.versionNumberRE.exec(verStr);
    if (matched) {
      ans.branchingDateNumber = matched[1];
      ans.releaseNumber = matched[2] ? parseInt(matched[2]) : 0;
      return ans;
    }
    matched = /((?:[0-9]|[?]{2})[.](?:[0-9]|[?]{2}))[.]((?:[0-9]+|[?]{2}))(dev|[+])?[ ][(]type[:][ ](development|official|weekly|[?]{2})[,][ ]branching[ ]date[:][ ](\d{8}|[?]{2})[ ][&][ ]build[:][ ](\d{8}|[?]{2})[)]/i.exec(verStr);
    if (matched) {
      const ansObj = {};
      if (matched[1] != "??.??")
        ansObj.branch = matched[1];
      if (matched[2] != "??")
        ansObj.releaseNumber = matched[2];
      if (matched[4] != "??")
        ansObj.releaseType = matched[4];
      if (matched[5] != "??")
        ansObj.branchingDateNumber = matched[5];
      if (matched[6] != "??")
        ansObj.buildNumber = matched[6];
      return MoodleVersion.fromObject(ansObj);
    }
    matched = MoodleVersion.versionRE.exec(verStr);
    if (matched) {
      ans.branch = matched[1];
      ans.releaseNumber = matched[2] ? matched[2] : 0;
      ans.releaseSuffix = matched[3] ? matched[3] : "";
      return ans;
    }
    throw new RangeError(`failed to extract Moodle version from string: ${ verStr }`);
  }
  get branchNumber() {
    return this._branchNumber;
  }
  set branchNumber(bn) {
    if (is.undefined(bn)) {
      this._branchNumber = undefined;
      this._branchingDateNumber = undefined;
      return;
    }
    if (!MoodleVersion.isBranchNumber(bn, false)) {
      throw new TypeError("Branch Numbers must be integers between 10 and 99");
    }
    let bdn = MoodleVersion.branchingDateNumberFromBranchNumber(bn);
    if (is.undefined(bdn)) {
      throw new RangeError(`the branch number ${ bn } does not have a known mapping to a branching date`);
    }
    this._branchNumber = parseInt(bn);
    this._branchingDateNumber = bdn;
  }
  get branch() {
    if (is.undefined(this._branchNumber))
      return undefined;
    return MoodleVersion.branchFromBranchNumber(this._branchNumber);
  }
  set branch(b) {
    if (is.undefined(b)) {
      this._branchNumber = undefined;
      this._branchingDateNumber = undefined;
      return;
    }
    let bn = MoodleVersion.branchNumberFromBranch(b);
    if (is.not.number(bn)) {
      throw new TypeError(`branches must be strings consisting of a digit, a period, and another digit. Got: ${ b }`);
    }
    let bdn = MoodleVersion.branchingDateNumberFromBranchNumber(bn);
    if (is.undefined(bdn)) {
      throw new RangeError(`the branch ${ b } does not have a known mapping to a branching date`);
    }
    this._branchNumber = bn;
    this._branchingDateNumber = bdn;
  }
  get branchingDate() {
    if (is.undefined(this._branchingDateNumber))
      return undefined;
    return MoodleVersion.dateFromDateNumber(this._branchingDateNumber);
  }
  set branchingDate(bd) {
    if (is.undefined(bd)) {
      this._branchNumber = undefined;
      this._branchingDateNumber = undefined;
      return;
    }
    if (is.not.date(bd))
      throw new TypeError("the branching date must be a Date object");
    let bdn = MoodleVersion.dateNumberFromDate(bd);
    let bn = MoodleVersion.branchNumberFromBranchingDateNumber(bdn);
    if (is.undefined(bn)) {
      throw new RangeError(`the branching date ${ bd.toISOString() } does not have a known mapping to a Moodle branch`);
    }
    this._branchNumber = bn;
    this._branchingDateNumber = bdn;
  }
  get branchingDateNumber() {
    return this._branchingDateNumber;
  }
  set branchingDateNumber(bdn) {
    if (is.undefined(bdn)) {
      this._branchNumber = undefined;
      this._branchingDateNumber = undefined;
      return;
    }
    if (!MoodleVersion.isDateNumber(bdn))
      throw new TypeError("the branching date number must be of the form YYYYMMDD");
    bdn = parseInt(bdn);
    let bn = MoodleVersion.branchNumberFromBranchingDateNumber(bdn);
    if (is.undefined(bn)) {
      throw new RangeError(`the branching date number ${ bdn } does not have a known mapping to a Moodle branch`);
    }
    this._branchNumber = bn;
    this._branchingDateNumber = bdn;
  }
  get branchingDateNumbersByBranch() {
    const ans = {};
    for (const bn of Object.keys(BNUM_BDNUM_MAP)) {
      ans[MoodleVersion.branchFromBranchNumber(bn)] = BNUM_BDNUM_MAP[bn];
    }
    return ans;
  }
  get branchingDateNumbersByBranchNumber() {
    const ans = {};
    for (const bn of Object.keys(BNUM_BDNUM_MAP)) {
      ans[bn] = BNUM_BDNUM_MAP[bn];
    }
    return ans;
  }
  get branchesByBranchingDateNumber() {
    const ans = {};
    for (const bdn of Object.keys(BDNUM_BNUM_MAP)) {
      ans[bdn] = MoodleVersion.branchFromBranchNumber(BDNUM_BNUM_MAP[bdn]);
    }
    return ans;
  }
  get brancheNumbersByBranchingDateNumber() {
    const ans = {};
    for (const bdn of Object.keys(BDNUM_BNUM_MAP)) {
      ans[bdn] = BDNUM_BNUM_MAP[bdn];
    }
    return ans;
  }
  get releaseNumber() {
    return this._releaseNumber;
  }
  set releaseNumber(rn) {
    if (is.undefined(rn)) {
      this._releaseNumber = undefined;
      return;
    }
    if (!MoodleVersion.isReleaseNumber(rn, false)) {
      throw new TypeError("Release Numbers must be integers greater than or equal to zero");
    }
    this._releaseNumber = rn === "" ? 0 : parseInt(rn);
  }
  get releaseType() {
    return this._releaseType;
  }
  set releaseType(rt) {
    const errMsg = "release type must be one of 'development', 'official', or 'weekly'";
    if (is.not.string(rt))
      throw new TypeError(errMsg);
    rt = rt.toLowerCase();
    if (!MoodleVersion.isReleaseType(rt))
      throw new TypeError(errMsg);
    this._releaseType = rt;
  }
  get releaseSuffix() {
    return MoodleVersion.releaseSuffixFromReleaseType(this._releaseType);
  }
  set releaseSuffix(rs) {
    const errMsg = "release suffix must be one of 'dev', '', or '+'";
    if (is.not.string(rs))
      throw new TypeError(errMsg);
    rs = rs.toLowerCase();
    if (!MoodleVersion.isReleaseSuffix(rs))
      throw new TypeError(errMsg);
    this._releaseType = MoodleVersion.releaseTypeFromReleaseSuffix(rs);
  }
  get buildNumber() {
    return this._buildNumber;
  }
  set buildNumber(bn) {
    if (is.undefined(bn)) {
      this._buildNumber = undefined;
      return;
    }
    if (!MoodleVersion.isDateNumber(bn))
      throw new TypeError("build number must be of the form YYYYMMDD");
    this._buildNumber = parseInt(bn);
  }
  get version() {
    let ans = is.undefined(this.branch) ? "??.??" : this.branch;
    if (this.releaseNumber !== 0)
      ans += `.${ TO_STR(this.releaseNumber) }`;
    if (is.string(this.releaseSuffix))
      ans += this.releaseSuffix;
    return ans;
  }
  get versionNumber() {
    let ans = is.undefined(this.branchingDateNumber) ? "????????" : TO_STR(this.branchingDateNumber);
    ans += `${ this.releaseNumber < 10 ? "0" : "" }${ TO_STR(this.releaseNumber) }`;
    return ans;
  }
  get release() {
    return `${ this.version } (Build: ${ is.undefined(this.buildNumber) ? "????????" : this.buildNumber })`;
  }
  clone() {
    return MoodleVersion.fromObject({
      branchNumber: this._branchNumber,
      branchingDateNumber: this._branchingDateNumber,
      releaseNumber: this._releaseNumber,
      releaseType: this._releaseType,
      buildNumber: this._buildNumber
    });
  }
  toString() {
    let ans = `${ is.undefined(this.branch) ? "??.??" : this.branch }.${ TO_STR(this.releaseNumber) }`;
    if (is.string(this.releaseSuffix))
      ans += this.releaseSuffix;
    ans += ` (type: ${ TO_STR(this.releaseType) }, branching date: ${ TO_STR(this.branchingDateNumber) } & build: ${ TO_STR(this.buildNumber) })`;
    return ans;
  }
  toObject() {
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
  equals(val) {
    return MoodleVersion.compare(this, val) === 0 ? true : false;
  }
  compareTo(mv) {
    return MoodleVersion.compare(mv, this);
  }
  sameBranch(mv) {
    if (!(mv instanceof MoodleVersion))
      return undefined;
    if (is.all.undefined(this.branch, mv.branch))
      return undefined;
    return this.branch === mv.branch;
  }
  lessThan(mv) {
    const cmp = MoodleVersion.compare(this, mv);
    if (is.nan(cmp))
      return undefined;
    return cmp === -1 ? true : false;
  }
  greaterThan(mv) {
    const cmp = MoodleVersion.compare(this, mv);
    if (is.nan(cmp))
      return undefined;
    return cmp === 1 ? true : false;
  }
  isStable() {
    if (is.undefined(this.releaseType))
      return undefined;
    return this.releaseType === "official" || this.releaseType === "weekly" ? true : false;
  }
  isKnownBranch() {
    return is.not.undefined(BNUM_BDNUM_MAP[this.branchNumber]);
  }
  isLTS() {
    if (is.undefined(this.branchNumber))
      return undefined;
    if (!this.isKnownBranch())
      return undefined;
    return is.not.undefined(BNUM_LTS_LOOKUP[this.branchNumber]);
  }
};

return module.exports;

}).call(this, require, exports, module);
var __old__moodle_version0 = window['MoodleVersion'];
if (!__isAMD && !__isNode) {window['MoodleVersion'] = __umodule__;

__umodule__.noConflict = function () {
  window['MoodleVersion'] = __old__moodle_version0;
return __umodule__;
};
}return __umodule__;
});
    return require('MoodleVersion');

};
if (__isAMD) {
  return define(['is_js'], bundleFactory);
} else {
    if (__isNode) {
        return module.exports = bundleFactory(require('is_js'));
    } else {
        return bundleFactory((typeof is !== 'undefined') ? is : __throwMissing('is_js', 'is'));
    }
}
}).call(this, (typeof exports === 'object' || typeof window === 'undefined' ? global : window),
              (typeof exports === 'object' || typeof window === 'undefined' ? global : window))
