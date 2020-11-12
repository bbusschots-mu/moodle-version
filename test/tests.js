// NOTE:
// =====
// This test suite assumes that the module @maynoothuniversity/mu-qunit-util is
// available as a global variable named util.

//
//=== The Tests ================================================================
//

QUnit.module('Static Validation Functions', {}, function(){
    QUnit.test('isDateNumber()', function(a){
        const mustAlwaysReturnFalse = [
            ...util.dummyDataExcept([], ['integer']),
            util.dummyData('number.integer.negative'),
            util.dummyData('string.integer.negative')
            
        ];
        a.expect((mustAlwaysReturnFalse.length * 2) + 5);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleVersion.isDateNumber), 'function exists');
        
        // make sure values that should always return false do so in both modes
        for(const dd of mustAlwaysReturnFalse){
            a.strictEqual(MoodleVersion.isDateNumber(dd.value, false), false, `${dd.description} returns false without strict type checking`);
            a.strictEqual(MoodleVersion.isDateNumber(dd.value, true), false, `${dd.description} returns false with strict type checking`);
        }
        
        // make sure values that are always correct return true in both modes
        a.strictEqual(MoodleVersion.isDateNumber(20180517, false), true, '20180517 returns true without strict type checking');
        a.strictEqual(MoodleVersion.isDateNumber(20180517, true), true, '20180517 returns true with strict type checking');
        
        // make sure valid strings are only accepted when strict mode is disabled
        a.strictEqual(MoodleVersion.isReleaseNumber('20180517', false), true, "'20180517' returns true without strict type checking");
        a.strictEqual(MoodleVersion.isReleaseNumber('20180517', true), false, "'20180517' returns false with strict type checking");
    });
    
    QUnit.test('isBranch()', function(a){
        const mustReturnFalse = [
            ...util.dummyDataExcept(['string'], []),
            util.dummyData('string.word'),
            util.dummyData('string.multiline'),
        ];
        a.expect(mustReturnFalse.length + 4);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleVersion.isBranch), 'function exists');
        
        // make sure values that should return false do
        for(const dd of mustReturnFalse){
            a.strictEqual(MoodleVersion.isBranch(dd.value), false, `${dd.description} returns false`);
        }
        
        // make sure subtly incorrect values return false
        a.strictEqual(MoodleVersion.isBranch('0.1'), false, "'0.1' returns false");
        
        // make sure valid values return true
        a.strictEqual(MoodleVersion.isBranch('3.5'), true, "'3.5' returns true");
        a.strictEqual(MoodleVersion.isBranch('3.10'), true, "'3.10' returns true");
    });
    
    QUnit.test('isBranchNumber()', function(a){
        const mustAlwaysReturnFalse = [
            ...util.dummyDataExcept([], ['2digit', '3digit'])
        ];
        a.expect((mustAlwaysReturnFalse.length * 2) + 9);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleVersion.isBranchNumber), 'function exists');
        
        // make sure values that should always return false do so in both modes
        for(const dd of mustAlwaysReturnFalse){
            a.strictEqual(MoodleVersion.isBranchNumber(dd.value, false), false, `${dd.description} returns false without strict type checking`);
            a.strictEqual(MoodleVersion.isBranchNumber(dd.value, true), false, `${dd.description} returns false with strict type checking`);
        }
        
        // make sure values that are always correct return true in both modes
        a.strictEqual(MoodleVersion.isBranchNumber(35, false), true, '35 returns true without strict type checking');
        a.strictEqual(MoodleVersion.isBranchNumber(35, true), true, '35 returns true with strict type checking');
        a.strictEqual(MoodleVersion.isBranchNumber(310, false), true, '310 returns true without strict type checking');
        a.strictEqual(MoodleVersion.isBranchNumber(310, true), true, '310 returns true with strict type checking');
        
        // make sure valid strings are only accepted when strict mode is disabled
        a.strictEqual(MoodleVersion.isBranchNumber('35', false), true, "'35' returns true without strict type checking");
        a.strictEqual(MoodleVersion.isBranchNumber('35', true), false, "'35' returns false with strict type checking");
        a.strictEqual(MoodleVersion.isBranchNumber('310', false), true, "'310' returns true without strict type checking");
        a.strictEqual(MoodleVersion.isBranchNumber('310', true), false, "'310' returns false with strict type checking");
    });
    
    QUnit.test('isReleaseNumber()', function(a){
        const mustAlwaysReturnFalse = [
            ...util.dummyDataExcept([], ['integer'], ['string.empty']),
            util.dummyData('number.integer.negative'),
            util.dummyData('string.integer.negative')
            
        ];
        a.expect((mustAlwaysReturnFalse.length * 2) + 11);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleVersion.isReleaseNumber), 'function exists');
        
        // make sure values that should always return false do so in both modes
        for(const dd of mustAlwaysReturnFalse){
            a.strictEqual(MoodleVersion.isReleaseNumber(dd.value, false), false, `${dd.description} returns false without strict type checking`);
            a.strictEqual(MoodleVersion.isReleaseNumber(dd.value, true), false, `${dd.description} returns false with strict type checking`);
        }
        
        // make sure values that are always correct return true in both modes
        a.strictEqual(MoodleVersion.isReleaseNumber(0, false), true, '0 returns true without strict type checking');
        a.strictEqual(MoodleVersion.isReleaseNumber(0, true), true, '0 returns true with strict type checking');
        a.strictEqual(MoodleVersion.isReleaseNumber(3, false), true, '3 returns true without strict type checking');
        a.strictEqual(MoodleVersion.isReleaseNumber(3, true), true, '3 returns true with strict type checking');
        a.strictEqual(MoodleVersion.isReleaseNumber(33, false), true, '33 returns true without strict type checking');
        a.strictEqual(MoodleVersion.isReleaseNumber(33, true), true, '33 returns true with strict type checking');
        
        // make sure valid strings are only accepted when strict mode is disabled
        a.strictEqual(MoodleVersion.isReleaseNumber('3', false), true, "'3' returns true without strict type checking");
        a.strictEqual(MoodleVersion.isReleaseNumber('3', true), false, "'3' returns false with strict type checking");
        
        // make sure both the digit zero and the empty string are accepted when strict mode is disabled
        a.strictEqual(MoodleVersion.isReleaseNumber('0', false), true, "'0' returns true without strict type checking");
        a.strictEqual(MoodleVersion.isReleaseNumber('', false), true, "the empty string returns true without strict type checking");
    });
    
    QUnit.test('isReleaseType()', function(a){
        const mustReturnFalse = [
            ...util.dummyBasicData()
        ];
        
        a.expect(mustReturnFalse.length + 4);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleVersion.isReleaseType), 'function exists');
        
        // make sure values that should return false do
        for(const dd of mustReturnFalse){
            a.strictEqual(MoodleVersion.isReleaseType(dd.value), false, `${dd.description} returns false`);
        }
        
        // make sure all three valid values return true
        a.strictEqual(MoodleVersion.isReleaseType('development'), true, "'development' returns true");
        a.strictEqual(MoodleVersion.isReleaseType('official'), true, "'official' returns true");
        a.strictEqual(MoodleVersion.isReleaseType('weekly'), true, "'weekly' returns true");
    });
    
    QUnit.test('isReleaseSuffix()', function(a){
        const mustReturnFalse = [
            ...util.dummyBasicData()
        ];
        
        a.expect(mustReturnFalse.length + 4);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleVersion.isReleaseSuffix), 'function exists');
        
        // make sure values that should return false do
        for(const dd of mustReturnFalse){
            a.strictEqual(MoodleVersion.isReleaseSuffix(dd.value), false, `${dd.description} returns false`);
        }
        
        // make sure all three valid values return true
        a.strictEqual(MoodleVersion.isReleaseSuffix('dev'), true, "'dev' returns true");
        a.strictEqual(MoodleVersion.isReleaseSuffix(''), true, 'an empty string returns true');
        a.strictEqual(MoodleVersion.isReleaseSuffix('+'), true, "'+' returns true");
    });
});

