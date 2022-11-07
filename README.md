# leo-profanity

![continuous integration](https://github.com/jojoee/leo-profanity/workflows/continuous%20integration/badge.svg?branch=master)
![release](https://github.com/jojoee/leo-profanity/workflows/release/badge.svg?branch=master)
![runnable](https://github.com/jojoee/leo-profanity/workflows/runnable/badge.svg?branch=master)
![runnable old node](https://github.com/jojoee/leo-profanity/workflows/runnable%20old%20node/badge.svg?branch=master)
![runnable without optional dependencies](https://github.com/jojoee/leo-profanity/workflows/runnable%20without%20optional%20dependencies/badge.svg?branch=master)
[![Codecov](https://img.shields.io/codecov/c/github/jojoee/leo-profanity.svg)](https://codecov.io/github/jojoee/leo-profanity)
[![Version - npm](https://img.shields.io/npm/v/leo-profanity.svg)](https://www.npmjs.com/package/leo-profanity)
[![License - npm](https://img.shields.io/npm/l/leo-profanity.svg)](http://opensource.org/licenses/MIT)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![Greenkeeper badge](https://badges.greenkeeper.io/jojoee/leo-profanity.svg)](https://greenkeeper.io/)

Profanity filter, based on "Shutterstock" dictionary. [Demo page](https://jojoee.github.io/leo-profanity/), [API document page](https://jojoee.github.io/leo-profanity/doc/LeoProfanity.html)

## Installation

```
// npm
npm install leo-profanity
npm install leo-profanity --no-optional # install only English bad word dictionary

// yarn
yarn add leo-profanity
yarn add leo-profanity --ignore-optional # install only English bad word dictionary

// Bower
bower install leo-profanity
// dictionary/default.json

// githack
<script src="https://raw.githack.com/jojoee/bahttext/master/src/index.js"></script>
const filter = LeoProfanity
filter.clearList()
filter.add(["boobs", "butt"])
```

## Example usage for npm

```javascript
// support languages
// - en
// - fr
// - ru

var filter = require('leo-profanity');

// output: I have ****, etc.
filter.clean('I have boob, etc.');

// replace current dictionary with the french
filter.loadDictionary('fr');

// create new dictionary
filter.addDictionary('th', ['หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า'])
```

See more here [LeoProfanity - Documentation](https://jojoee.github.io/leo-profanity/doc/LeoProfanity.html)

## Algorithm

This project decide to split it into 2 parts,  `Sanitize` and `Filter`
and these below is a interesting algorithms.

### Sanitize

```
Attempt 1 (1.1): Convert all into lowercase string
Example:
- "SomeThing" to "something"
Advantage:
- Simple to understand
- Simple to implement
Disadvantage or Caution:
- Will ignore "case sensitive" word

Attempt 2 (1.2): Turn "similar-like" symbol to alphabet
Example:
- "@" to "a"
- "5" or "$" to "s"
- "@ss" to "ass"
- "b00b" to "boob"
- "a$$a$$in" to "assassin"
Advantage:
- Detect some trick words
Disadvantage or Caution:
- False positive
- Subjective, which depends on each person think about the symbol
- Limit user imagination (user cannot play with word)
  e.g. "joe@ssociallife.com"
  e.g. user want to try something funny like "a$$a$$in"

Attempt 3 (1.3): Replace "." and "," with space to separate words
In some sentence, people usually using "." and "," to connect or end the sentence
Example:
- "I like a55,b00b.t1ts" to "I like a55 b00b t1ts"
Advantage:
- Increase founding possibility e.g. "I like a55,b00b.t1ts"
Disadvantage or Caution:
- Disconnect some words e.g. "john.doe@gmail.com"
```

### Filter

```
Attempt 1 (2.1): Split into array (or using regex)
Using space to split "word string" into "word array" then check by profanity word list
Example:
- "I like ass boob" to ["I", "like", "ass", "boob"]
Advantage:
- Simple to implement
Disadvantage:
- Need proper list of profanity word
- Some "false positive" e.g. Great tit (https://en.wikipedia.org/wiki/Great_tit)

Attempt 2 (2.2): Filter word inside (with or without space)
Detect all alphabet that contain "profanity word"
Example:
- "thistextisfunnyboobsanda55" which contains suspicious words: "boobs", "a55"
Advantage:
- Can detect "un-spaced" profanity word
Disadvantage:
- Many "false positive" e.g. http://www.morewords.com/contains/ass/, Clbuttic mistake (filter mistake)
```

### In Summary
- We don't know all methods that can produce profanity word
  (e.g. how many different ways can you enter a55 ?)
- There have a non-algorithm-based approach to achieve it (yet)
- People will always find a way to connect with each other
  (e.g. [Leet](https://en.wikipedia.org/wiki/Leet))

**So, this project decide to go with 1.1, 1.3 and 2.1.**

(note - you can found other attempts in "Reference" section)

## CMD

```
npm run test.watch
npm run validate
npm run doc.generate

# test npm publish
npm publish --dry-run
```

## Other languages
- [x] Javascript on [npmjs.com/package/leo-profanity](https://www.npmjs.com/package/leo-profanity)
- [x] PHP on [packagist.org/packages/jojoee/leo-profanity](https://packagist.org/packages/jojoee/leo-profanity)
- [x] Python on [pypi.org/project/leoprofanity](https://pypi.org/project/leoprofanity)
- [ ] Java on [Maven](https://maven.apache.org/)
- [ ] Wordpress on [wordpress.org](https://wordpress.org/)

## Reference
- Inspired by [jwils0n/profanity-filter](https://github.com/jwils0n/profanity-filter)
- Algorithm / Discussion
  - ["similar-like" symbol to alphabet](http://stackoverflow.com/questions/24515/bad-words-filter#answer-24615)
  - [Replace Bad words using Regex](http://stackoverflow.com/questions/3342011/replace-bad-words-using-regex)
  - [Clbuttic](http://www.computerhope.com/jargon/c/clbuttic.htm)
  - [The Clbuttic Mistake](http://thedailywtf.com/articles/The-Clbuttic-Mistake-)
  - [The Clbuttic Mistake: When obscenity filters go wrong](http://www.telegraph.co.uk/news/newstopics/howaboutthat/2667634/The-Clbuttic-Mistake-When-obscenity-filters-go-wrong.html)
  - [Obscenity Filters: Bad Idea, or Incredibly Intercoursing Bad Idea?](https://blog.codinghorror.com/obscenity-filters-bad-idea-or-incredibly-intercoursing-bad-idea/)
  - [How do you implement a good profanity filter?](http://stackoverflow.com/questions/273516/how-do-you-implement-a-good-profanity-filter)
  - [The Untold History of Toontown’s SpeedChat (or BlockChattm from Disney finally arrives)](http://habitatchronicles.com/2007/03/the-untold-history-of-toontowns-speedchat-or-blockchattm-from-disney-finally-arrives/)
  - [Profanity Filter Performance in Java](http://softwareengineering.stackexchange.com/questions/91177/profanity-filter-performance-in-java)
- Resource bad-word list
  - [Bad words list (458 words) by Alejandro U. Alvarez](https://urbanoalvarez.es/blog/2008/04/04/bad-words-list/)
  - DansGuardian - [dansguardian.org](http://dansguardian.org/), [DansGuardian Phraselists](http://contentfilter.futuragts.com/phraselists/)
  - [Seven dirty words](https://en.wikipedia.org/wiki/Seven_dirty_words)
  - [Shutterstock](https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words)
  - [MauriceButler/badwords](https://github.com/MauriceButler/badwords)
  - http://www.cs.cmu.edu/~biglou/resources/bad-words.txt
- Tool
  - [RegExr](http://regexr.com/)
