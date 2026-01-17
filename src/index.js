// LeoProfanity - Profanity filter library
const LeoProfanity = {
  wordDictionary: {},
  words: [],
  _wordsSet: new Set(), // Internal Set for O(1) lookups
  _whitelist: new Set(), // Words to exclude from filtering

  // Sync the internal Set with the words array (private)
  _syncSet: function () {
    this._wordsSet = new Set(this.words)
  },

  // Remove word from the list (private)
  removeWord: function (str) {
    const index = this.words.indexOf(str)

    if (index !== -1) {
      this.words.splice(index, 1)
      this._syncSet()
    }

    return this
  },

  // Add word into the list (private)
  addWord: function (str) {
    if (this.words.indexOf(str) === -1) {
      this.words.push(str)
      this._syncSet()
    }

    return this
  },

  // Return replacement word from key (private)
  // e.g. getReplacementWord('*', 3) => '***'
  getReplacementWord: function (key, n) {
    let replacementWord = ''

    for (let i = 0; i < n; i++) {
      replacementWord += key
    }

    return replacementWord
  },

  // Sanitize string: lowercase + replace comma/dot with space (private)
  sanitize: function (str) {
    return str.toLowerCase().replace(/\.|,/g, ' ')
  },

  // Return all current profanity words
  list: function () {
    return this.words
  },

  // Check if string contains profanity words
  check: function (str) {
    if (!str) return false

    const sanitizedStr = this.sanitize(str)
    // Convert into array and remove whitespace
    // Add default value for edge cases (e.g. "." returns null)
    const strs = sanitizedStr.match(/[^ ]+/g) || []

    // Use Set for O(1) lookup, skip whitelisted words
    for (const word of strs) {
      if (this._wordsSet.has(word) && !this._whitelist.has(word)) return true
    }

    return false
  },

  // Internal processing method (private)
  // TODO: improve algorithm
  proceed: function (str, replaceKey, nbLetters) {
    if (!str) return ''
    if (typeof replaceKey === 'undefined') replaceKey = '*'
    if (typeof nbLetters === 'undefined') nbLetters = 0

    const sanitizedStr = this.sanitize(str)
    // Split by whitespace (keep delimiter)
    // Comma and dot already replaced by whitespace
    const sanitizedArr = sanitizedStr.split(/(\s)/)
    // Split by whitespace, comma and dot (keep delimiter)
    const resultArr = str.split(/(\s|,|\.)/)

    // Loop through given string, skip whitelisted words
    const badWords = []
    sanitizedArr.forEach((item, index) => {
      if (this._wordsSet.has(item) && !this._whitelist.has(item)) {
        const replacementWord = item.slice(0, nbLetters) + this.getReplacementWord(replaceKey, item.length - nbLetters)
        badWords.push(resultArr[index])
        resultArr[index] = replacementWord
      }
    })

    const result = resultArr.join('')

    return [result, badWords]
  },

  // Replace profanity words in string
  // Supports: clean(str, replaceKey, nbLetters) or clean(str, { replaceKey, nbLetters })
  clean: function (str, replaceKeyOrOptions, nbLetters) {
    if (!str) return ''

    let replaceKey = '*'
    let letters = 0

    if (typeof replaceKeyOrOptions === 'object' && replaceKeyOrOptions !== null) {
      replaceKey = replaceKeyOrOptions.replaceKey || '*'
      letters = replaceKeyOrOptions.nbLetters || 0
    } else {
      replaceKey = replaceKeyOrOptions || '*'
      letters = nbLetters || 0
    }

    return this.proceed(str, replaceKey, letters)[0]
  },

  // Get list of bad words found in string
  badWordsUsed: function (str) {
    if (!str) return []
    return this.proceed(str, '*')[1]
  },

  // Add word(s) to the profanity list
  add: function (data) {
    if (typeof data === 'string') {
      this.addWord(data)
    } else if (data.constructor === Array) {
      data.forEach((word) => {
        this.addWord(word)
      })
    }

    return this
  },

  // Remove word(s) from the profanity list
  remove: function (data) {
    if (typeof data === 'string') {
      this.removeWord(data)
    } else if (data.constructor === Array) {
      data.forEach((word) => {
        this.removeWord(word)
      })
    }

    return this
  },

  // Reset word list to default English dictionary
  reset: function () {
    this.loadDictionary('en')
    return this
  },

  // Clear all words from the list
  clearList: function () {
    this.words = []
    this._syncSet()

    return this
  },

  // Get word list from dictionary by name
  getDictionary: function (name = 'en') {
    name = (name in this.wordDictionary) ? name : 'en'
    return this.wordDictionary[name]
  },

  // Load word list from dictionary
  loadDictionary: function (name = 'en') {
    this.words = JSON.parse(JSON.stringify(this.getDictionary(name)))
    this._syncSet()
  },

  // Add or create a new dictionary
  addDictionary: function (name, words) {
    this.wordDictionary[name] = words
    this.loadDictionary(name)

    return this
  },

  // Remove a dictionary
  removeDictionary: function (name) {
    delete this.wordDictionary[name]

    return this
  },

  // Add word(s) to whitelist (words that should not be filtered)
  addWhitelist: function (data) {
    if (typeof data === 'string') {
      this._whitelist.add(data.toLowerCase())
    } else if (Array.isArray(data)) {
      data.forEach((word) => {
        this._whitelist.add(word.toLowerCase())
      })
    }

    return this
  },

  // Remove word(s) from whitelist
  removeWhitelist: function (data) {
    if (typeof data === 'string') {
      this._whitelist.delete(data.toLowerCase())
    } else if (Array.isArray(data)) {
      data.forEach((word) => {
        this._whitelist.delete(word.toLowerCase())
      })
    }

    return this
  },

  // Clear all words from whitelist
  clearWhitelist: function () {
    this._whitelist.clear()

    return this
  },

  // Get all whitelisted words
  getWhitelist: function () {
    return Array.from(this._whitelist)
  }
}

if (typeof module !== 'undefined' && module.exports != null) {
  LeoProfanity.wordDictionary.en = require('../dictionary/default.json')

  // Try to import optional dictionaries
  try { LeoProfanity.wordDictionary.fr = require('french-badwords-list').array } catch (e) {}
  try { LeoProfanity.wordDictionary.ru = require('russian-bad-words').flatWords } catch (e) {}

  LeoProfanity.words = JSON.parse(JSON.stringify(LeoProfanity.wordDictionary ? LeoProfanity.wordDictionary.en : []))
  LeoProfanity._syncSet()

  module.exports = LeoProfanity
  exports.default = LeoProfanity
}