QUnit.module('Static Conversion Functions', {}, function(){    
    QUnit.test('branchFromBranchNumber()', function(a){
        const mustReturnUndefined = [
            ...util.dummyDataExcept([], ['2digit', '3digit'])
        ];
        a.expect(mustReturnUndefined.length + 5);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleVersion.branchFromBranchNumber), 'function exists');
        
        // make sure the data that should return undefined does
        for(const dd of mustReturnUndefined){
            a.ok(is.undefined(MoodleVersion.branchFromBranchNumber(dd.value)), `${dd.description} returns undefined`);
        }
        
        // make sure valid data returns as expected
        a.strictEqual(MoodleVersion.branchFromBranchNumber(35), '3.5', "35 converts to '3.5'");
        a.strictEqual(MoodleVersion.branchFromBranchNumber('35'), '3.5', "'35' converts to '3.5'");
        a.strictEqual(MoodleVersion.branchFromBranchNumber(310), '3.10', "310 converts to '3.10'");
        a.strictEqual(MoodleVersion.branchFromBranchNumber('310'), '3.10', "'310' converts to '3.10'");
    });

    // LEFT OFF HERE!!!
    
    QUnit.test('branchFromBranchingDateNumber()', function(a){
        const mustReturnUndefined = [
            ...util.dummyBasicDataExcept('number')
        ];
        a.expect(mustReturnUndefined.length + 5);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleVersion.branchFromBranchingDateNumber), 'function exists');
        
        // make sure the data that should return undefined does
        for(const dd of mustReturnUndefined){
            a.ok(is.undefined(MoodleVersion.branchFromBranchingDateNumber(dd.value)), `${dd.description} returns undefined`);
        }
        
        // make sure valid data returns as expected
        a.strictEqual(MoodleVersion.branchFromBranchingDateNumber(20180517), '3.5', "20180517 converts to '3.5'");
        a.strictEqual(MoodleVersion.branchFromBranchingDateNumber('20180517'), '3.5', "'20180517' converts to '3.5'");
        a.ok(is.undefined(MoodleVersion.branchFromBranchingDateNumber(20180513)), '20180513 converts to undefined (no such mapping)');
        a.ok(is.undefined(MoodleVersion.branchFromBranchingDateNumber('20180513')),"'20180513' converts to undefined (no such mapping)");
    });
    
    QUnit.test('branchNumberFromBranch()', function(a){
        const mustReturnUndefined = [
            ...util.dummyDataExcept(['string'], []),
            ...util.dummyData('string', {excludeTags: ['float']}),
            util.dummyData('string.float.negative')
        ];
        a.expect(mustReturnUndefined.length + 2);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleVersion.branchNumberFromBranch), 'function exists');
        
        // make sure the data that should return undefined does
        for(const dd of mustReturnUndefined){
            a.ok(is.undefined(MoodleVersion.branchNumberFromBranch(dd.value)), `${dd.description} returns undefined`);
        }
        
        // make sure that values are converted as expected
        a.strictEqual(MoodleVersion.branchNumberFromBranch('3.5'), 35, "'3.5' converts to 35");
    });
    
    QUnit.test('branchNumberFromBranchingDateNumber()', function(a){
        const mustReturnUndefined = [
            ...util.dummyBasicDataExcept('number')
        ];
        a.expect(mustReturnUndefined.length + 5);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleVersion.branchNumberFromBranchingDateNumber), 'function exists');
        
        // make sure the data that should return undefined does
        for(const dd of mustReturnUndefined){
            a.ok(is.undefined(MoodleVersion.branchNumberFromBranchingDateNumber(dd.value)), `${dd.description} returns undefined`);
        }
        
        // make sure valid data returns as expected
        a.strictEqual(MoodleVersion.branchNumberFromBranchingDateNumber(20180517), 35, '20180517 converts to 35');
        a.strictEqual(MoodleVersion.branchNumberFromBranchingDateNumber('20180517'), 35, "'20180517' converts to 35");
        a.ok(is.undefined(MoodleVersion.branchNumberFromBranchingDateNumber(20180513)), '20180513 converts to undefined (no such mapping)');
        a.ok(is.undefined(MoodleVersion.branchNumberFromBranchingDateNumber('20180513')),"'20180513' converts to undefined (no such mapping)");
    });
    
    QUnit.test('branchingDateNumberFromBranch()', function(a){
        const mustReturnUndefined = [
            ...util.dummyBasicDataExcept('string')
        ];
        a.expect(mustReturnUndefined.length + 3);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleVersion.branchingDateNumberFromBranch), 'function exists');
        
        // make sure the data that should return undefined does
        for(const dd of mustReturnUndefined){
            a.ok(is.undefined(MoodleVersion.branchingDateNumberFromBranch(dd.value)), `${dd.description} returns undefined`);
        }
        
        // make sure valid data returns as expected
        a.strictEqual(MoodleVersion.branchingDateNumberFromBranch('3.5'), 20180517, "'3.5' converts to 20180517");
        a.ok(is.undefined(MoodleVersion.branchingDateNumberFromBranch('9.9')), "'9.9' converts to undefined (no such mapping)");
    });
    
    QUnit.test('branchingDateNumberFromBranchNumber()', function(a){
        const mustReturnUndefined = [
            ...util.dummyBasicDataExcept('number')
        ];
        a.expect(mustReturnUndefined.length + 5);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleVersion.branchingDateNumberFromBranchNumber), 'function exists');
        
        // make sure the data that should return undefined does
        for(const dd of mustReturnUndefined){
            a.ok(is.undefined(MoodleVersion.branchingDateNumberFromBranchNumber(dd.value)), `${dd.description} returns undefined`);
        }
        
        // make sure valid data returns as expected
        a.strictEqual(MoodleVersion.branchingDateNumberFromBranchNumber(35), 20180517, '35 converts to 20180517');
        a.strictEqual(MoodleVersion.branchingDateNumberFromBranchNumber('35'), 20180517, "'35' converts to 20180517");
        a.ok(is.undefined(MoodleVersion.branchingDateNumberFromBranchNumber(99)), '99 converts to undefined (no such mapping)');
        a.ok(is.undefined(MoodleVersion.branchingDateNumberFromBranchNumber('99')),"'99' converts to undefined (no such mapping)");
    });
    
    QUnit.test('dateFromDateNumber()', function(a){
        const mustThrow = [
            ...util.dummyDataExcept(['number'], ['integer']),
            util.dummyData('number.integer.4digit'),
            util.dummyData('string.integer.4digit')
        ];
        a.expect(mustThrow.length + 3);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleVersion.dateFromDateNumber), 'function exists');
        
        // make sure all values that should throw an error do
        for(const dd of mustThrow){
            a.throws(
                ()=>{ MoodleVersion.dateFromDateNumber(dd.value); },
                TypeError,
                `${dd.description} throws a type error`
            );
        }
        
        // make sure valid values are converted as expected
        let d = new Date('2018-05-01T00:00:00.000Z');
        a.strictEqual(MoodleVersion.dateFromDateNumber(20180501).toISOString(), d.toISOString(), '20180501 converts correctly');
        d = new Date('2018-12-25T00:00:00.000Z');
        a.strictEqual(MoodleVersion.dateFromDateNumber(20181225).toISOString(), d.toISOString(), '20181225 converts correctly');
    });
    
    QUnit.test('dateNumberFromDate()', function(a){
        const mustThrow = [
            ...util.dummyDataExcept(['object'], [], []),
            ...util.dummyData('object', {excludeTags: ['datetime']})
        ];
        a.expect(mustThrow.length + 3);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleVersion.dateNumberFromDate), 'function exists');
        
        // make sure all values that should throw an error do
        for(const dd of mustThrow){
            a.throws(
                ()=>{ MoodleVersion.dateNumberFromDate(dd.value); },
                TypeError,
                `${dd.description} throws a type error`
            );
        }
        
        // make sure valid values are converted as expected
        a.strictEqual(MoodleVersion.dateNumberFromDate(new Date('2018-05-01T00:00:00.000Z')), 20180501, '2018-05-01T00:00:00.000Z converts to 20180501');
        a.strictEqual(MoodleVersion.dateNumberFromDate(new Date('2018-12-25T00:00:00.000Z')), 20181225, '2018-12-25T00:00:00.000Z converts to 20181225');
    });
    
    QUnit.test('releaseSuffixFromReleaseType()', function(a){
        const mustReturnUndefined = [
            ...util.dummyBasicData()
        ];
        a.expect(mustReturnUndefined.length + 7);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleVersion.releaseSuffixFromReleaseType), 'function exists');
        
        // make sure that values that should return undefined do
        for(const dd of mustReturnUndefined){
            a.ok(is.undefined(MoodleVersion.releaseSuffixFromReleaseType(dd.value)), `${dd.description} returns undefined`);
        }
        
        // make sure the three valid values convert correctly, regardless of case
        a.strictEqual(MoodleVersion.releaseSuffixFromReleaseType('development'), 'dev', "'development' converts to 'dev'");
        a.strictEqual(MoodleVersion.releaseSuffixFromReleaseType('DEVELOPMENT'), 'dev', "'DEVELOPMENT' converts to 'dev'");
        a.strictEqual(MoodleVersion.releaseSuffixFromReleaseType('official'), '', "'official' converts to ''");
        a.strictEqual(MoodleVersion.releaseSuffixFromReleaseType('OFFICIAL'), '', "'OFFICIAL' converts to ''");
        a.strictEqual(MoodleVersion.releaseSuffixFromReleaseType('weekly'), '+', "'weekly' converts to '+'");
        a.strictEqual(MoodleVersion.releaseSuffixFromReleaseType('WEEKLY'), '+', "'WEEKLY' converts to '+'");
    });
    
    QUnit.test('releaseTypeFromReleaseSuffix()', function(a){
        const mustReturnUndefined = [
            ...util.dummyBasicData()
        ];
        a.expect(mustReturnUndefined.length + 5);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleVersion.releaseTypeFromReleaseSuffix), 'function exists');
        
        // make sure that values that should return undefined do
        for(const dd of mustReturnUndefined){
            a.ok(is.undefined(MoodleVersion.releaseTypeFromReleaseSuffix(dd.value)), `${dd.description} returns undefined`);
        }
        
        // make sure the three valid values convert correctly, regardless of case
        a.strictEqual(MoodleVersion.releaseTypeFromReleaseSuffix('dev'), 'development', "'dev' converts to 'development'");
        a.strictEqual(MoodleVersion.releaseTypeFromReleaseSuffix('DEV'), 'development', "'DEV' converts to 'development'");
        a.strictEqual(MoodleVersion.releaseTypeFromReleaseSuffix(''), 'official', "'' converts to 'official'");
        a.strictEqual(MoodleVersion.releaseTypeFromReleaseSuffix('+'), 'weekly', "'+' converts to 'weekly'");
    });
    
    QUnit.test('numberFromReleaseType()', function(a){
        const mustReturnZero = [
            ...util.dummyBasicData('other')
        ];
        a.expect(mustReturnZero.length + 4);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleVersion.numberFromReleaseType), 'function exists');
        
        // make sure that values that should return undefined do
        for(const dd of mustReturnZero){
            a.strictEqual(MoodleVersion.numberFromReleaseType(dd.value), 0, `${dd.description} returns 0`);
        }
        
        // make sure the three valid values convert correctly
        a.strictEqual(MoodleVersion.numberFromReleaseType('development'), 1, "'development' converts to 1");
        a.strictEqual(MoodleVersion.numberFromReleaseType('official'), 2, "'official' converts to 2");
        a.strictEqual(MoodleVersion.numberFromReleaseType('weekly'), 3, "'weekly' converts to 3");
    });
});

