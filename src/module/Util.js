/**
 * LeoProfanity
 */
var Util = {
  /**
   * Quick clone object
   *
   * @param {Object} obj
   * @returns {Object}
   */
  clone: function (obj) {
    return JSON.parse(JSON.stringify(obj))
  }
}

module.exports = Util;
