/* eslint-disable no-unused-expressions */
const expect = require('chai').expect;
const filter = require('../src/index.js');
const enWordDictionary = require('../dictionary/default.json')

// optional dictionaries
const wordDictionary = {}
try { wordDictionary['fr'] = require('french-badwords-list').array; } catch (e) {}
try { wordDictionary['ru'] = require('russian-bad-words').flatWords; } catch (e) {}

describe('removeWord', function () {
  it('should remove word from the list', function () {
    filter.reset();
    const initialLength = filter.list().length;
    filter.removeWord('boob');
    expect(filter.list().length).to.equal(initialLength - 1);
    expect(filter.list()).to.not.include('boob');
  });

  it('should not fail if word does not exist', function () {
    filter.reset();
    const initialLength = filter.list().length;
    filter.removeWord('nonexistentword');
    expect(filter.list().length).to.equal(initialLength);
  });

  it('should return this for chaining', function () {
    filter.reset();
    const result = filter.removeWord('boob');
    expect(result).to.equal(filter);
  });
});

describe('addWord', function () {
  it('should add word to the list', function () {
    filter.reset();
    const initialLength = filter.list().length;
    filter.addWord('newbadword');
    expect(filter.list().length).to.equal(initialLength + 1);
    expect(filter.list()).to.include('newbadword');
  });

  it('should not add duplicate word', function () {
    filter.reset();
    filter.addWord('duplicateword');
    const lengthAfterFirst = filter.list().length;
    filter.addWord('duplicateword');
    expect(filter.list().length).to.equal(lengthAfterFirst);
  });

  it('should return this for chaining', function () {
    filter.reset();
    const result = filter.addWord('chaintest');
    expect(result).to.equal(filter);
  });
});

describe('getReplacementWord', function () {
  it('should return repeated character', function () {
    expect(filter.getReplacementWord('*', 3)).to.equal('***');
    expect(filter.getReplacementWord('-', 4)).to.equal('----');
    expect(filter.getReplacementWord('+', 5)).to.equal('+++++');
  });

  it('should return empty string for n=0', function () {
    expect(filter.getReplacementWord('*', 0)).to.equal('');
  });

  it('should return single character for n=1', function () {
    expect(filter.getReplacementWord('#', 1)).to.equal('#');
  });
});

describe('sanitize', function () {
  it('should convert to lowercase', function () {
    expect(filter.sanitize('HELLO')).to.equal('hello');
    expect(filter.sanitize('HeLLo WoRLD')).to.equal('hello world');
  });

  it('should replace dots with spaces', function () {
    expect(filter.sanitize('hello.world')).to.equal('hello world');
    expect(filter.sanitize('a.b.c')).to.equal('a b c');
  });

  it('should replace commas with spaces', function () {
    expect(filter.sanitize('hello,world')).to.equal('hello world');
    expect(filter.sanitize('a,b,c')).to.equal('a b c');
  });

  it('should handle mixed cases', function () {
    expect(filter.sanitize('Hello.World,Test')).to.equal('hello world test');
  });
});

describe('list', function () {
  it('should contain boob word', function () {
    expect(filter.list()).to.include('boob');
  });
});

describe('check', function () {
  it('should return false if param is empty string', function () {
    expect(filter.check('')).to.be.false;
  });

  it('should return false if string not contain profanity word', function () {
    expect(filter.check('I have 2 eyes')).to.be.false;
  });

  it('should return true if string contain profanity word', function () {
    // normal case
    expect(filter.check('I have boob, etc.')).to.be.true;

    // first & last
    expect(filter.check('2g1c')).to.be.true;
    expect(filter.check('zoophilia')).to.be.true;
    expect(filter.check('lorem 2g1c ipsum')).to.be.true;
    expect(filter.check('lorem zoophilia ipsum')).to.be.true;
  });

  it('should detect case sensitive', function () {
    expect(filter.check('I have BoOb')).to.be.true;
  });

  it('should detect dot and comma', function () {
    expect(filter.check('I have BoOb,')).to.be.true;
    expect(filter.check('I have BoOb.')).to.be.true;
  });

  it('should detect multi occurrence', function () {
    expect(filter.check('I have boob,boob, ass, and etc.')).to.be.true;
  });

  it('should not detect unspaced-word', function () {
    expect(filter.check('Buy classic watches online')).to.be.false;
  });

  // https://github.com/jojoee/leo-profanity/issues/10
  it('should not detect .', function () {
    expect(filter.check('.')).to.be.false;
  });
});

