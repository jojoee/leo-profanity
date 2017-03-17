/* global describe, before, it */
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
    // empty string
    expect(filter.check('')).to.be.false;

    // no bad word
    expect(filter.check('I have 2 eyes')).to.be.false;

    // normal case
    expect(filter.check('I have boob, etc.')).to.be.true;

    // first & last
    expect(filter.check('2g1c')).to.be.true;
    expect(filter.check('zoophilia')).to.be.true;
    expect(filter.check('lorem 2g1c ipsum')).to.be.true;
    expect(filter.check('lorem zoophilia ipsum')).to.be.true;

    // check case sensitive
    expect(filter.check('I have BoOb')).to.be.true;

    // check comma and dot
    expect(filter.check('I have BoOb,')).to.be.true;
    expect(filter.check('I have BoOb.')).to.be.true;

    // check multi occurrence
    expect(filter.check('I have boob,boob, ass, and etc.')).to.be.true;

    // should not detect unspaced-word
    expect(filter.check('Buy classic watches online')).to.be.false;
  });

  it('clean', function() {
    // empty string
    expect(filter.clean('')).to.equal('');

    // no bad word
    expect(filter.clean('I have 2 eyes')).to.equal('I have 2 eyes');

    // normal case
    expect(filter.clean('I have boob, etc.')).to.equal('I have ****, etc.');

    // first & last
    expect(filter.clean('2g1c')).to.equal('****');
    expect(filter.clean('zoophilia')).to.equal('*********');
    expect(filter.clean('lorem 2g1c ipsum')).to.equal('lorem **** ipsum');
    expect(filter.clean('lorem zoophilia ipsum')).to.equal('lorem ********* ipsum');

    // check case sensitive
    expect(filter.clean('I have BoOb')).to.equal('I have ****');

    // separated by comma and dot
    expect(filter.clean('I have BoOb,')).to.equal('I have ****,');
    expect(filter.clean('I have BoOb.')).to.equal('I have ****.');

    // check multi occurrence
    expect(filter.clean('I have boob,boob, ass, and etc.')).to.equal('I have ****,****, ***, and etc.');

    // should not detect unspaced-word
    expect(filter.clean('Buy classic watches online')).to.equal('Buy classic watches online');

    // clean with custom replacement-character
    expect(filter.clean('I have boob', '+')).to.equal('I have ++++');

    // with multi space
    expect(filter.clean('I  hav   ,e BoOb,  ')).to.equal('I  hav   ,e ****,  ');
    expect(filter.clean(',I h  a.   v e BoOb.')).to.equal(',I h  a.   v e ****.');
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

  it('reset', function() {
    // reset
    filter.reset();

    // prepare data to test by adding new 2 bad words
    var numberOfCurrentWords = filter.list().length;
    filter.add(['badword1', 'badword2']);
    expect(filter.list().length).to.equal(numberOfCurrentWords + 2);

    // reset
    filter.reset();
    expect(filter.list().length).to.equal(numberOfCurrentWords);
  });

  it('clearList', function() {
    filter.clearList();
    expect(filter.list()).to.be.empty;
  });
});