QUnit.module('constructor', function(){
    QUnit.test('class exists', function(a){
        a.expect(1);
        a.ok(is.function(MoodleVersion));
    });
    
    QUnit.test('default constructor', function(a){
        a.expect(1);
        a.strictEqual((new MoodleVersion()).toString(), '??.??.?? (type: ??, branching date: ?? & build: ??)');
    });
    
    QUnit.test('argument processing', function(a){
        const mustThrow = [
            ...util.dummyBasicDataExcept('string', 'object', 'other')
        ];
        a.expect(mustThrow.length + 2);
        
        // make sure that types that should throw an error do
        for(const dd of mustThrow){
            a.throws(
                ()=>{ new MoodleVersion(dd.value); },
                TypeError,
                `${dd.description} throws Type Error`
            );
        }
        
        // make sure that strings are parsed
        a.strictEqual((new MoodleVersion('3.5+')).version, '3.5+', 'can initialise from string');
        
        // make sure objects are parsed
        a.strictEqual((new MoodleVersion({branch: '3.3', releaseNumber: 6, releaseType: 'official'})).version, '3.3.6', 'can initialise from object');
    });
});

QUnit.module('Getters & Setters', function(){
    QUnit.test('.branch & .branchNumber', function(a){
        // data that must throw errors
        const mustThrowBranchNumber = [
            ...util.dummyDataExcept([], ['integer'], ['other.undefined']),
            ...util.dummyDataWithAllTags('integer', 'negative'),
            ...util.dummyDataWithAnyTag('digit'),
            ...util.dummyDataWithAnyTag('4digit')
        ];
        const mustThrowBranch = [
            ...util.dummyDataExcept([], ['float'], ['other.undefined']),
            ...util.dummyDataWithAllTags('float', 'negative'),
        ];
        
        // matching lists of valid data
        const vbn  = [ 30,       33];       // valid branch numbers as numbers
        const vbns = ['30',     '33'];      // valid branch numbes as strings
        const vb   = ['3.0',    '3.3'];     // valid branches as strings
        const vbf  = [ 3.0,      3.3];      // valid branches as floating point numbers
        
        // set the number of expected tests
        a.expect(mustThrowBranchNumber.length + mustThrowBranch.length + (vbn.length * 6) + 7);
        
        // make sure the setters throws errors when needed
        for(const dd of mustThrowBranchNumber){
            a.throws(
                ()=>{
                    const v = new MoodleVersion();
                    v.branchNumber = dd.value;
                },
                TypeError,
                `.branchNumber throws error when attempting to set to ${dd.description}`
            );
        }
        for(const dd of mustThrowBranch){
            a.throws(
                ()=>{
                    const v = new MoodleVersion();
                    v.branch = dd.value;
                },
                TypeError,
                `.branch throws error when attempting to set to ${dd.description}`
            );
        }
        
        // make sure setting a branch number to a valid value does not throw an error and that the value gets correctly set
        for(let i = 0; i < vbn.length; i++){
            let v = new MoodleVersion();
            v.branchNumber = vbn[i];
            a.strictEqual(v.branchNumber, vbn[i], `branch number successfully set to ${vbn[i]}`);
            a.strictEqual(v.branch, vb[i], `branch number ${vbn[i]} successfully gotten as branch ${vb[i]}`);
            v.branchNumber = vbns[i];
            a.strictEqual(v.branchNumber, vbn[i], `branch number successfully set to '${vbns[i]}'`);
            v.branch = vb[i];
            a.strictEqual(v.branch, vb[i], `branch successfully set to '${vb[i]}'`);
            a.strictEqual(v.branchNumber, vbn[i], `branch '${vb[i]}' successfully gotten as branch number ${vbn[i]}`);
            a.strictEqual(v.branch, vb[i], `branch successfully set to ${vbf[i]}`);
        }
        
        // make sure unknown branch fails to set
        a.throws(
            ()=>{
                const v = new MoodleVersion();
                v.branchNumber = 21;
            },
            RangeError,
            'attempting to set branch number for unknown branch throws error'
        );
        a.throws(
            ()=>{
                const v = new MoodleVersion();
                v.branch = '2.1';
            },
            RangeError,
            'attempting to set unknown branch throws error'
        );
        
        // make sure matching branching date gets set
        let v = new MoodleVersion();
        v.branch = '3.3';
        a.strictEqual(v.branchingDateNumber, 20170515, 'setting known branch sets matching branching date');
        
        // make sure setting to undefined works, and also updates the branching date
        v.branch = undefined;
        a.ok(is.undefined(v.branch), 'branch can be set to undefined');
        a.ok(is.undefined(v.branchingDateNumber), 'setting branch undefined sets branching date to undefined too');
        v.branch = '3.3';
        v.branchNumber = undefined;
        a.ok(is.undefined(v.branchNumber), 'branch number can be set to undefined');
        a.ok(is.undefined(v.branchingDateNumber), 'setting branch number undefined sets branching date to undefined too');
    });
    
    QUnit.test('.branchindDate & .branchingDateNumber', function(a){
        // data that must throw errors
        const mustThrowBranchindDateNumber = [
            ...util.dummyDataExcept([], ['integer'], ['other.undefined']),
            ...util.dummyDataWithAllTags('integer', 'negative'),
            ...util.dummyDataWithAnyTag('digit'),
            ...util.dummyDataWithAnyTag('3digit')
        ];
        const mustThrowBranchingDate = [
            ...util.dummyBasicDataExcept('other')
        ];
        
        // set the number of expected tests
        a.expect(mustThrowBranchindDateNumber.length + mustThrowBranchingDate.length + 12);
        
        // make sure the setters throws errors when needed
        for(const dd of mustThrowBranchindDateNumber){
            a.throws(
                ()=>{
                    const v = new MoodleVersion();
                    v.branchingDateNumber = dd.value;
                },
                TypeError,
                `.branchingDateNumber throws error when attempting to set to ${dd.description}`
            );
        }
        for(const dd of mustThrowBranchingDate){
            a.throws(
                ()=>{
                    const v = new MoodleVersion();
                    v.branchingDate = dd.value;
                },
                TypeError,
                `.branchingDate throws error when attempting to set to ${dd.description}`
            );
        }
        
        // make sure setting a branching date to a valid value does not throw an error and that the value gets correctly set
        let v = new MoodleVersion();
        v.branchingDateNumber = 20170515; // Moodle 3.3
        a.strictEqual(v.branchingDateNumber, 20170515, 'branching date number successfully set to 20170515');
        let bd = v.branchingDate;
        a.ok(is.date(bd) && is.year(bd, 2017) && is.month(bd, 'may') && bd.getDate() === 15, `branching date number 20170515 successfully gotten as branching date ${bd}`);
        v.branchingDateNumber = '20170515'; // Moodle 3.3
        a.strictEqual(v.branchingDateNumber, 20170515, "branching date number successfully set to '20170515'");
        v.branchingDate = new Date('2018-05-17T00:00:00.000Z'); //Moodle 3.5
        bd = v.branchingDate;
        a.ok(is.date(bd) && is.year(bd, 2018) && is.month(bd, 'may') && bd.getDate() === 17, `branching date successfully set to ${bd}`);
        a.strictEqual(v.branchingDateNumber, 20180517, `branching date ${bd} successfully gotten as branching date number 20180517`);
        
        // make sure unknown branching date fails to set
        a.throws(
            ()=>{
                const v = new MoodleVersion();
                v.branchingDateNumber = 20170401;
            },
            RangeError,
            'attempting to set branching date number to date that does not match a know branch throws an error'
        );
        a.throws(
            ()=>{
                const v = new MoodleVersion();
                v.branchingDate = new Date('2018-04-01T00:00:00.000Z');
            },
            RangeError,
            'attempting to set branching date to date that does not match a know branch throws an error'
        );
        
        // make sure matching branch gets set
        v = new MoodleVersion();
        v.branchingDateNumber = 20170515;
        a.strictEqual(v.branchNumber, 33, 'setting known branching date sets matching branch');
        
        // make sure setting to undefined works, and also updates the branching date
        v.branchingDateNumber = undefined;
        a.ok(is.undefined(v.branchingDateNumber), 'branching date number can be set to undefined');
        a.ok(is.undefined(v.branchNumber), 'setting branching date number undefined sets branch to undefined too');
        v.branchingDateNumber = 20170515;
        v.branchingDate = undefined;
        a.ok(is.undefined(v.branchingDateNumber), 'branching date can be set to undefined');
        a.ok(is.undefined(v.branchNumber), 'setting branching date undefined sets branch to undefined too');
    });
    
    QUnit.test('.releaseNumber', function(a){
        // data that must throw errors
        const mustThrow = [
            ...util.dummyDataExcept([], ['integer'], ['other.undefined', 'string.empty']),
            ...util.dummyDataWithAllTags('integer', 'negative')
        ];
        
        // set the number of expected tests
        a.expect(mustThrow.length + 5);
        
        // make sure the setters throws errors when needed
        for(const dd of mustThrow){
            a.throws(
                ()=>{
                    const v = new MoodleVersion();
                    v.releaseNumber = dd.value;
                },
                TypeError,
                `.releaseNumber throws error when attempting to set to ${dd.description}`
            );
        }
        
        // make sure the release number can be set as a number and a string and read back
        let mv = new MoodleVersion();
        mv.releaseNumber = 7;
        a.strictEqual(mv.releaseNumber, 7, '.releaseNumber set to 7 and retrieved as 7');
        mv.releaseNumber = '11';
        a.strictEqual(mv.releaseNumber, 11, ".releaseNumber set to '11' and retrieved as 11");
        
        // make sure the release number can be set to zero, and can be undefined
        mv.releaseNumber = 0;
        a.strictEqual(mv.releaseNumber, 0, '.releaseNumber set to 0 and retried as 0');
        mv.releaseNumber = '';
        a.strictEqual(mv.releaseNumber, 0, ".releaseNumber set to '' and retried as 0");
        mv.releaseNumber = undefined;
        a.ok(is.undefined(mv.releaseNumber), '.releaseNumber can be set to undefined');
    });
    
    QUnit.test('.releaseType & .releaseSuffix', function(a){
        // data that must throw errors
        const mustThrowReleaseType = [
            ...util.dummyBasicDataExcept('other')
        ];
        const mustThrowReleaseSuffix = [
            ...util.dummyBasicDataExcept('other')
        ];
        
        // set the number of expected tests
        a.expect(mustThrowReleaseType.length + mustThrowReleaseSuffix.length + 12);
        
        // make sure the setters throws errors when needed
        for(const dd of mustThrowReleaseType){
            a.throws(
                ()=>{
                    const v = new MoodleVersion();
                    v.releaseType = dd.value;
                },
                TypeError,
                `.releaseType throws error when attempting to set to ${dd.description}`
            );
        }
        for(const dd of mustThrowReleaseSuffix){
            a.throws(
                ()=>{
                    const v = new MoodleVersion();
                    v.releaseSuffix = dd.value;
                },
                TypeError,
                `.releaseSuffix throws error when attempting to set to ${dd.description}`
            );
        }
        
        // make sure valid release types can be set and read back
        let mv = new MoodleVersion();
        mv.releaseType = 'development';
        a.strictEqual(mv.releaseType, 'development', "successfully set releaseType to 'development' and read back");
        a.strictEqual(mv.releaseSuffix, 'dev', "successfully set releaseType to 'development' and read as suffix 'dev'");
        mv.releaseType = 'official';
        a.strictEqual(mv.releaseType, 'official', "successfully set releaseType to 'official' and read back");
        a.strictEqual(mv.releaseSuffix, '', "successfully set releaseType to 'official' and read as suffix ''");
        mv.releaseType = 'weekly';
        a.strictEqual(mv.releaseType, 'weekly', "successfully set releaseType to 'weekly' and read back");
        a.strictEqual(mv.releaseSuffix, '+', "successfully set releaseType to 'weekly' and read as suffix '+'");
        
        // make sure valid release suffixes can be set and read back
        mv.releaseSuffix = 'dev';
        a.strictEqual(mv.releaseSuffix, 'dev', "successfully set releaseSuffix to 'dev' and read back");
        a.strictEqual(mv.releaseType, 'development', "successfully set releaseSuffix to 'dev' and read as type 'development'");
        mv.releaseSuffix = '';
        a.strictEqual(mv.releaseSuffix, '', "successfully set releaseSuffix to '' and read back");
        a.strictEqual(mv.releaseType, 'official', "successfully set releaseSuffix to '' and read as type 'official'");
        mv.releaseSuffix = '+';
        a.strictEqual(mv.releaseSuffix, '+', "successfully set releaseSuffix to '+' and read back");
        a.strictEqual(mv.releaseType, 'weekly', "successfully set releaseSuffix to '+' and read as type 'weekly'");
    });
    
    QUnit.test('.buildNumber', function(a){
        // data that must throw errors
        const mustThrow = [
            ...util.dummyDataExcept([], ['integer'], ['other.undefined']),
            ...util.dummyDataWithAllTags('integer', 'negative'),
            ...util.dummyDataWithAnyTag('digit'),
            ...util.dummyDataWithAnyTag('3digit')
        ];
        
        // set the number of expected tests
        a.expect(mustThrow.length + 3);
        
        // make sure the setters throws errors when needed
        for(const dd of mustThrow){
            a.throws(
                ()=>{
                    const v = new MoodleVersion();
                    v.buildNumber = dd.value;
                },
                TypeError,
                `.buildNumber throws error when attempting to set to ${dd.description}`
            );
        }
        
        // make sure the build number can be set as a number and a string and read back
        let mv = new MoodleVersion();
        mv.buildNumber = 20180622;
        a.strictEqual(mv.buildNumber, 20180622, '.buildNumber set to 20180622 and retrieved as 20180622');
        mv.buildNumber = '20180623';
        a.strictEqual(mv.buildNumber, 20180623, ".releaseNumber set to '20180623' and retrieved as 20180623");
        
        // make sure the build number can be set undefined
        mv.buildNumber = undefined;
        a.ok(is.undefined(mv.buildNumber), '.buildNumber can be set to undefined');
    });
    
    QUnit.test('.version', function(a){
        a.expect(6);
        
        // make sure an empty object renders correctly
        a.strictEqual((new MoodleVersion()).version, '??.??.??', 'empty object rendered correctly');
        
        // make sure an official version with release number renders correctly
        a.strictEqual(MoodleVersion.fromObject({ branch: '3.3', releaseNumber: 6, releaseType: 'official' }).version, '3.3.6', 'official release with non-zero release number rendered correctly');
        
        // make sure zero release numbers are omitted
        a.strictEqual(MoodleVersion.fromObject({ branch: '3.5', releaseNumber: 0, releaseType: 'official' }).version, '3.5', 'official release with release number 0 rendered correctly');
        
        // make sure siffixes are handled properly
        a.strictEqual(MoodleVersion.fromObject({ branch: '3.3', releaseNumber: 0, releaseType: 'development' }).version, '3.3dev', 'dev release rendered correctly');
        a.strictEqual(MoodleVersion.fromObject({ branch: '3.3', releaseNumber: 0, releaseType: 'weekly' }).version, '3.3+', 'weekly release with release number 0 rendered correctly');
        a.strictEqual(MoodleVersion.fromObject({ branch: '3.3', releaseNumber: 1, releaseType: 'weekly' }).version, '3.3.1+', 'weekly release with non-zero release number rendered correctly');
    });
    
    QUnit.test('.versionNumber', function(a){
        a.expect(3);
        
        // make sure an empty object renders correctly
        a.strictEqual((new MoodleVersion()).versionNumber, '??????????', 'empty object rendered correctly');
        
        // make sure an official version with release number renders correctly
        a.strictEqual(MoodleVersion.fromObject({ branchingDateNumber: 20170515, releaseNumber: 6 }).versionNumber, '2017051506', 'official release with non-zero release number rendered correctly');
        a.strictEqual(MoodleVersion.fromObject({ branchingDateNumber: 20170515, releaseNumber: 0 }).versionNumber, '2017051500', 'official release with release number 0 rendered correctly');
    });
    
    QUnit.test('.release', function(a){
        a.expect(6);
        
        // make sure an empty object renders correctly
        a.strictEqual((new MoodleVersion()).release, '??.??.?? (Build: ????????)', 'empty object rendered correctly');
        
        // make sure an official version with release number renders correctly
        a.strictEqual(MoodleVersion.fromObject({ branch: '3.3', releaseNumber: 6, releaseType: 'official', buildNumber: 20180517 }).release, '3.3.6 (Build: 20180517)', 'official release with non-zero release number rendered correctly');
        
        // make sure zero release numbers are omitted
        a.strictEqual(MoodleVersion.fromObject({ branch: '3.5', releaseNumber: 0, releaseType: 'official', buildNumber:  20180517 }).release, '3.5 (Build: 20180517)', 'official release with release number 0 rendered correctly');
        
        // make sure siffixes are handled properly
        a.strictEqual(MoodleVersion.fromObject({ branch: '3.5', releaseNumber: 0, releaseType: 'development', buildNumber:  20180510 }).release, '3.5dev (Build: 20180510)', 'dev release rendered correctly');
        a.strictEqual(MoodleVersion.fromObject({ branch: '3.5', releaseNumber: 0, releaseType: 'weekly', buildNumber: 20180614 }).release, '3.5+ (Build: 20180614)', 'weekly release with release number 0 rendered correctly');
        a.strictEqual(MoodleVersion.fromObject({ branch: '3.5', releaseNumber: 1, releaseType: 'weekly', buildNumber: 20180621 }).release, '3.5.1+ (Build: 20180621)', 'weekly release with non-zero release number rendered correctly');
    });
});

