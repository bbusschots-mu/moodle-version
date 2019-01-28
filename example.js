const MoodleVersion = require('./dist/index');
let mv1;

// create a Moodle Version object from a version string
mv1 = new MoodleVersion('3.5.4+');

// create a Moodle Version object a version number (Moodle's internal represenation)
mv1 = new MoodleVersion('2018051704.05');

// create a Moodle Version object from a release string (as seen in admin GUI)
mv1 = new MoodleVersion('Moodle 3.5.4+ (Build: 20190124)');

// output the version in any format
console.log(mv1.version); // 3.5.4+
console.log(mv1.versionNumber); // 2018051704
console.log(mv1.release); // 3.5.4+ (Build: 20190124)

// interrogate the version
console.log(mv1.branch); // 3.5
console.log(mv1.branchNumber); // 35
console.log(mv1.branchingDate); // 2018-05-17T00:00:00.000Z
console.log(mv1.branchingDateNumber); // 20180517
console.log(mv1.releaseNumber); // 4
console.log(mv1.releaseType); // weekly
console.log(mv1.releaseSuffix); // +
console.log(mv1.buildNumber); // 20190124
console.log(mv1.isStable()); // true
console.log(mv1.isLTS()); // true

// compare versions
const mv2 = new MoodleVersion('3.5.4dev');
console.log(mv1.equals(mv2)); // false
console.log(mv1.sameBranch(mv2)); // true
console.log(mv1.lessThan(mv2)); // false
console.log(mv1.greaterThan(mv2)); // true