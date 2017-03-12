/**
 * LeoProfanity
 */
var Util = {

  /**
   * Get all occurrences of needle in string
   * (unused)
   *
   * @see http://stackoverflow.com/questions/3410464/how-to-find-indices-of-all-occurrences-of-one-string-in-another-in-javascript
   *
   * @example
   * getIndicesOf("le", "I learned to play the Ukulele in Lebanon.");
   * return [2, 25, 27, 33]
   *
   * @param {string} needle
   * @param {string} str lower string
   * @param {number} startIndex
   * @returns {Array.number}
   */
  getIndicesOf: function(needle, str, startIndex) {
    if (typeof startIndex === 'undefined') startIndex = 0;

    var index,
      indices = [];

    while ((index = str.indexOf(needle, startIndex)) > -1) {
      indices.push(index);
      startIndex = index + needle.length;
    }

    return indices;
  },
}

module.exports = Util;
