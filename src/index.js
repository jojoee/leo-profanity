var wordDictionary = [];
wordDictionary['default'] = require('../dictionary/default.json');
var words = JSON.parse(JSON.stringify(wordDictionary['default']));

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
  removeWord: function(str) {
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
  addWord: function(str) {
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
  getReplacementWord: function(key, n) {
    var i = 0;
    var replacementWord = '';

    for (i = 0; i < n; i++) {
      replacementWord += key;
    }

    return replacementWord;
  },

  /**
   * Get word dictionary
   * Now, we only have default dictionary
   * (private)
   *
   * @param {string} dictionaryName
   * @returns {Array.string}
   */
  getDictionary: function(dictionaryName) {
    var result = [];
    if (wordDictionary[dictionaryName] !== 'undefined') {
      result = JSON.parse(JSON.stringify(wordDictionary[dictionaryName]));
    }

    return result;
  },

  /**
   * Return all profanity words
   *
   * @returns {Array.string}
   */
  list: function() {
    return words;
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
  sanitize: function(str) {
    str = str.toLowerCase();
    /* eslint-disable */
    str = str.replace(/\.|,/g, ' ');

    return str;
  },

  /**
   * Check the string contain profanity words or not
   * Approach, to make it fast ASAP
   *
   * @see http://stackoverflow.com/questions/26425637/javascript-split-string-with-white-space
   * @see http://stackoverflow.com/questions/6116474/how-to-find-if-an-array-contains-a-specific-string-in-javascript-jquery
   * @see http://stackoverflow.com/questions/9141951/splitting-string-by-whitespace-without-empty-elements
   *
   * @param {string} str
   * @returns {boolean}
   */
  check: function(str) {
    if (!str) return false;

    var i = 0;
    var isFound = false;

    str = this.sanitize(str);
    // convert into array and remove white space
    strs = str.match(/[^ ]+/g);
    while (!isFound && i <= words.length - 1) {
      if (strs.includes(words[i])) isFound = true;
      i++;
    }

    return isFound;
  },

  /**
   * Replace profanity words
   *
   * @todo improve algorithm
   * @see http://stackoverflow.com/questions/26425637/javascript-split-string-with-white-space
   *
   * @param {string} str
   * @param {string} [replaceKey=*] one character only
   * @returns {string}
   */
  clean: function(str, replaceKey) {
    if (!str) return '';
    if (typeof replaceKey === 'undefined') replaceKey = '*';

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
    sanitizedArr.forEach(function(item, index) {
      if (words.includes(item)) {
        var replacementWord = self.getReplacementWord(replaceKey, item.length);
        resultArr[index] = replacementWord;
      }
    });

    // combine it
    result = resultArr.join('');

    return result;
  },

  /**
   * Add word to the list
   *
   * @param {string|Array.string} data
   */
  add: function(data) {
    var self = this;

    if (typeof data === 'string') {
      self.addWord(data);
    } else if (data.constructor === Array) {
      data.forEach(function(word) {
        self.addWord(word);
      });
    }

    return this;
  },

  /**
   * Remove word from the list
   *
   * @param {string|Array.string} data
   */
  remove: function(data) {
    var self = this;

    if (typeof data === 'string') {
      self.removeWord(data);
    } else if (data.constructor === Array) {
      data.forEach(function(word) {
        self.removeWord(word);
      });
    }

    return this;
  },

  /**
   * Reset word list by using default dictionary (also remove word that manually add)
   */
  reset: function() {
    words = this.getDictionary('default');

    return this;
  },

  /**
   * Clear word list
   */
  clearList: function() {
    words = [];

    return this;
  },
};

module.exports = LeoProfanity;