QUnit.module('Object Utility Functions', function(){
    QUnit.test('.clone()', function(a){
        const propertiesToTest = ['_branchNumber', '_branchingDateNumber', '_releaseNumber', '_releaseType', '_buildNumber'];
        a.expect((propertiesToTest.length * 3) + 3);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleVersion.prototype.clone), 'function exists');
        
        // make sure the clone really is a clone object
        let v = new MoodleVersion();
        let vc = v.clone();
        a.ok(vc instanceof MoodleVersion, 'clone is a MoodleVersion object');
        a.notStrictEqual(v, vc, 'the clone is not a reference to the original');
        
        // make sure all values get coppied when undefined
        for(const p of propertiesToTest){
            a.strictEqual(v[p], vc[p], `property ${p} coppied correctly when undefined`);
        }
        
        // make sure all values get coppied with a known version
        v = MoodleVersion.fromObject({
            branchNumber: 35,
            releaseNumber: 0,
            releaseType: 'weekly',
            buildNumber: 20180614
        });
        vc = v.clone();
        for(const p of propertiesToTest){
            a.strictEqual(v[p], vc[p], `property ${p} coppied correctly on known version`);
        }
        
        // make sure all values get coppied with an unknown version
        v = MoodleVersion.fromObject({
            branchNumber: 36,
            branchingDateNumber: 20180517,
            releaseNumber: 0,
            releaseType: 'development',
            buildNumber: 20180524
        });
        vc = v.clone();
        for(const p of propertiesToTest){
            a.strictEqual(v[p], vc[p], `property ${p} coppied correctly on an unknown version`);
        }
    });
    
    QUnit.test('.toString()', function(a){
        a.expect(6);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleVersion.prototype.toString), 'function exists');
        
        // make sure the function returns a string
        let v = new MoodleVersion();
        a.ok(is.string(v.toString()), 'returns a string');
        
        // make sure the function can handle an empty object
        a.strictEqual(v.toString(), '??.??.?? (type: ??, branching date: ?? & build: ??)', 'empty object rendered correctly');
        
        // make sure the function correctly includes all data
        v = MoodleVersion.fromObject({
            branchNumber: 35,
            releaseNumber: 0,
            releaseType: 'official',
            buildNumber: 20180614
        });
        a.strictEqual(v.toString(), '3.5.0 (type: official, branching date: 20180517 & build: 20180614)', 'complete version rendered correctly');
        
        // make sure the function correctly handles the suffixes
        v.releaseType = 'development';
        a.strictEqual(v.toString(), '3.5.0dev (type: development, branching date: 20180517 & build: 20180614)', 'dev version rendered correctly');
        v.releaseType = 'weekly';
        a.strictEqual(v.toString(), '3.5.0+ (type: weekly, branching date: 20180517 & build: 20180614)', 'weekly version rendered correctly');
    });
    
    QUnit.test('.toObject()', function(a){
        a.expect(3);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleVersion.prototype.toObject), 'function exists');
        
        // make sure the function returns an object
        let v = new MoodleVersion();
        a.ok(is.object(v.toObject()), 'returns an object');
        
        // make sure the function returns the expected values
        let mv = MoodleVersion.fromObject({
            branch: '3.3',
            releaseNumber: 6,
            releaseType: 'official',
            buildNumber: 20180517
        });
        a.deepEqual(
            mv.toObject(),
            {
                version: '3.3.6',
                versionNumber: '2017051506',
                release: '3.3.6 (Build: 20180517)',
                branch: '3.3',
                branchNumber: 33,
                branchingDateNumber: 20170515,
                branchingDate: MoodleVersion.dateFromDateNumber(20170515),
                releaseNumber: 6,
                releaseType: 'official',
                releaseSuffix: '',
                buildNumber: 20180517
            },
            'expected values returned'
        );
    });
});

