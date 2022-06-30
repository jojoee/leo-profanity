var util = require('./module/Util')
var wordDictionary = [];
wordDictionary['en'] = require('../dictionary/default.json');

// try to import optional dictionaries
try { wordDictionary['fr'] = require('french-badwords-list').array; } catch (e) {}
try { wordDictionary['ru'] = require('russian-bad-words').flatWords; } catch (e) {}

var words = util.clone(wordDictionary['en'])

/**
 * LeoProfanity
 */
var LeoProfanity = {

  /**
   * Remove word from the list
   * (private)
   *
   * @param {string} str
   */
  removeWord: function (str) {
    var index = words.indexOf(str);

    if (index !== -1) {
      words.splice(index, 1);
    }

    return this;
  },

  /**
   * Add word into the list
   * (private)
   *
   * @param {string} str
   */
  addWord: function (str) {
    if (words.indexOf(str) === -1) {
      words.push(str);
    }

    return this;
  },

  /**
   * Return replacement word from key
   * (private)
   *
   * @example
   * getReplacementWord('*', 3)
   * return '***'
   *
   * @example
   * getReplacementWord('-', 4)
   * return '----'
   *
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
   * (private)
   *
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
   * Return current profanity words
   * (public)
   *
   * @returns {Array.string}
   */
  list: function () {
    return words;
  },

  /**
   * Check the string contain profanity words or not
   * Approach, to make it fast ASAP
   * (public)
   * 
   * @see http://stackoverflow.com/questions/26425637/javascript-split-string-with-white-space
   * @see http://stackoverflow.com/questions/6116474/how-to-find-if-an-array-contains-a-specific-string-in-javascript-jquery
   * @see http://stackoverflow.com/questions/9141951/splitting-string-by-whitespace-without-empty-elements
   *
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
    strs = str.match(/[^ ]+/g) || [];
    while (!isFound && i <= words.length - 1) {
      if (strs.includes(words[i])) isFound = true;
      i++;
    }

    return isFound;
  },

  /**
   * Internal proceeding method
   * (private)
   *
   * @todo improve algorithm
   * @see http://stackoverflow.com/questions/26425637/javascript-split-string-with-white-space
   *
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

    var sanitizedStr = this.sanitize(originalString);
    // split by whitespace (keep delimiter)
    // (cause comma and dot already replaced by whitespace)
    var sanitizedArr = sanitizedStr.split(/(\s)/);
    // split by whitespace, comma and dot (keep delimiter)
    var resultArr = result.split(/(\s|,|\.)/);

    // loop through given string
    var badWords = [];
    sanitizedArr.forEach(function (item, index) {
      if (words.includes(item)) {
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
   * (public)
   * 
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
   * (public)
   * 
   * @param {string} str
   * @returns {Array.string}
   */
  badWordsUsed: function (str) {
    if (!str) return [];
    return this.proceed(str, '*')[1];
  },

  /**
   * Add word to the list
   * (public)
   * 
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
   * (public)
   * 
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
   * (public)
   */
  reset: function () {
    this.loadDictionary('en');
    return this;
  },

  /**
   * Clear word list
   * (public)
   * 
   */
  clearList: function () {
    words = [];

    return this;
  },

  /**
   * Return word list from dictionary
   * (public)
   *
   * @param {string} [name=en] dictionary name
   * @returns {Array.string}
   */
  getDictionary: function (name = 'en') {
    name = (name in wordDictionary) ? name : 'en';
    return wordDictionary[name]
  },

  /**
   * Add dictionary
   * TODO: complete it
   *
   * @param {string} name
   * @param {Array.string} data
   */
  addDictionary: function (name, data) {

  },

  /**
   * Load word list from dictionary to using in the filter
   * (public)
   *
   * @param {string} [name=en]
   */
  loadDictionary: function (name = 'en') {
    words = util.clone(this.getDictionary(name))
  },
};

module.exports = LeoProfanity;
