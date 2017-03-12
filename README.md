# leo-profanity

[![Travis](https://img.shields.io/travis/jojoee/leo-profanity.svg)](https://travis-ci.org/jojoee/leo-profanity)
[![Codecov](https://img.shields.io/codecov/c/github/jojoee/leo-profanity.svg)](https://codecov.io/github/jojoee/leo-profanity)
[![Version - npm](https://img.shields.io/npm/v/leo-profanity.svg)](https://www.npmjs.com/package/leo-profanity)
[![License - npm](https://img.shields.io/npm/l/leo-profanity.svg)](http://opensource.org/licenses/MIT)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

Profanity filter, based on "Shutterstock" dictionary

## Installation

```
// npm
npm install leo-profanity

// Bower
bower install leo-profanity
// dictionary/default.json
```

## Example usage for npm

```javascript
var filter = require('leo-profanity');
```

### filter.list()

```javascript
// return all profanity words (Array.string)
filter.list();
```

### filter.check(string)

Check out mor example on [filter.clean](https://github.com/jojoee/leo-profanity#filtercleanstring-replacekey)

```javascript
// output: true
filter.clean('I have boob');
```

### filter.clean(string, [replaceKey=*])

```javascript
// no bad word
// output: I have 2 eyes
filter.clean('I have 2 eyes');

// normal case
// output: I have ****, etc.
filter.clean('I have boob, etc.');

// case sensitive
// output: I have ****
filter.clean('I have BoOb');

// separated by comma and dot
// output: I have ****.
filter.clean('I have BoOb.');

// multi occurrence
// output: I have ****,****, ***, and etc.
filter.clean('I have boob,boob, ass, and etc.');

// should not detect unspaced-word
// output: Buy classic watches online
filter.clean('Buy classic watches online');

// clean with custom replacement-character
// output: I have ++++
filter.clean('I have boob', '+');
```

### filter.add(string|Array.string)

```javascript
// add word
filter.add('b00b');

// add word's array
// check duplication automatically
filter.add(['b00b', 'b@@b']);
```

### filter.remove(string|Array.string)

```javascript
// remove word
filter.remove('b00b');

// remove word's array
filter.remove(['b00b', 'b@@b']);
```

### filter.reset()

Reset word list by using default dictionary (also remove word that manually add)

### filter.clearList()

Clear all profanity words

## Algorithm

This project decide to split it into 2 parts,  `Sanitize` and `Filter`
and these below is a interesting algorithms.

### Sanitize
```
Attempt 1 (1.1): convert all into lower string
Advantage:
  - simple
Disadvantage:
  - none

Attempt 2 (1.2): turn "similar-like" symbol to alphabet
e.g. convert `@` to `a`, `5` and `$` to `s`
Advantage:
  - simple + detect some trick word (e.g. @ss, b00b)
Disadvantage:
  - "false positive"
  - limit user imagination (user cannot play with word)
  e.g. joe@ssociallife.com
  e.g. user want to try something funny like "a$$a$$in"

Attempt 3 (1.3): replace `.` and `,` with space to separate words
in some sentence, people usually using `.` and `,` to connect / end the sentence
Advantage:
  - increase founding possibility
  e.g. I like a55,b00b
Disadvantage:
  - none
```

### Filter
```
Attempt 1 (2.1): split into array (or using regex, somehow)
using space to split it into array then check by profanity word list
Advantage:
  - simple
Disadvantage:
  - need proper list
  - some "false positive"
  e.g. Great tit (https://en.wikipedia.org/wiki/Great_tit)

Attempt 2 (2.2): filter word inside (with or without space)
detect all alphabet that contain "profanity word" (e.g. `thistextisfunnyboobsanda55`)
Advantage:
  - simple
  - can detect "un-spaced" profanity word
Disadvantage:
  - many "false positive"
  e.g. http://www.morewords.com/contains/ass/
  e.g. Clbuttic mistake (filter mistake)
```

Summary
- We don't know all methods that can produce profanity word
  (e.g. how many different ways can you enter a55 ?)
- There have a non-algorithm-based approach to achieve it (yet)
- People will always find a way to connect with each other
  (e.g. [Leet](https://en.wikipedia.org/wiki/Leet))

So, this project decide to go with 1.1, 1.3 and 2.1.
(*note - you can found other attempts in "Reference" section)

## TODO
- [x] `add` method
- [ ] Filter html syntax
- [ ] Support multi-language
- [x] Complete `clean` API
- [x] Increase code coverage percentage
- [x] Fix ESLint
- [ ] Demo page
- [ ] More word dictionary
- [ ] `setDictionary` function
- [ ] Encapsulate private function
- [ ] Order by alphabetical
- [ ] Order by length

## Other language / framework
- [ ] PHP on [packagist.org](packagist.org)
- [ ] Python on [PyPI](https://pypi.python.org/pypi)
- [ ] Java on [Maven](https://maven.apache.org/)
- [ ] Wordpress on [wordpress.org](https://wordpress.org/)

## Contribute
1. Fork the repo
2. Install Node.js and dependencies
3. Make a branch for your change and make your changes
4. Run `git add -A` to add your changes
5. Run `npm run commit` (don't use `git commit`)
6. Push your changes with `git push` then create Pull Request

## Contribute for owner

```
$ npm install -g semantic-release-cli
$ semantic-release-cli setup

Using above command to setup "semantic-release"
```

## Stats
[![NPM](https://nodei.co/npm/leo-profanity.png?downloads=true&stars=true)](https://nodei.co/npm/leo-profanity/)

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
