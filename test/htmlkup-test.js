
var vows = require('vows'),
  assert = require('assert'),
  htmlkup = require('../lib/htmlkup');


var bigtest = '<html>\n' +
              '  <head>\n' +
              '    <link type="text/css" href="/css/my.css" />\n' +
              '    <script type="text/javascript" src="/js/my.js"></script>\n' +
              '    <title>Title</title>\n' +
              '  </head>\n' +
              '  <body>\n' +
              '    <p>An easy one.</p>' +
              '    <div class=myclass id=myid>\n' +
              '      <p>First this</p>\n' +
              '      <p>Then <strong>THIS</strong></p>\n' +
              '      <p>And finally, Text</p>\n' +
              '    </div>\n' +
              '    <div>\n' +
              '      <a href="/">somewhere</a><br/>\n' +
              '<img width=20 height=20 src="/image/myimage.png"/>\n' +
              '    </div>\n' +
              '  </body>\n' +
              '</html>';
  bigkup =    'html ->\n' +
              '  head ->\n' +
              '    link type: "text/css", href: "/css/my.css"\n' +
              '    script type: "text/javascript", src: "/js/my.js"\n' +
              '    title "Title"\n' +
              '  body ->\n' +
              '    p "An easy one."\n' +
              '    div ".myclass#myid", ->\n' +
              '      p "First this"\n' +
              '      p ->\n' +
              '        text "Then "\n' +
              '        strong "THIS"\n' +
              '      p "And finally, Text"\n' +
              '    div ->\n' +
              '      a href: "/", "somewhere"\n' +
              '      br()\n' +
              '      img width: 20, height: 20, src: "/image/myimage.png"';

vows.describe('Converting html into coffeekup').addBatch({
  'when converting <html></html>': {
    topic: '<html></html>',
    'we expect html()': function(html) {
      assert.equal(htmlkup(html), "html()")
    },
  },
  'when converting <p>test</p>': {
    topic: '<p>test</p>',
    'we expect p "test"': function(html) {
      assert.equal(htmlkup(html), 'p "test"')
    },
  },
  'when converting <br />': {
    topic: '<br />',
    'we expect br()': function(html) {
      assert.equal(htmlkup(html), 'br()')
    },
  },
  'when converting <br/>': {
    topic: '<br/>',
    'we expect br()': function(html) {
      assert.equal(htmlkup(html), 'br()')
    },
  },
  'when converting <div><p> with whitespace': {
    topic: '  <div><p></p></div>',
    'we expect div -> p -> with whitespace': function(html) {
      assert.equal(htmlkup(html), '  div ->\n    p()')
    },
  },
  'when converting <div><p> with tabs': {
    topic: '\t\t<div><p></p></div>',
    'we expect div -> p -> with spaces': function(html) {
      assert.equal(htmlkup(html), '    div ->\n      p()')
    },
  },
  'when converting <a id="myid" class="class1 class2" href="/">': {
    topic: '<a id="myid" class="class1 class2" href="/">link</a>',
    'we expect a': function(html) {
      assert.equal(htmlkup(html), 'a ".class1.class2#myid", href: "/", "link"')
    }
    },
  'when converting <div><a id="myid" class="class1 class2" href="/"></div>': {
    topic: '<div><a id="myid" class="class1 class2" href="/">link</a></div>',
    'we expect a': function(html) {
      assert.equal(htmlkup(html), 'div ->\n  a ".class1.class2#myid", href: "/", "link"')
    }
  },
  'when converting <select enabled autofocus><option value="value">label</option>': {
    topic: '<select enabled autofocus><option value="value">label</option>',
    'we expect select ... -> option': function(html) {
      assert.equal(htmlkup(html), 'select enabled: "enabled", autofocus: "autofocus", ->\n  option value: "value", "label"')
    },
  },
  'when converting bigtest': {
    topic: bigtest,
    'we expect bigkup': function(bigtest) {
      assert.equal(htmlkup(bigtest), bigkup)
    },
  },
}).export(module);