QUnit.module('comparison methods', function(){
    QUnit.test('compare()', function(a){
        const mustReturnNaN = [
            ...util.dummyBasicData()
        ];
        a.expect((mustReturnNaN.length * 2) + 11);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleVersion.compare), 'function exists');
        
        // make sure everything that must result in NaN does when used as either argument
        const v = new MoodleVersion();
        for(const dd of mustReturnNaN){
            a.ok(is.nan(MoodleVersion.compare(dd.value, v)), `${dd.description} as val1 returns NaN`);
            a.ok(is.nan(MoodleVersion.compare(v, dd.value)), `${dd.description} as val2 returns NaN`);
        }
        
        // check that equality is properly detected, both on an 'empty' version and one with all details added
        a.strictEqual(MoodleVersion.compare(new MoodleVersion(), new MoodleVersion()), 0, 'two default versions are considered equal');
        let vObj = {
            branch: '3.5',
            releaseNumber: 0,
            releaseType: 'weekly',
            buildNumber: 20180614
        };
        a.strictEqual(MoodleVersion.compare(new MoodleVersion(vObj), new MoodleVersion(vObj)), 0, 'two versions with the same branch, release number, type & build number are considered equal');
        
        // check when branches differ
        let v1 = MoodleVersion.fromObject({
            branch: '3.3',
            releaseNumber: '6',
            releaseType: 'official',
            buildNumber: 20180517
        });
        let v2 = MoodleVersion.fromObject({
            branch: '3.4',
            releaseNumber: '6',
            releaseType: 'official',
            buildNumber: 20180517
        });
        a.strictEqual(MoodleVersion.compare(v1, v2), -1, 'val1 with lower branch than val2 returns -1');
        a.strictEqual(MoodleVersion.compare(v2, v1), 1, 'val1 with higher branch than val2 returns 1');
        
        // check when release numbers differ
        v1 = MoodleVersion.fromObject({
            branch: '3.3',
            releaseNumber: '6',
            releaseType: 'official',
            buildNumber: 20180517
        });
        v2 = MoodleVersion.fromObject({
            branch: '3.3',
            releaseNumber: '7',
            releaseType: 'official',
            buildNumber: 20180517
        });
        a.strictEqual(MoodleVersion.compare(v1, v2), -1, 'val1 with lower release number than val2 returns -1');
        a.strictEqual(MoodleVersion.compare(v2, v1), 1, 'val1 with higher release number than val2 returns 1');
        
        // check when release types differ
        v1 = MoodleVersion.fromObject({
            branch: '3.3',
            releaseNumber: '6',
            releaseType: 'official',
            buildNumber: 20180517
        });
        v2 = MoodleVersion.fromObject({
            branch: '3.3',
            releaseNumber: '6',
            releaseType: 'weekly',
            buildNumber: 20180517
        });
        a.strictEqual(MoodleVersion.compare(v1, v2), -1, 'val1 with lower release type than val2 returns -1');
        a.strictEqual(MoodleVersion.compare(v2, v1), 1, 'val1 with higher release type than val2 returns 1');
        
        // check when release types differ
        v1 = MoodleVersion.fromObject({
            branch: '3.3',
            releaseNumber: '6',
            releaseType: 'weekly',
            buildNumber: 20180517
        });
        v2 = MoodleVersion.fromObject({
            branch: '3.3',
            releaseNumber: '6',
            releaseType: 'weekly',
            buildNumber: 20180524
        });
        a.strictEqual(MoodleVersion.compare(v1, v2), -1, 'val1 with lower build number than val2 returns -1');
        a.strictEqual(MoodleVersion.compare(v2, v1), 1, 'val1 with higher build number than val2 returns 1');
    });
    
    QUnit.test('.equals()', function(a){
        const mustReturnFalse = [
            ...util.dummyBasicData()
        ];
        a.expect(mustReturnFalse.length + 8);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleVersion.prototype.equals), 'function exists');
        
        // make sure values other than version objects return false
        const vObj = {
            branch: '3.3',
            releaseNumber: '6',
            releaseType: 'official',
            buildNumber: 20180517
        };
        const v = MoodleVersion.fromObject(vObj);
        for(const dd of mustReturnFalse){
            a.strictEqual(v.equals(dd.val), false, `${dd.description} returns false`);
        }
        
        // make sure equal versions return true
        let vd = new MoodleVersion();
        a.strictEqual(vd.equals(new MoodleVersion()), true, 'a default version is considered equal to another default version');
        a.strictEqual(v.equals(v.clone()), true, 'a clone is considered equal to the original');
        a.strictEqual(v.equals(MoodleVersion.fromObject(vObj)), true, 'two versions containing the same branch, release number, type, and build number are considered equal');
        
        // make sure differing versions return false
        a.strictEqual(v.equals(MoodleVersion.fromObject(_.assign({}, vObj, { branch: '3.4'}))), false, 'differing branch not considered equal');
        a.strictEqual(v.equals(MoodleVersion.fromObject(_.assign({}, vObj, { releaseNumber: '7'}))), false, 'differing release number not considered equal');
        a.strictEqual(v.equals(MoodleVersion.fromObject(_.assign({}, vObj, { releaseType: 'weekly'}))), false, 'differing release type not considered equal');
        a.strictEqual(v.equals(MoodleVersion.fromObject(_.assign({}, vObj, { buildNumber: 20180518}))), false, 'differing release number not considered equal');
    });
    
    QUnit.test('.compareTo()', function(a){
        const mustReturnNaN = [
            ...util.dummyBasicData()
        ];
        a.expect(mustReturnNaN.length + 10);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleVersion.prototype.compareTo), 'function exists');
        
        // make sure values other than version objects return NaN
        const vObj = {
            branch: '3.3',
            releaseNumber: '6',
            releaseType: 'official',
            buildNumber: 20180517
        };
        const v = MoodleVersion.fromObject(vObj);
        for(const dd of mustReturnNaN){
            a.ok(is.nan(v.compareTo(dd.val)), `${dd.description} returns NaN`);
        }
        
        // make sure an equal version returns 0
        a.strictEqual(v.compareTo(MoodleVersion.fromObject(vObj)), 0, 'an equal version returns 0');
        
        // make sure lesser versions return -1
        a.strictEqual(v.compareTo(MoodleVersion.fromObject(_.assign({}, vObj, { branch: '3.2'}))), -1, 'lower branch returns -1');
        a.strictEqual(v.compareTo(MoodleVersion.fromObject(_.assign({}, vObj, { releaseNumber: 5}))), -1, 'lower release number returns -1');
        a.strictEqual(v.compareTo(MoodleVersion.fromObject(_.assign({}, vObj, { releaseType: 'development'}))), -1, 'dev release returns -1');
        a.strictEqual(v.compareTo(MoodleVersion.fromObject(_.assign({}, vObj, { buildNumber: 20180510}))), -1, 'lower build number returns -1');
        
        // make sure greater versions return false
        a.strictEqual(v.compareTo(MoodleVersion.fromObject(_.assign({}, vObj, { branch: '3.4'}))), 1, 'higher branch returns 1');
        a.strictEqual(v.compareTo(MoodleVersion.fromObject(_.assign({}, vObj, { releaseNumber: 7}))), 1, 'higher release number returns 1');
        a.strictEqual(v.compareTo(MoodleVersion.fromObject(_.assign({}, vObj, { releaseType: 'weekly'}))), 1, 'weekly release returns 1');
        a.strictEqual(v.compareTo(MoodleVersion.fromObject(_.assign({}, vObj, { buildNumber: 20180524}))), 1, 'higher build number returns 1');
    });
    
    QUnit.test('.lessThan()', function(a){
        const mustReturnUndefined = [
            ...util.dummyBasicData()
        ];
        a.expect(mustReturnUndefined.length + 10);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleVersion.prototype.lessThan), 'function exists');
        
        // make sure values other than version objects return undefined
        const vObj = {
            branch: '3.3',
            releaseNumber: '6',
            releaseType: 'official',
            buildNumber: 20180517
        };
        const v = MoodleVersion.fromObject(vObj);
        for(const dd of mustReturnUndefined){
            a.ok(is.undefined(v.lessThan(dd.val)), `${dd.description} returns undefined`);
        }
        
        // make sure an equal version returns false
        a.strictEqual(v.lessThan(MoodleVersion.fromObject(vObj)), false, 'an equal version is not considered lesser');
        
        // make sure comparing to higher versions returns true
        a.strictEqual(v.lessThan(MoodleVersion.fromObject(_.assign({}, vObj, { branch: '3.4'}))), true, 'considered less than higher branch');
        a.strictEqual(v.lessThan(MoodleVersion.fromObject(_.assign({}, vObj, { releaseNumber: 7}))), true, 'considered less than higher release number');
        a.strictEqual(v.lessThan(MoodleVersion.fromObject(_.assign({}, vObj, { releaseType: 'weekly'}))), true, 'official release considered less than weekly release');
        a.strictEqual(v.lessThan(MoodleVersion.fromObject(_.assign({}, vObj, { buildNumber: 20180524}))), true, 'considered less than higher build number');
        
        // make sure comparing to lower versions returns false
        a.strictEqual(v.lessThan(MoodleVersion.fromObject(_.assign({}, vObj, { branch: '3.2'}))), false, 'not considered less than lower branch');
        a.strictEqual(v.lessThan(MoodleVersion.fromObject(_.assign({}, vObj, { releaseNumber: 5}))), false, 'not considered less than lower release number');
        a.strictEqual(v.lessThan(MoodleVersion.fromObject(_.assign({}, vObj, { releaseType: 'development'}))), false, 'official release not considered less than dev release');
        a.strictEqual(v.lessThan(MoodleVersion.fromObject(_.assign({}, vObj, { buildNumber: 20180510}))), false, 'not considered less than lower build number');
    });
    
    QUnit.test('.greaterThan()', function(a){
        const mustReturnUndefined = [
            ...util.dummyBasicData()
        ];
        a.expect(mustReturnUndefined.length + 10);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleVersion.prototype.greaterThan), 'function exists');
        
        // make sure values other than version objects return undefined
        const vObj = {
            branch: '3.3',
            releaseNumber: '6',
            releaseType: 'official',
            buildNumber: 20180517
        };
        const v = MoodleVersion.fromObject(vObj);
        for(const dd of mustReturnUndefined){
            a.ok(is.undefined(v.greaterThan(dd.val)), `${dd.description} returns undefined`);
        }
        
        // make sure an equal version returns false
        a.strictEqual(v.greaterThan(MoodleVersion.fromObject(vObj)), false, 'an equal version is not considered greater');
        
        // make sure comparing to lesser versions returns true
        a.strictEqual(v.greaterThan(MoodleVersion.fromObject(_.assign({}, vObj, { branch: '3.2'}))), true, 'considerd greater than lower branch');
        a.strictEqual(v.greaterThan(MoodleVersion.fromObject(_.assign({}, vObj, { releaseNumber: 5}))), true, 'considered greater than lower release number');
        a.strictEqual(v.greaterThan(MoodleVersion.fromObject(_.assign({}, vObj, { releaseType: 'development'}))), true, 'official release considered greater than dev release');
        a.strictEqual(v.greaterThan(MoodleVersion.fromObject(_.assign({}, vObj, { buildNumber: 20180510}))), true, 'considered greater than lower build number');
        
        // make sure greater versions return true
        a.strictEqual(v.greaterThan(MoodleVersion.fromObject(_.assign({}, vObj, { branch: '3.4'}))), false, 'not considered greater than higher branch');
        a.strictEqual(v.greaterThan(MoodleVersion.fromObject(_.assign({}, vObj, { releaseNumber: 7}))), false, 'not considered greater than higher release number');
        a.strictEqual(v.greaterThan(MoodleVersion.fromObject(_.assign({}, vObj, { releaseType: 'weekly'}))), false, 'official release not considered greater than weekly release');
        a.strictEqual(v.greaterThan(MoodleVersion.fromObject(_.assign({}, vObj, { buildNumber: 20180524}))), false, 'not considered greater than higher build number');
    });
    
    QUnit.test('.sameBranch()', function(a){
        const mustReturnUndefined = [
            ...util.dummyBasicData()
        ];
        a.expect(mustReturnUndefined.length + 8);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleVersion.prototype.sameBranch), 'function exists');
        
        // make sure values other than version objects return undefined
        const vObj = {
            branch: '3.3',
            releaseNumber: '6',
            releaseType: 'official',
            buildNumber: 20180517
        };
        const v = MoodleVersion.fromObject(vObj);
        for(const dd of mustReturnUndefined){
            a.ok(is.undefined(v.sameBranch(dd.val)), `${dd.description} returns undefined`);
        }
        a.ok(is.undefined((new MoodleVersion()).sameBranch(new MoodleVersion())), 'two undefined branches returns undefined');
        
        // make sure an equal version returns true
        a.strictEqual(v.sameBranch(MoodleVersion.fromObject(vObj)), true, 'an equal version is considered the same branch');
        
        // make sure same branch returns true
        a.strictEqual(v.sameBranch(MoodleVersion.fromObject(_.assign({}, vObj, { releaseNumber: 5}))), true, 'differing release number considered same branch');
        a.strictEqual(v.sameBranch(MoodleVersion.fromObject(_.assign({}, vObj, { releaseType: 'development'}))), true, 'differing release type considered same branch');
        a.strictEqual(v.sameBranch(MoodleVersion.fromObject(_.assign({}, vObj, { buildNumber: 20180510}))), true, 'differing build number considered same branch');
        
        // make sure differing branch returns false
        a.strictEqual(v.sameBranch(MoodleVersion.fromObject(_.assign({}, vObj, { branch: '3.4'}))), false, 'lower branch considered different branch');
        a.strictEqual(v.sameBranch(MoodleVersion.fromObject(_.assign({}, vObj, { branch: '3.6'}))), false, 'higher branch considered different branch');
    });
});

