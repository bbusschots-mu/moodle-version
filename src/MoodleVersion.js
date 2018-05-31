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
 * @type {Object}
 * @protected
 */
const BNUM_BDNUM_MAP = {
    '22': '20111205',
    '23': '20120625',
    '24': '20121203',
    '25': '20130514',
    '26': '20131118',
    '27': '20140512',
    '28': '20141110',
    '29': '20150511',
    '30': '20151116',
    '31': '20160523',
    '32': '20161205',
    '33': '20170515',
    '34': '20171113',
    '35': '20180517'
};

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
         * @type {number}
         */
        this._branchNumber = undefined;
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
        let bnStr = String(bn);
        if(!bnStr.match(/^[1-9]\d$/)) return undefined;
        return bnStr.split('').join('.');
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
        if(!(is.string(b) && b.match(/^[1-9][.]\d$/))) return undefined;
        return parseInt(b.split(/[.]/).join());
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
        if(is.undefined(bn)){
            this._branchNumber = undefined;
        }else if(!String(bn).match(/^[1-9]\d$/)){
            throw new TypeError('Branch Numbers must be integers between 10 and 99');
        }else{
            this._branchNumber = parseInt(bn);
        }        
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
        if(is.undefined(b)){
            this._branchNumber = undefined;
        }else if(!String(b).match(/^\d[.]\d$/)){
            throw new TypeError('Branches must be strings consisting of a digit, a period, and another digit');
        }else{
            this._branchNumber = parseInt(String(bn).split('.').join());
        }
    }
    
    /**
     * toString() description.
     */
    toString(){
        return 'Some Moodle Version';
    }
};