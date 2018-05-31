//
//=== TEMP Utilities 'Module' ==================================================
//
// (will be separated out into an actual module when up and working)

const util = {
    data: {
        "undefined": ['undefined', undefined],
        "null": ['null', null],
        "boolean": ['a boolean', true],
        "boolean.true": ['true', true],
        "boolean.false": ['false', false],
        "number": ['a  number', 3],
        "number.zero": ['zero', 0],
        "number.integer": ['an integer', 7],
        "number.integer.positive": ['a positive integer', 42],
        "number.integer.negative": ['a negative integer', -42],
        "number.float": ['a floating point number', 1.337],
        "number.float.negative": ['a negative floating point number', -3.14],
        "number.float.positive": ['a positive floating point number', 3.14],
        "string": ['a string', 'boogers'],
        "string.empty": ['an empty string', ''],
        "string.singleLine": ['a single-line string', 'boogers and snot'],
        "string.multiLine": ['a multi-line string', 'boogers\nsnot\nbogeys'],
        "string.numeric": ['a numeric string', '42'],
        "string.alphanumeric": ['an alpha-numeric string', '42abc']
    }
};

//
//=== The Tests ================================================================
//

QUnit.module('Static Helpers', {}, function(){
    QUnit.test('.branchFromBranchNumber()', function(a){
        a.expect(1);
        a.ok(is.function(MoodleVersion.branchFromBranchNumber), 'function exists');
    });
});