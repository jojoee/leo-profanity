/**
 * LeoProfanity
 *
 * @constructor
 */
const LeoProfanity = {
  /** @type {Object.<string, Array.string>} */
  wordDictionary: {},

  /** @type {Array.string} */
  words: [],

  /** @type {Set<string>} Internal Set for O(1) lookups */
  _wordsSet: new Set(),

  /** @type {Set<string>} Whitelist of words to exclude from filtering */
  _whitelist: new Set(),

  /**
   * Sync the internal Set with the words array
   *
   * @private
   */
  _syncSet: function () {
    this._wordsSet = new Set(this.words);
  },

  /**
   * Remove word from the list
   *
   * @private
   * @param {string} str - word
   */
  removeWord: function (str) {
    const index = this.words.indexOf(str);

    if (index !== -1) {
      this.words.splice(index, 1);
      this._syncSet();
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
      this._syncSet();
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
    let replacementWord = '';

    for (let i = 0; i < n; i++) {
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
    return str.toLowerCase().replace(/\.|,/g, ' ');
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

    const sanitizedStr = this.sanitize(str);
    // convert into array and remove white space
    // add default returned value for some cases (e.g. "." will returns null)
    const strs = sanitizedStr.match(/[^ ]+/g) || [];

    // Use Set for O(1) lookup, skip whitelisted words
    for (const word of strs) {
      if (this._wordsSet.has(word) && !this._whitelist.has(word)) return true;
    }

    return false;
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

    const sanitizedStr = this.sanitize(str);
    // split by whitespace (keep delimiter)
    // (cause comma and dot already replaced by whitespace)
    const sanitizedArr = sanitizedStr.split(/(\s)/);
    // split by whitespace, comma and dot (keep delimiter)
    const resultArr = str.split(/(\s|,|\.)/);

    // loop through given string, skip whitelisted words
    const badWords = [];
    sanitizedArr.forEach((item, index) => {
      if (this._wordsSet.has(item) && !this._whitelist.has(item)) {
        const replacementWord = item.slice(0, nbLetters) + this.getReplacementWord(replaceKey, item.length - nbLetters);
        badWords.push(resultArr[index]);
        resultArr[index] = replacementWord;
      }
    });

    // combine it
    const result = resultArr.join('');

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
   * // using options object
   * // output: I have bo++
   * filter.clean('I have boob', { replaceKey: '+', nbLetters: 2 });
   *
   * @public
   * @param {string} str
   * @param {string|Object} [replaceKeyOrOptions=*] one character or options object
   * @param {string} [replaceKeyOrOptions.replaceKey=*] replacement character
   * @param {number} [replaceKeyOrOptions.nbLetters=0] letters to keep from beginning
   * @param {number} [nbLetters=0] number of ignoring letters from the beginning
   * @returns {string}
   */
  clean: function (str, replaceKeyOrOptions, nbLetters) {
    if (!str) return '';

    let replaceKey = '*';
    let letters = 0;

    // Support both: clean(str, replaceKey, nbLetters) and clean(str, { replaceKey, nbLetters })
    if (typeof replaceKeyOrOptions === 'object' && replaceKeyOrOptions !== null) {
      replaceKey = replaceKeyOrOptions.replaceKey || '*';
      letters = replaceKeyOrOptions.nbLetters || 0;
    } else {
      replaceKey = replaceKeyOrOptions || '*';
      letters = nbLetters || 0;
    }

    return this.proceed(str, replaceKey, letters)[0];
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
    if (typeof data === 'string') {
      this.addWord(data);
    } else if (data.constructor === Array) {
      data.forEach((word) => {
        this.addWord(word);
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
    if (typeof data === 'string') {
      this.removeWord(data);
    } else if (data.constructor === Array) {
      data.forEach((word) => {
        this.removeWord(word);
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
    this._syncSet();

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
    this.words = JSON.parse(JSON.stringify(this.getDictionary(name)));
    this._syncSet();
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
    delete this.wordDictionary[name];

    return this;
  },

  /**
   * Add word(s) to whitelist (words that should not be filtered)
   *
   * @example
   * // whitelist a word
   * filter.addWhitelist('classic');
   *
   * // whitelist multiple words
   * filter.addWhitelist(['classic', 'assess']);
   *
   * @public
   * @param {string|Array.string} data
   * @returns this for chaining
   */
  addWhitelist: function (data) {
    if (typeof data === 'string') {
      this._whitelist.add(data.toLowerCase());
    } else if (Array.isArray(data)) {
      data.forEach((word) => {
        this._whitelist.add(word.toLowerCase());
      });
    }

    return this;
  },

  /**
   * Remove word(s) from whitelist
   *
   * @example
   * // remove from whitelist
   * filter.removeWhitelist('classic');
   *
   * // remove multiple words
   * filter.removeWhitelist(['classic', 'assess']);
   *
   * @public
   * @param {string|Array.string} data
   * @returns this for chaining
   */
  removeWhitelist: function (data) {
    if (typeof data === 'string') {
      this._whitelist.delete(data.toLowerCase());
    } else if (Array.isArray(data)) {
      data.forEach((word) => {
        this._whitelist.delete(word.toLowerCase());
      });
    }

    return this;
  },

  /**
   * Clear all words from whitelist
   *
   * @example
   * filter.clearWhitelist();
   *
   * @public
   * @returns this for chaining
   */
  clearWhitelist: function () {
    this._whitelist.clear();

    return this;
  },

  /**
   * Get all whitelisted words
   *
   * @example
   * filter.getWhitelist();
   *
   * @public
   * @returns {Array.string}
   */
  getWhitelist: function () {
    return Array.from(this._whitelist);
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
  LeoProfanity._syncSet();

  module.exports = LeoProfanity;
  exports.default = LeoProfanity;
}
