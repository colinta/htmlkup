
var vows = require('vows'),
  assert = require('assert'),
  htmlkup = require('../lib/htmlkup');

var detect = {
    start: /^/,
    end: /^$/,
    'open-tag': /^<[a-zA-Z]([-_]?[a-zA-Z0-9])*/,
    gt: /^>/,
    'close-tag': /^<\/[a-zA-Z]([-_]?[a-zA-Z0-9])*>/,
    'tag-ws': /^[ ]/,
    attr: /^[a-zA-Z]([-_]?[a-zA-Z0-9])*/,
    eq: /^=/,
    dqt: /^"/,
    sqt: /^'/,
    cdqt: /^"/,
    csqt: /^'/,
    value: /^[a-zA-Z0-9]([-_]?[a-zA-Z0-9])*/,
    dvalue: /^[^"\n\r]*/,
    svalue: /^[^'\n\r]*/,
    text: /^(?:[^<]|<(?![\/a-zA-Z]))+/,
    singleton: /^\/>/,
  }

vows.describe('Converting html into coffeekup').addBatch({
  'when matching start': {
    'we expect "test" to match': function() {
      assert.ok('test'.match(detect.start))
    },
  },
  'when matching end': {
    'we expect "" to match': function() {
      assert.ok(''.match(detect.end))
    },
    'we DONT expect "test" to match': function() {
      assert.ok( ! 'test'.match(detect.end))
    },
  },
  'when matching open-tag': {
    'we expect "<tag" to match "<tag"': function() {
      assert.equal('<tag'.match(detect['open-tag'])[0], '<tag')
    },
  },
  'when matching open-tag': {
    'we DONT expect "< tag" to match': function() {
      assert.ok( ! '< tag'.match(detect['open-tag']))
    },
  },
  'when matching gt': {
    'we expect ">test" to match ">"': function() {
      assert.equal('>test'.match(detect.gt)[0], '>')
    },
  },
  'when matching >': {
    'we DONT expect " >" to match': function() {
      assert.ok( ! ' >'.match(detect.gt))
    },
  },
  'when matching close-tag': {
    'we expect "</tag>" to match "</tag>"': function() {
      assert.equal('</tag>'.match(detect['close-tag'])[0], '</tag>')
    },
  },
  'when matching close-tag': {
    'we DONT expect "< tag" to match': function() {
      assert.ok( ! '< tag'.match(detect['close-tag']))
    },
  },
  'when matching tag-ws': {
    'we expect " " to match " "': function() {
      assert.equal(' '.match(detect['tag-ws'])[0], ' ')
    },
  },
  'when matching tag-ws': {
    'we DONT expect "ws" to match': function() {
      assert.ok( ! 'ws'.match(detect['tag-ws']))
    },
  },
  'when matching attr': {
    'we expect "attr=" to match "attr"': function() {
      assert.equal('attr='.match(detect.attr)[0], 'attr')
    },
  },
  'when matching attr': {
    'we DONT expect ">" to match': function() {
      assert.ok( ! '>'.match(detect.attr))
    },
  },
  'when matching eq': {
    'we expect "=value" to match "="': function() {
      assert.equal('=value'.match(detect.eq)[0], '=')
    },
  },
  'when matching eq': {
    'we DONT expect "$" to match': function() {
      assert.ok( ! '$'.match(detect.eq))
    },
  },
  'when matching dqt': {
    'we expect "\\"value\\"" to match "\\""': function() {
      assert.equal('"value"'.match(detect.dqt)[0], '"')
    },
  },
  'when matching dqt': {
    'we DONT expect "\'" to match': function() {
      assert.ok( ! '\''.match(detect.dqt))
    },
  },
  'when matching sqt': {
    'we expect "\'value\'" to match "\'"': function() {
      assert.equal('\'value\''.match(detect.sqt)[0], '\'')
    },
  },
  'when matching sqt': {
    'we DONT expect "\\"" to match': function() {
      assert.ok( ! '\"'.match(detect.sqt))
    },
  },
  'when matching cdqt': {
    'we expect "\\"value\\"" to match "\\""': function() {
      assert.equal('"value"'.match(detect.cdqt)[0], '"')
    },
  },
  'when matching cdqt': {
    'we DONT expect "\'" to match': function() {
      assert.ok( ! '\''.match(detect.cdqt))
    },
  },
  'when matching csqt': {
    'we expect "\'value\'" to match "\'"': function() {
      assert.equal('\'value\''.match(detect.csqt)[0], '\'')
    },
  },
  'when matching csqt': {
    'we DONT expect "\\"" to match': function() {
      assert.ok( ! '\"'.match(detect.csqt))
    },
  },
  'when matching value': {
    'we expect "asdf " to match "asdf"': function() {
      assert.ok('asdf '.match(detect.value)[0], 'asdf')
    },
  },
  'when matching value': {
    'we DONT expect "\'asdf\'" to match': function() {
      assert.ok( ! "'asdf'".match(detect.value))
    },
  },
  'when matching dvalue': {
    'we expect "asdf\'asdf" to match "asdf\'asdf"': function() {
      assert.equal('asdf\'asdf'.match(detect.dvalue)[0], 'asdf\'asdf')
    },
  },
  'when matching dvalue': {
    'we expect "asdf\\"asdf" to match "asdf"': function() {
      assert.equal('asdf"asdf'.match(detect.dvalue)[0], 'asdf')
    },
  },
  'when matching svalue': {
    'we expect "asdf\\"asdf" to match "asdf\\"asdf"': function() {
      assert.equal('asdf"asdf'.match(detect.svalue)[0], 'asdf"asdf')
    },
  },
  'when matching svalue': {
    'we expect "asdf\'asdf" to match "asdf"': function() {
      assert.equal('asdf\'asdf'.match(detect.svalue)[0], 'asdf')
    },
  },
  'when matching text': {
    'we expect " This is some text " to match " This is some text "': function() {
      assert.equal(' This is some text '.match(detect.text)[0], ' This is some text ')
    },
  },
  'when matching text': {
    'we expect "\n\ntest\n\n" to match "\n\ntest\n\n"': function() {
      assert.equal('\n\ntest\n\n'.match(detect.text)[0], '\n\ntest\n\n')
    },
  },
  'when matching text': {
    'we expect "text <tag" to match "text "': function() {
      assert.equal('text <tag'.match(detect.text)[0], 'text ')
    },
  },
  'when matching text': {
    'we expect "text </tag" to match "text "': function() {
      assert.equal('text </tag'.match(detect.text)[0], 'text ')
    },
  },
  'when matching text': {
    'we DONT expect "<tag" to match': function() {
      assert.ok( ! '<tag'.match(detect.text))
    },
  },
  'when matching text': {
    'we DONT expect "</tag>" to match': function() {
      assert.ok( ! '</tag>'.match(detect.text))
    },
  },
}).export(module);
