
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
              '    <div>Text</div>\n' +
              '    <div>\n' +
              '      <a href="/">somewhere</a>\n' +
              '      <br/>\n' +
              '    </div>\n' +
              '  </body>\n' +
              '</html>',

  bigkup =    'html ->\n' +
              '  head ->\n' +
              '    link type: "text/css", href: "/css/my.css", ->\n' +
              '    script type: "text/javascript", src: "/js/my.js", ->\n' +
              '    title ->\n' +
              '      text "Title"\n' +
              '  body ->\n' +
              '    div ->\n' +
              '      text "Text"\n' +
              '    div ->\n' +
              '      a href: "/", ->\n' +
              '        text "somewhere"\n' +
              '      br()';

vows.describe('Converting html into coffeekup').addBatch({
  'when converting <br />': {
    topic: '<br />',
    'we expect br()': function(html) {
      assert.equal(htmlkup(html), "br()")
    },
  },
  'when converting <a id="myid" class="class1 class2" href="/">': {
    topic: '<a id="myid" class="class1 class2" href="/">link</a>',
    'we expect a': function(html) {
      assert.equal(htmlkup(html), 'a ".class1.class2#myid", href: "/", ->\n  text "link"')
    }
    },
  'when converting <div><a id="myid" class="class1 class2" href="/"></div>': {
    topic: '<div><a id="myid" class="class1 class2" href="/">link</a></div>',
    'we expect a': function(html) {
      assert.equal(htmlkup(html), 'div ->\n  a ".class1.class2#myid", href: "/", ->\n    text "link"')
    }
  },
  'when converting bigtest': {
    topic: bigtest,
    'we expect bigkup': function(bigtest) {
      assert.equal(htmlkup(bigtest), bigkup)
    },
  },
}).export(module);
