/* global describe, before, it */
var expect = require('chai').expect;
var util = require('../../src/module/Util');

describe('Util', function() {
  before(function() {

  });

  describe('getIndicesOf', function() {
    var key = 'le';

    it('should get array of index', function() {
      expect(util.getIndicesOf(key, 'I learned to play the Ukulele in Lebanon.')).to.eql([
        2,
        25,
        27,
      ]);
    });

    it('should start with given index', function() {
      expect(util.getIndicesOf(key, 'I learned to play the Ukulele in Lebanon.', 25)).to.eql([
        25,
        27,
      ]);
    });
  });
});