QUnit.module('informational methods', function(){
    QUnit.test('.isKnownBranch()', function(a){
        a.expect(4);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleVersion.prototype.isKnownBranch), 'function exists');
        
        // make sure undefined and unknown branches return false
        a.strictEqual((new MoodleVersion()).isKnownBranch(), false, 'an undefined branch returns false');
        a.strictEqual(MoodleVersion.fromObject({branch: '2.1'}).isKnownBranch(), false, 'an unknown branch returns false');
        
        // make sure a known branch returns true
        a.strictEqual(MoodleVersion.fromObject({branch: '3.3'}).isKnownBranch(), true, 'a known branch returns true');
    });
    
    QUnit.test('.isStable()', function(a){
        a.expect(5);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleVersion.prototype.isStable), 'function exists');
        
        // make sure an undefined release type returns undefined
        a.ok(is.undefined((new MoodleVersion()).isStable()), 'an undefined release type returns undefined');
        
        // make sure dev returns false
        a.strictEqual(MoodleVersion.fromObject({releaseType: 'development'}).isStable(), false, 'develpment release returns false');
        
        // make sure official and weekly retun true
        a.strictEqual(MoodleVersion.fromObject({releaseType: 'official'}).isStable(), true, 'official release returns true');
        a.strictEqual(MoodleVersion.fromObject({releaseType: 'weekly'}).isStable(), true, 'weekly release returns true');
    });
    
    QUnit.test('.isLTS()', function(a){
        a.expect(5);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleVersion.prototype.isLTS), 'function exists');
        
        // make sure a undefined and unknown branches return undefined
        a.ok(is.undefined((new MoodleVersion()).isLTS()), 'an undefined branch returns undefined');
        a.ok(is.undefined(MoodleVersion.fromObject({branch: '2.1'}).isLTS()), 'an unknown branch returns undefined');
        
        // make sure a known non-LTS branch returns false
        a.strictEqual(MoodleVersion.fromObject({branch: '3.3'}).isLTS(), false, 'a known non-LTS branch returns false');
        
        // make sure a known LTS branch returns true
        a.strictEqual(MoodleVersion.fromObject({branch: '3.5'}).isLTS(), true, 'a known LTS branch returns true');
    });
});

