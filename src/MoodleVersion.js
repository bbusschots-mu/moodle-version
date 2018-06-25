const is = require('is_js');

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
    '35': 20180517
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
module.exports = class MoodleVersion {
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
            }else{
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
        return cmp === 1 ? true : false;
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
        return cmp === -1 ? true : false;
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
};