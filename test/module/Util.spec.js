var expect = require('chai').expect;
var util = require('../../src/module/Util');

describe('clone', function () {
  it('should clone the object', function () {
    var src = [1, 'two', {}]
    var result = util.clone(src)

    expect(src).to.not.equal(result)
    expect(src).to.eql(result)
  });
});
