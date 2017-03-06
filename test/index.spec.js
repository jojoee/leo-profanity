var expect = require('chai').expect;
var filter = require('../src/index.js');

describe('Profanity filter', function() {  
  before(function() {

  });

  it('list', function() {
    // it should contain 'boob'
    expect(filter.list()).to.include('boob');
  });

  it('check', function() {
    expect(filter.check('I have 2 eyes')).to.be.false;
    expect(filter.check('I have boob')).to.be.true;

    // check case sensitive
    expect(filter.check('I have BoOb')).to.be.true;

    // check comma and dot
    expect(filter.check('I have BoOb,')).to.be.true;
    expect(filter.check('I have BoOb.')).to.be.true;
  });

  it('clean', function() {
    // clean with default replacement-character
    expect(filter.clean('I have boob')).to.equal('I have ****');

    // clean with default custom replacement-character
    expect(filter.clean('I have boob', '+')).to.equal('I have ++++');

    // check multi occurrence
    expect(filter.clean('I have boob,boob, ass.')).to.equal('I have ****,****, ***.');
  })

  it('add', function() {
    // string
    filter.add('b00b');
    expect(filter.list()).to.include('b00b');

    // Array
    filter.add(['b@@b', 'b##b']);
    expect(filter.list()).to.include('b@@b');
    expect(filter.list()).to.include('b##b');

    // check duplication
    // it should remove duplication
    var numberOfCurrentWords = filter.list().length;
    filter.add(['b@@b', 'b##b']);
    expect(filter.list().length).to.equal(numberOfCurrentWords);
  });

  it('remove', function() {
    // string
    filter.remove('boob');
    expect(filter.list()).to.not.include('boob');

    // Array
    filter.remove(['boob', 'boobs']);
    expect(filter.list()).to.not.include('boob');
    expect(filter.list()).to.not.include('boobs');
  });

  it('clearList', function() {
    expect(filter.clearList()).to.be.empty;
  });
});
