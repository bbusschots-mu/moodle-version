QUnit.module('Static Helpers', {}, function(){
    QUnit.test('.branchFromBranchNumber()', function(a){
        a.expect(1);
        a.ok(is.function(MoodleVersion.branchFromBranchNumber), 'function exists');
    });
});