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
 * A Moodle release string. These are the most detailed version numbers
 * displayed to users, consisting of the version string and a build number.
 *
 * The release string for Moodle 3.3.6 is `3.3.6 (Build: 20180517)`.
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
     * Constructor description.
     */
    constructor() {
        /**
         * @type {BranchNumber}
         */
        this._branchNumber = undefined;
        
        /**
         * @type {ReleaseNumber}
         */
        this._releaseNumber = undefined;
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
    static branchFromBranchingDate(bdn){
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
    static branchNumberFromBranchingDate(bdn){
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
    static branchingDateFromBranch(b){ // LEFT OFF HERE - NEEDS TESTING
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
    static branchingDateFromBranchNumber(bn){ // TO DO - NEEDS TESTING
        if(is.undefined(bn)) return undefined;
        return BNUM_BDNUM_MAP[bn] ? BNUM_BDNUM_MAP[bn] : undefined;
    }
    
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
     * @type {BranchNumber|undefined}
     * @throws {TypeError}
     */
    set branchNumber(bn){
        // short-circuit requests to set undefined
        if(is.undefined(bn)){
            this._branchNumber = undefined;
            return;
        }
        
        // check the validity of the branch number
        if(!MoodleVersion.isBranchNumber(bn, false)){
            throw new TypeError('Branch Numbers must be integers between 10 and 99');
        }
        
        // set the branch number
        this._branchNumber = parseInt(bn);
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
     * @type {BranchString}
     * @throws {TypeError}
     */
    set branch(b){
        // short-circuit requests to set undefined
        if(is.undefined(b)){
            this._branchNumber = undefined;
            return;
        }
        
        // try convery the branch to a branch number
        let bn = MoodleVersion.branchNumberFromBranch(b);
        if(is.not.number(bn)){
            throw new TypeError('Branches must be strings consisting of a digit, a period, and another digit');
        }
        
        // store the branch number
        this._branchNumber = bn;
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
     * toString() description.
     */
    toString(){
        return `${this.branch}.${this.releaseNumber}`;
    }
};