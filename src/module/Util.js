/**
 * LeoProfanity
 *
 * @constructor
 */
var Util = {

  /**
   * Quick clone object
   *
   * @private
   * @param {Object} obj
   * @returns {Object}
   */
  clone: function (obj) {
    return JSON.parse(JSON.stringify(obj))
  }
}

module.exports = Util;
