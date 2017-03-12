var fs = require('fs');
var wordDictionary = [];
wordDictionary['default'] = JSON.parse(fs.readFileSync('./dictionary/default.json', 'utf8'));
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
   * Check the string contain profanity words or not
   *
   * @todo implement break
   *
   * @param {string} str
   * @returns {boolean}
   */
  check: function(str) {
    var result = false;

    // 1. convert to lower case
    str = str.toLowerCase();

    // 2. replace comma and dot with space
    /* eslint-disable */
    str = str.replace(/\.|,/g,'');

    words.forEach(function(word) {
      if (str.indexOf(word) !== -1) {
        result = true;
      }
    });

    return result;
  },

  /**
   * Replace profanity words
   *
   * @param {string} str
   * @param {string} [replaceKey=*] one character only
   * @returns {string}
   */
  clean: function(str, replaceKey) {
    if (typeof replaceKey === 'undefined') replaceKey = '*';

    var self = this;
    var originalString = str;
    var lowerString = str.toLowerCase();
    var outputString = str;

    words.forEach(function(word) {
      var wordLength = word.length;
      var replacementWord = self.getReplacementWord(replaceKey, wordLength)
      var index = lowerString.indexOf(word);

      // if still found profanity word
      while (index !== -1) {
        outputString = outputString.substr(0, index) + replacementWord + outputString.substr(index + wordLength);
        lowerString = outputString.toLowerCase();
        index = lowerString.indexOf(word);
      }
    });

    return outputString;
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