describe('proceed', function () {
  beforeEach(function () {
    filter.reset();
  });

  it('should return empty string for empty input', function () {
    expect(filter.proceed('')).to.equal('');
  });

  it('should return array with cleaned string and bad words', function () {
    const result = filter.proceed('I have boob');
    expect(result).to.be.an('array');
    expect(result[0]).to.equal('I have ****');
    expect(result[1]).to.deep.equal(['boob']);
  });

  it('should use default replaceKey of *', function () {
    const result = filter.proceed('I have boob');
    expect(result[0]).to.equal('I have ****');
  });

  it('should use custom replaceKey', function () {
    const result = filter.proceed('I have boob', '+');
    expect(result[0]).to.equal('I have ++++');
  });

  it('should preserve letters with nbLetters parameter', function () {
    const result = filter.proceed('I have boob', '*', 2);
    expect(result[0]).to.equal('I have bo**');
  });

  it('should return multiple bad words', function () {
    const result = filter.proceed('I have boob and ass');
    expect(result[1]).to.deep.equal(['boob', 'ass']);
  });
});

describe('clean', function () {
  it('should return empty string if param is empty string', function () {
    expect(filter.clean('')).to.equal('');
  });

  it('should return original string if string not contain profanity word', function () {
    expect(filter.clean('I have 2 eyes')).to.equal('I have 2 eyes');
  });

  it('should replace profanity word with *', function () {
    // normal case
    expect(filter.clean('I have boob, etc.')).to.equal('I have ****, etc.');

    // first & last
    expect(filter.clean('2g1c')).to.equal('****');
    expect(filter.clean('zoophilia')).to.equal('*********');
    expect(filter.clean('lorem 2g1c ipsum')).to.equal('lorem **** ipsum');
    expect(filter.clean('lorem zoophilia ipsum')).to.equal('lorem ********* ipsum');
  });

  it('should detect case sensitive', function () {
    expect(filter.clean('I have BoOb')).to.equal('I have ****');
  });

  it('should detect dot and comma', function () {
    expect(filter.clean('I have BoOb,')).to.equal('I have ****,');
    expect(filter.clean('I have BoOb.')).to.equal('I have ****.');
  });

  it('should detect multi occurrence', function () {
    expect(filter.clean('I have boob,boob, ass, and etc.')).to.equal('I have ****,****, ***, and etc.');
  });

  it('should not detect unspaced-word', function () {
    expect(filter.clean('Buy classic watches online')).to.equal('Buy classic watches online');
  });

  it('should replace profanity word with + (custom replacement-character)', function () {
    expect(filter.clean('I have boob', '+')).to.equal('I have ++++');
  });

  it('should detect multi-length-space and multi-space', function () {
    expect(filter.clean('I  hav   ,e BoOb,  ')).to.equal('I  hav   ,e ****,  ');
    expect(filter.clean(',I h  a.   v e BoOb.')).to.equal(',I h  a.   v e ****.');
  });

  // https://github.com/jojoee/leo-profanity/issues/10
  it('should not detect .', function () {
    expect(filter.clean('.')).to.equal('.');
  });

  it('should show "clear letter" in the beginning of the word', function () {
    expect(filter.clean('I have boob', '+', 2)).to.equal('I have bo++');
  });

  it('should support options object pattern', function () {
    expect(filter.clean('I have boob', { replaceKey: '+' })).to.equal('I have ++++');
    expect(filter.clean('I have boob', { replaceKey: '+', nbLetters: 2 })).to.equal('I have bo++');
    expect(filter.clean('I have boob', { nbLetters: 2 })).to.equal('I have bo**');
  });
});

