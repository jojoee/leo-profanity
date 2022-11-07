/**
 * LeoProfanity
 *
 * @constructor
 */
var LeoProfanity = {
  /** @type {Object.<string, Array.string>} */
  wordDictionary: {},

  /** @type {Array.string} */
  words: [],

  /**
   * Remove word from the list
   *
   * @private
   * @param {string} str - word
   */
  removeWord: function (str) {
    var index = this.words.indexOf(str);

    if (index !== -1) {
      this.words.splice(index, 1);
    }

    return this;
  },

  /**
   * Add word into the list
   *
   * @private
   * @param {string} str - word
   */
  addWord: function (str) {
    if (this.words.indexOf(str) === -1) {
      this.words.push(str);
    }

    return this;
  },

  /**
   * Return replacement word from key
   *
   * @example
   * // output: '***'
   * getReplacementWord('*', 3)
   *
   * // output: '----'
   * getReplacementWord('-', 4)
   *
   * @private
   * @param {string} key
   * @param {number} n
   * @returns string
   */
  getReplacementWord: function (key, n) {
    var i = 0;
    var replacementWord = '';

    for (i = 0; i < n; i++) {
      replacementWord += key;
    }

    return replacementWord;
  },

  /**
   * Sanitize string for this project
   * 1. Convert to lower case
   * 2. Replace comma and dot with space
   *
   * @private
   * @param {string} str
   * @returns {string}
   */
  sanitize: function (str) {
    str = str.toLowerCase();
    /* eslint-disable */
    str = str.replace(/\.|,/g, ' ');

    return str;
  },

  /**
   * Return all current profanity words
   *
   * @example
   * filter.list();
   * 
   * @public
   * @returns {Array.string}
   */
  list: function () {
    return this.words;
  },

  /**
   * Check the string contain profanity words or not
   * Approach, to make it fast ASAP.
   * Check out more cases on "clean" method
   * 
   * @example
   * // output: true
   * filter.check('I have boob');
   *
   * @see http://stackoverflow.com/questions/26425637/javascript-split-string-with-white-space
   * @see http://stackoverflow.com/questions/6116474/how-to-find-if-an-array-contains-a-specific-string-in-javascript-jquery
   * @see http://stackoverflow.com/questions/9141951/splitting-string-by-whitespace-without-empty-elements
   * @public
   * @param {string} str
   * @returns {boolean}
   */
  check: function (str) {
    if (!str) return false;

    var i = 0;
    var isFound = false;

    str = this.sanitize(str);
    // convert into array and remove white space
    // add default returned value for some cases (e.g. "." will returns null)
    var strs = str.match(/[^ ]+/g) || [];
    while (!isFound && i <= this.words.length - 1) {
      if (strs.includes(this.words[i])) isFound = true;
      i++;
    }

    return isFound;
  },

  /**
   * Internal proceeding method
   *
   * @todo improve algorithm
   * @see http://stackoverflow.com/questions/26425637/javascript-split-string-with-white-space
   * @private
   * @param {string} str
   * @param {string} [replaceKey=*] one character only
   * @param {string} [nbLetters=0] number of ignoring letters from the beginning
   * @returns {string}
   */
  proceed: function (str, replaceKey, nbLetters) {
    if (!str) return '';
    if (typeof replaceKey === 'undefined') replaceKey = '*';
    if (typeof nbLetters === 'undefined') nbLetters = 0;

    var self = this;
    var originalString = str;
    var result = str;

    var sanitizedStr = self.sanitize(originalString);
    // split by whitespace (keep delimiter)
    // (cause comma and dot already replaced by whitespace)
    var sanitizedArr = sanitizedStr.split(/(\s)/);
    // split by whitespace, comma and dot (keep delimiter)
    var resultArr = result.split(/(\s|,|\.)/);

    // loop through given string
    var badWords = [];
    sanitizedArr.forEach(function (item, index) {
      if (self.words.includes(item)) {
        var replacementWord = item.slice(0, nbLetters) + self.getReplacementWord(replaceKey, item.length - nbLetters);
        badWords.push(resultArr[index]);
        resultArr[index] = replacementWord;
      }
    });

    // combine it
    result = resultArr.join('');

    return [result, badWords];
  },

  /**
   * Replace profanity words
   * 
   * @example
   * // no bad word
   * // output: I have 2 eyes
   * filter.clean('I have 2 eyes');
   * 
   * // normal case
   * // output: I have ****, etc.
   * filter.clean('I have boob, etc.');
   * 
   * // case sensitive
   * // output: I have ****
   * filter.clean('I have BoOb');
   * 
   * // separated by comma and dot
   * // output: I have ****.
   * filter.clean('I have BoOb.');
   * 
   * // multi occurrence
   * // output: I have ****,****, ***, and etc.
   * filter.clean('I have boob,boob, ass, and etc.');
   * 
   * // should not detect unspaced-word
   * // output: Buy classic watches online
   * filter.clean('Buy classic watches online');
   * 
   * // clean with custom replacement-character
   * // output: I have ++++
   * filter.clean('I have boob', '+');
   * 
   * // support "clear letter" in the beginning of the word
   * // output: I have bo++
   * filter.clean('I have boob', '+', 2);
   * 
   * @public
   * @param {string} str
   * @param {string} [replaceKey=*] one character only
   * @param {string} [nbLetters=0] number of ignoring letters from the beginning
   * @returns {string}
   */
  clean: function (str, replaceKey, nbLetters) {
    if (!str) return '';
    if (typeof replaceKey === 'undefined') replaceKey = '*';
    if (typeof nbLetters === 'undefined') nbLetters = 0;
    return this.proceed(str, replaceKey, nbLetters)[0];
  },

  /**
   * Get list of used bad/profanity words
   * 
   * @example
   * // should return original string if string not contain profanity word
   * // output: []
   * filter.badWordsUsed('I have 2 eyes')
   * 
   * // should found profanity word
   * // output: ['zoophilia']
   * filter.badWordsUsed('lorem zoophilia ipsum')
   * 
   * // should detect case sensitive
   * // output: ['BoOb']
   * filter.badWordsUsed('I have BoOb')
   * 
   * // should detect multi occurrence
   * // output: ['boob', 'boob', 'ass']
   * filter.badWordsUsed('I have boob,boob, ass, and etc.')
   * 
   * // should not detect unspaced-word
   * // output: []
   * filter.badWordsUsed('Buy classic watches online')
   * 
   * // should detect multi-length-space and multi-space
   * // output: ['BoOb']
   * filter.badWordsUsed(',I h  a.   v e BoOb.')
   *
   * @public
   * @param {string} str
   * @returns {Array.string}
   */
  badWordsUsed: function (str) {
    if (!str) return [];
    return this.proceed(str, '*')[1];
  },

  /**
   * Add word to the list
   * 
   * @example
   * // add word
   * filter.add('b00b');
   * 
   * // add word's array
   * // check duplication automatically
   * filter.add(['b00b', 'b@@b']);
   * 
   * @public
   * @param {string|Array.string} data
   */
  add: function (data) {
    var self = this;

    if (typeof data === 'string') {
      self.addWord(data);
    } else if (data.constructor === Array) {
      data.forEach(function (word) {
        self.addWord(word);
      });
    }

    return this;
  },

  /**
   * Remove word from the list
   * 
   * @example
   * // remove word
   * filter.remove('b00b');
   * 
   * // remove word's array
   * filter.remove(['b00b', 'b@@b']);
   *
   * @public
   * @param {string|Array.string} data
   */
  remove: function (data) {
    var self = this;

    if (typeof data === 'string') {
      self.removeWord(data);
    } else if (data.constructor === Array) {
      data.forEach(function (word) {
        self.removeWord(word);
      });
    }

    return this;
  },

  /**
   * Reset word list by using en dictionary
   * (also remove word that manually add)
   * 
   * @public
   */
  reset: function () {
    this.loadDictionary('en');
    return this;
  },

  /**
   * Clear all words in the list
   *
   * @public
   */
  clearList: function () {
    this.words = [];

    return this;
  },

  /**
   * Return word list from dictionary
   *
   * @example
   * // returns words in en dictionary
   * filter.getDictionary();
   * 
   * // returns words in fr dictionary
   * filter.getDictionary('fr');
   * 
   * @public
   * @param {string} [name=en] dictionary name
   * @returns {Array.string}
   */
  getDictionary: function (name = 'en') {
    name = (name in this.wordDictionary) ? name : 'en';
    return this.wordDictionary[name]
  },

  /**
   * Load word list from dictionary to using in the filter
   *
   * @example
   * // replace current dictionary with the french one
   * filter.loadDictionary('fr');
   * 
   * // replace dictionary with the default one (same as filter.reset())
   * filter.loadDictionary();
   *
   * @public
   * @param {string} [name=en]
   */
  loadDictionary: function (name = 'en') {
    // clone
    this.words = JSON.parse(JSON.stringify(this.getDictionary(name)))
  },

  /**
   * Add or create dictionary
   *
   * @example
   * // create new dictionary
   * filter.addDictionary('th', ['หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า'])
   *
   * @public
   * @param {string} name dictionary name
   * @param {Array.string} words dictionary words
   */
  addDictionary: function (name, words) {
    this.wordDictionary[name] = words
    this.loadDictionary(name)

    return this;
  },

  /**
   * Remove dictionary
   *
   * @example
   * // remove dictionary
   * filter.removeDictionary('th')
   *
   * @public
   * @param {string} name dictionary name
   */
   removeDictionary: function (name) {
    delete this.wordDictionary[name]

    return this;
  },
};

if (typeof module !== 'undefined' && module.exports != null) {
  // constructor here
  LeoProfanity.wordDictionary['en'] = require('../dictionary/default.json');

  // try to import optional dictionaries
  try { LeoProfanity.wordDictionary['fr'] = require('french-badwords-list').array; } catch (e) {}
  try { LeoProfanity.wordDictionary['ru'] = require('russian-bad-words').flatWords; } catch (e) {}

  /** @type {Array.string} */
  LeoProfanity.words = JSON.parse(JSON.stringify(LeoProfanity.wordDictionary ? LeoProfanity.wordDictionary['en'] : []));

  module.exports = LeoProfanity
  exports.default = LeoProfanity
}
