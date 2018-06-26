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

```
// create a Moodle Version object from a release string
const mv1 = new MoodleVersion('Moodle 3.5+ (Build: 20180614)');

// output the version in any format
console.log(mv1.version); // 3.5+
console.log(mv1.versionNumber); // 2018051700
console.log(mv1.release); // 3.5+ (Build: 20180614)

// interrogate the version
console.log(mv1.branch); // 3.5
console.log(mv1.branchNumber); // 35
console.log(mv1.branchingDate); // 2018-05-17T00:00:00.000Z
console.log(mv1.branchingDateNumber); // 20180517
console.log(mv1.releaseNumber); // 0
console.log(mv1.releaseType); // weekly
console.log(mv1.releaseSuffix); // +
console.log(mv1.buildNumber); // 20180614
console.log(mv1.isStable()); // true
console.log(mv1.isLTS()); // true

// compare versions
const mv2 = new MoodleVersion('3.5dev');
console.log(mv1.equals(mv2)); // false
console.log(mv1.sameBranch(mv2)); // true
console.log(mv1.lessThan(mv2)); // false
console.log(mv1.greaterThan(mv2)); // true
```

## API Documentation

Full API documentation is available at
[bbusschots-mu.github.io/moodle-version](https://bbusschots-mu.github.io/moodle-version/).

## NodeJS

Install the package:

```
npm install --save @maynoothuniversity/moodle-version
```

Import the module:

```
const MoodleVersion = require('@maynoothuniversity/moodle-version');
```

## In Browser

The original source package is written for use in Node, and cannot be directly
used in a web browser, however, an automatically generated browser-ready version
can be found in `build/MoodleVersion.js`. You can download this file, or,
access it via any of the many CDNs that publish content form GitHub.

To use this class in a web page you'll also need to import the
[is.js](http://is.js.org/) libray. Again, you can download this library, or,
access it via a CDN.

The following example uses CDNs for both this class and it's requirements:

```
<!-- Load is.js from the CloudFlare CDN -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/is_js/0.9.0/is.min.js"></script>

<!-- Load MoodleVersion from the RawGit CDN -->
<script src="https://cdn.rawgit.com/bbusschots-mu/moodle-version/b424372a/build/MoodleVersion.js"></script>
```