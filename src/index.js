var fs = require('fs');
var words = JSON.parse(fs.readFileSync('./dictionary/default.json', 'utf8'));

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
   * @returns string
   */
  getReplacementWord(key, n) {
    var i = 0;
    var replacementWord = '';

    for (i = 0; i < n; i++) {
      replacementWord += key;
    }

    return replacementWord;
  },

  /**
   * Return all profanity words
   *
   * @returns {Array}
   */
  list: function() {
    return words;
  },

  /**
   * Check the string contain profanity words or not
   *
   * @todo update algorithm
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
   * @todo update algorithm
   *
   * @param {string} str
   * @param {string} [replaceKey=*]
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
   * @todo update algorithm
   * @see http://stackoverflow.com/questions/16747798/delete-duplicate-elements-from-an-array
   *
   * @param {string|array} data
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
   * @param {string|array} data
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
   * Clear word list
   */
  clearList: function() {
    words = [];
  }
};

module.exports = LeoProfanity;