QUnit.module('factory methods', function(){
    QUnit.test('fromObject()', function(a){
        const mustThrow = [
            ...util.dummyBasicPrimitives()
        ];
        const props = ['_branchNumber', '_branchingDateNumber', '_releaseNumber', '_releaseType', '_buildNumber'];
        a.expect(mustThrow.length + (props.length * 3) + 5);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleVersion.fromObject), 'function exists');
        
        // make sure data that should throw an error does
        for(const dd of mustThrow){
            a.throws(
                ()=>{ MoodleVersion.fromObject(dd.value); },
                TypeError,
                `${dd.description} throws a type error`
            );
        }
        
        // make sure an empty object is treated correctly
        let v = MoodleVersion.fromObject({});
        for(const p of props){
            a.ok(is.undefined(v[p]), `${p} undefined when passed empty object`);
        }
        
        // a helper function to quickly check all properties against an array of values
        checkAllProps = (msg, ...vals)=>{
            for(let i = 0; i < props.length; i++){
                a.strictEqual(v[props[i]], vals[i], `${props[i]} ${msg}`);
            }
        };
        
        // make sure all properties get saved when given the natively stored data for a valid branch
        // this test covers auto-fill of branching dates
        v = MoodleVersion.fromObject({
            branchNumber: 33,
            releaseNumber: 6,
            releaseType: 'official',
            buildNumber: 20180517
        });
        checkAllProps('correctly saved when passed native data for valid branch', 33, 20170515, 6, 'official', 20180517);
        
        // make sure all properties get saved when given auto-translated data for a valid branch
        v = MoodleVersion.fromObject({
            branch: '3.3',
            releaseNumber: 6,
            releaseSuffix: '',
            buildNumber: 20180517
        });
        checkAllProps('correctly saved when passed data that needs transforming for valid branch', 33, 20170515, 6, 'official', 20180517);
        
        // make sure branches auto-fill to branching dates
        v = MoodleVersion.fromObject({
            branchingDateNumber: 20170515,
            releaseNumber: 6,
            releaseSuffix: '',
            buildNumber: 20180517
        });
        a.strictEqual(v._branchNumber, 33, 'Branch correctly auto-filled from brancing date number');
        v = MoodleVersion.fromObject({
            branchingDate: new Date('2017-05-15T00:00:00.000Z'),
            releaseNumber: 6,
            releaseSuffix: '',
            buildNumber: 20180517
        });
        a.strictEqual(v._branchNumber, 33, 'Branch correctly auto-filled from brancing date');
        
        // make sure un-known branches can be created
        v = MoodleVersion.fromObject({
            branchNumber: 36,
            branchingDateNumber: 20180615,
            releaseNumber: 0,
            releaseSuffix: 'dev',
            buildNumber: 20180618
        });
        a.strictEqual(v._branchNumber, 36, 'un-known branch successfully saved');
        a.strictEqual(v._branchingDateNumber, 20180615, 'un-known branching date successfully saved');
    });
    
    QUnit.test('fromString()', function(a){
        // define the data the should trigger errors
        const mustThrowTypeError = [
            ...util.dummyBasicPrimitivesExcept('string')
        ];
        const mustThrowRangeError = [
            ...util.dummyData('string', {excludeTags: ['numeric']}),
            util.dummyData('string.integer.negative'),
            util.dummyData('string.integer.4digit'),
            util.dummyData('string.zero')
        ];
        
        // define test data
        const rsIn =  [
            '3.3.6 (Build: 20180517)',
            'Moodle 3.5+ (Build: 20180614)'
        ];
        const rsOut = [
            '3.3.6 (type: official, branching date: 20170515 & build: 20180517)',
            '3.5.0+ (type: weekly, branching date: 20180517 & build: 20180614)'
        ];
        const vsIn = [
            '3.3.6',
            '3.5+'
        ];
        const vsOut = [
            '3.3.6 (type: official, branching date: 20170515 & build: ??)',
            '3.5.0+ (type: weekly, branching date: 20180517 & build: ??)'
        ];
        const vnIn = [
            '2017051506',
            '2018051700.00'
        ];
        const vnOut = [
            '3.3.6 (type: ??, branching date: 20170515 & build: ??)',
            '3.5.0 (type: ??, branching date: 20180517 & build: ??)'
        ];
        const fsInOut = [
            '3.3.6 (type: official, branching date: 20170515 & build: 20180517)',
            '3.5.0+ (type: weekly, branching date: 20180517 & build: 20180614)',
            '??.??.?? (type: ??, branching date: ?? & build: ??)'
        ];
        
        // calcualte the expected number of assertions
        a.expect(mustThrowTypeError.length + mustThrowRangeError.length + rsIn.length + vsIn.length + vnIn.length + fsInOut.length + 1);
        
        // make sure the function actually exists
        a.ok(is.function(MoodleVersion.fromString), 'function exists');
        
        // make sure data that should throw an error does
        for(const dd of mustThrowTypeError){
            a.throws(
                ()=>{ MoodleVersion.fromString(dd.value); },
                TypeError,
                `${dd.description} throws a type error`
            );
        }
        for(const dd of mustThrowRangeError){
            a.throws(
                ()=>{ MoodleVersion.fromString(dd.value); },
                RangeError,
                `${dd.description} throws a range error`
            );
        }
        
        // make sure release strings are parsed correctly
        for(let i = 0; i < rsIn.length; i++){
            a.strictEqual(MoodleVersion.fromString(rsIn[i]).toString(), rsOut[i], `'${rsIn[i]}' parsed to '${rsOut[i]}'`);
        }
        for(let i = 0; i < vsIn.length; i++){
            a.strictEqual(MoodleVersion.fromString(vsIn[i]).toString(), vsOut[i], `'${vsIn[i]}' parsed to '${vsOut[i]}'`);
        }
        for(let i = 0; i < vnIn.length; i++){
            a.strictEqual(MoodleVersion.fromString(vnIn[i]).toString(), vnOut[i], `'${vnIn[i]}' parsed to '${vnOut[i]}'`);
        }
        for(const s of fsInOut){
            a.strictEqual(MoodleVersion.fromString(s).toString(), s, `'${s}' parsed to '${s}'`);
        }
    });
});