# @maynoothuniversity/moodle-version

A JavaScript class for parsing Moodle version numbers and release strings.

Moodle version identifiers are a lot more complex than those for other software
packages. You'll find three different representations of the version information
in common use:

1. *Version Strings* — you'll see these short numbers on the offical Moodle
   download page. They consist of a branch string (e.g. `3.5`), an optional
   release number, e.g. `.1`, and an optional suffix (`dev` for developer
   releases and `+` for weekly releases). So, version `3.3.6+` is a weekly
   update to the sixth official release of Moodle 3.3.
2. *Release Strings* - you'll see these long version strings in the Moodle
   admin area. They consist of the version string with the build number
   appended to the end, e.g. `Moodle 3.5+ (Build: 20180614)`.
3. *Version Numbers* - under the hood Moodle represents versions as the date
   the version was branched in source control in reverse order followed by the
   release number. So, under the hood `Moodle 3.5+ (Build: 20180614)` is
   represented as version `2018051700`.

This JavaScript class is here to help!

## Install & Import

### NodeJS

Install:

```
npm install --save @maynoothuniversity/moodle-version
```

Import:

```
const MoodleVersion = require('@maynoothuniversity/moodle-version');
```

### ES6 Module

```
// import
import * as MoodleVersion from './dist/index.es.js'
```

### Browser (from CDN)

```
<!-- Import module, always imported as MoodleVersion -->
<script type="text/javascript" src="">https://cdn.jsdelivr.net/npm/@maynoothuniversity/moodle-version/dist/index.js</script>
```

## Usage

```
const MoodleVersion = require('@maynoothuniversity/moodle-version');
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
```


## API Documentation

Full API documentation is available at
[bbusschots-mu.github.io/moodle-version](https://bbusschots-mu.github.io/moodle-version/).