describe('badWordsUsed', function () {
  it('should return empty string if param is empty string', function () {
    expect(filter.badWordsUsed('')).to.deep.equal([])
  });

  it('should return original string if string not contain profanity word', function () {
    expect(filter.badWordsUsed('I have 2 eyes')).to.deep.equal([])
  });

  it('should found profanity word', function () {
    // normal case
    expect(filter.badWordsUsed('I have boob, etc.')).to.deep.equal(['boob']);

    // first & last
    expect(filter.badWordsUsed('2g1c')).to.deep.equal(['2g1c']);
    expect(filter.badWordsUsed('zoophilia')).to.deep.equal(['zoophilia']);
    expect(filter.badWordsUsed('lorem 2g1c ipsum')).to.deep.equal(['2g1c']);
    expect(filter.badWordsUsed('lorem zoophilia ipsum')).to.deep.equal(['zoophilia']);
  });

  it('should detect case sensitive', function () {
    expect(filter.badWordsUsed('I have BoOb')).to.deep.equal(['BoOb']);
  });

  it('should detect dot and comma', function () {
    expect(filter.badWordsUsed('I have BoOb,')).to.deep.equal(['BoOb']);
    expect(filter.badWordsUsed('I have BoOb.')).to.deep.equal(['BoOb']);
  });

  it('should detect multi occurrence', function () {
    expect(filter.badWordsUsed('I have boob,boob, ass, and etc.')).to.deep.equal([
      'boob',
      'boob',
      'ass'
    ]);
  });

  it('should not detect unspaced-word', function () {
    expect(filter.badWordsUsed('Buy classic watches online')).to.deep.equal([]);
  });

  it('should detect multi-length-space and multi-space', function () {
    expect(filter.badWordsUsed('I  hav   ,e BoOb,  ')).to.deep.equal(['BoOb']);
    expect(filter.badWordsUsed(',I h  a.   v e BoOb.')).to.deep.equal(['BoOb']);
  });

  it('should not detect .', function () {
    expect(filter.badWordsUsed('.')).to.deep.equal([]);
  });
});

describe('add', function () {
  it('should contain new word by given string', function () {
    filter.add('b00b');
    expect(filter.list()).to.include('b00b');
  });

  it('should contain new words by given array of string', function () {
    filter.add(['b@@b', 'b##b']);
    expect(filter.list()).to.include('b@@b');
    expect(filter.list()).to.include('b##b');
  });

  it('should not add if we already have', function () {
    // check duplication
    const numberOfCurrentWords = filter.list().length;
    filter.add(['b@@b', 'b##b']);
    expect(filter.list().length).to.equal(numberOfCurrentWords);
  });
});

describe('remove', function () {
  it('should remove word by given string', function () {
    filter.remove('boob');
    expect(filter.list()).to.not.include('boob');
  });

  it('should remove words by given array of string', function () {
    filter.remove(['boob', 'boobs']);
    expect(filter.list()).to.not.include('boob');
    expect(filter.list()).to.not.include('boobs');
  });
});

describe('reset', function () {
  it('should reset words by using default dictionary', function () {
    // reset
    filter.reset();

    // prepare data to test by adding new 2 bad words
    const numberOfCurrentWords = filter.list().length;
    filter.add(['badword1', 'badword2']);
    expect(filter.list().length).to.equal(numberOfCurrentWords + 2);

    // reset
    filter.reset();
    expect(filter.list().length).to.equal(numberOfCurrentWords);
  });
});

describe('clearList', function () {
  it('should remove words in the list', function () {
    filter.clearList();
    expect(filter.list()).to.be.empty;
  });
});

describe('getDictionary', function () {
  it('should returns "en" word list', function () {
    const result = filter.getDictionary()

    // contains words
    expect(result).to.include('boob');
    expect(result).to.include('boobs');

    // number of words
    expect(result.length).to.equal(enWordDictionary.length);
  });

  if (wordDictionary['fr']) {
    it('should returns "fr" word list', function () {
      const result = filter.getDictionary('fr')

      expect(result).to.include('1mb3c1l3');
      expect(result).to.include('1mbec1l3');
    });
  }

  if (wordDictionary['ru']) {
    it('should returns "ru" word list', function () {
      const result = filter.getDictionary('ru')

      expect(result).to.include('хуй');
    });
  }
});

describe('loadDictionary', function () {
  it('should load "en" dictionary', function () {
    filter.loadDictionary()

    expect(filter.list()).to.include('boob');
    expect(filter.list()).to.include('boobs');
  });

  if (wordDictionary['fr']) {
    it('should load "fr" dictionary', function () {
      filter.loadDictionary('fr')

      expect(filter.list()).to.include('1mb3c1l3');
      expect(filter.list()).to.include('1mbec1l3');
      expect(filter.check('bordel de merde')).to.be.true;
      expect(filter.clean('bordel de merde')).to.eql('****** de *****');
      expect(filter.list().length).to.equal(wordDictionary['fr'].length)
    });
  }

  if (wordDictionary['ru']) {
    it('should load "ru" dictionary', function () {
      filter.loadDictionary('ru')

      expect(filter.list()).to.include('хуй');
      expect(filter.check('долбоёб пошёл в пизду')).to.be.true;
      expect(filter.clean('долбоёб пошёл в пизду')).to.eql('******* пошёл в *****');
      expect(filter.list().length).to.equal(wordDictionary['ru'].length)
    });
  }
});

describe('addDictionary', function () {
  it('should add new dictionary', function () {
    filter.loadDictionary();
    const name = 'th';
    const words = ['หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า'];

    filter.addDictionary(name, words);

    expect(filter.list().length).to.equal(words.length);
  });
});

describe('removeDictionary', function () {
  it('should remove existing dictionary', function () {
    const name = 'fr';
    filter.loadDictionary(name);
    expect(filter.list().length).to.not.equal(0);

    filter.removeDictionary(name);

    expect(name in filter.wordDictionary).to.be.false;
  });

  it('should remove new dictionary', function () {
    filter.loadDictionary()
    const name = 'th'
    const words = ['หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า']
    filter.addDictionary(name, words);
    expect(filter.list().length).to.equal(words.length);

    filter.removeDictionary(name);

    expect(name in filter.wordDictionary).to.be.false;
  });
});

describe('whitelist', function () {
  beforeEach(function () {
    filter.reset();
    filter.clearWhitelist();
  });

  describe('addWhitelist', function () {
    it('should add word to whitelist', function () {
      filter.addWhitelist('ass');
      expect(filter.getWhitelist()).to.include('ass');
    });

    it('should add multiple words to whitelist', function () {
      filter.addWhitelist(['ass', 'boob']);
      expect(filter.getWhitelist()).to.include('ass');
      expect(filter.getWhitelist()).to.include('boob');
    });

    it('should return this for chaining', function () {
      const result = filter.addWhitelist('ass');
      expect(result).to.equal(filter);
    });
  });

  describe('removeWhitelist', function () {
    it('should remove word from whitelist', function () {
      filter.addWhitelist('ass');
      filter.removeWhitelist('ass');
      expect(filter.getWhitelist()).to.not.include('ass');
    });

    it('should remove multiple words from whitelist', function () {
      filter.addWhitelist(['ass', 'boob']);
      filter.removeWhitelist(['ass', 'boob']);
      expect(filter.getWhitelist()).to.be.empty;
    });
  });

  describe('clearWhitelist', function () {
    it('should clear all whitelisted words', function () {
      filter.addWhitelist(['ass', 'boob']);
      filter.clearWhitelist();
      expect(filter.getWhitelist()).to.be.empty;
    });
  });

  describe('filtering with whitelist', function () {
    it('should not filter whitelisted words with check()', function () {
      filter.addWhitelist('ass');
      expect(filter.check('I have ass')).to.be.false;
    });

    it('should not filter whitelisted words with clean()', function () {
      filter.addWhitelist('ass');
      expect(filter.clean('I have ass')).to.equal('I have ass');
    });

    it('should not include whitelisted words in badWordsUsed()', function () {
      filter.addWhitelist('ass');
      expect(filter.badWordsUsed('I have ass and boob')).to.deep.equal(['boob']);
    });

    it('should filter non-whitelisted words normally', function () {
      filter.addWhitelist('ass');
      expect(filter.clean('I have ass and boob')).to.equal('I have ass and ****');
    });
  });
});
