
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
              '    <p>An easy one.</p>\n' +
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
  bigkup = 'html ->\n' +
           '  head ->\n' +
           '    link type: "text/css", href: "/css/my.css"\n' +
           '    script type: "text/javascript", src: "/js/my.js"\n' +
           '    title "Title"\n' +
           '  body ->\n' +
           '    p "An easy one."\n' +
           '    div "#myid.myclass", ->\n' +
           '      p "First this"\n' +
           '      p ->\n' +
           '        text "Then "\n' +
           '        strong "THIS"\n' +
           '      p "And finally, Text"\n' +
           '    div ->\n' +
           '      a href: "/", "somewhere"\n' +
           '      br()\n' +
           '      img width: 20, height: 20, src: "/image/myimage.png"';

var selfclosetest = '<html>\n' +
                    '  <head>\n' +
                    '    <link type="text/css" href="/css/my.css">\n' +
                    '    <meta name="keywords" content="">\n' +
                    '    <script type="text/javascript" src="/js/my.js"></script>\n' +
                    '    <title>Title</title>\n' +
                    '  </head>\n' +
                    '  <body>\n' +
                    '    <p>An easy one.<br>And another</p>\n' +
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
  selfclosekup = 'html ->\n' +
                 '  head ->\n' +
                 '    link type: "text/css", href: "/css/my.css"\n' +
                 '    meta name: "keywords", content: ""\n' +
                 '    script type: "text/javascript", src: "/js/my.js"\n' +
                 '    title "Title"\n' +
                 '  body ->\n' +
                 '    p ->\n'+
                 '      text "An easy one."\n' +
                 '      br()\n'+
                 '      text "And another"\n'+
                 '    div "#myid.myclass", ->\n' +
                 '      p "First this"\n' +
                 '      p ->\n' +
                 '        text "Then "\n' +
                 '        strong "THIS"\n' +
                 '      p "And finally, Text"\n' +
                 '    div ->\n' +
                 '      a href: "/", "somewhere"\n' +
                 '      br()\n' +
                 '      img width: 20, height: 20, src: "/image/myimage.png"';

var doctypetest = '<!doctype html>\n' +
                  '<head>\n' +
                  '<!-- comment test -->\n' +
                  '<!--[if lte IE 7]>\n' +
                  '  <style type="text/css">\n' +
                  '  select, table tr.apply th select {\n' +
                  '    font-size: 150%;\n' +
                  '  }\n' +
                  '  table tr.apply th input.checkbox {\n' +
                  '    top: 3px\n' +
                  '  }\n' +
                  '  a.button, input.submit, button {\n' +
                  '    padding-bottom: 0px;\n' +
                  '  }\n' +
                  '  </style>\n' +
                  '<![endif]-->\n' +
                  '</head>\n' +
                  '';
var doctype = 'doctype 5\n' +
              'head ->\n' +
              '  comment "comment test"\n' +
              '  ie "lte IE 7", ->\n' +
              '    style type: "text/css", """\n' +
              '  select, table tr.apply th select {\n' +
              '    font-size: 150%;\n' +
              '  }\n' +
              '  table tr.apply th input.checkbox {\n' +
              '    top: 3px\n' +
              '  }\n' +
              '  a.button, input.submit, button {\n' +
              '    padding-bottom: 0px;\n' +
              '  }\n' +
              '  \n' +
              '"""\n' +
              '';

var initialwhitespacetest = '\n\n' +
                         '<!doctype html>\n' +
                         '<head>\n' +
                         '  <title>title</title>\n' +
                         '</head>\n' +
                         '';

var initialwhitespace = '\n\n' + // whitespace before and after is *preserved*
                        'doctype 5\n' +
                        'head ->\n' +
                        '  title "title"\n' +
                        '';

var initialcommenttest = '<!-- comment -->\n' +
                         '<!doctype html>\n' +
                         '<head>\n' +
                         '  <title>title</title>\n' +
                         '</head>\n' +
                         '';

var initialcomment = 'comment "comment"\n' +
                     'doctype 5\n' +
                     'head ->\n' +
                     '  title "title"\n' +
                     '';

vows.describe('Converting html into coffeekup').addBatch({
  'when converting <html></html>': {
    topic: '<html></html>',
    'we expect html()': function(html) {
      assert.equal(htmlkup(html), "html()");
    }
  },
  'when converting <p>test</p>': {
    topic: '<p>test</p>',
    'we expect p "test"': function(html) {
      assert.equal(htmlkup(html), 'p "test"');
    }
  },
  'when converting <br />': {
    topic: '<br />',
    'we expect br()': function(html) {
      assert.equal(htmlkup(html), 'br()');
    }
  },
  'when converting <br/>': {
    topic: '<br/>',
    'we expect br()': function(html) {
      assert.equal(htmlkup(html), 'br()');
    }
  },
  'when converting <p>1 < 2</p>': {
    topic: '<p>1 < 2</p>',
    'we expect p "1 < 2"': function(html) {
      assert.equal(htmlkup(html), 'p "1 < 2"');
    }
  },
  'when converting <div><p> with whitespace': {
    topic: '  <div><p></p></div>',
    'we expect div -> p -> with whitespace': function(html) {
      assert.equal(htmlkup(html), '  div ->\n    p()');
    }
  },
  'when converting <div><p> with whitespace before AND after': {
    topic: '\n    \n  <div><p></p></div>\n  \n    ',
    'we expect div -> p -> with whitespace': function(html) {
      assert.equal(htmlkup(html), '\n    \n  div ->\n    p()\n  \n    ');
    }
  },
  'when converting <div><p> with tabs': {
    topic: '\t\t<div><p></p></div>',
    'we expect div -> p -> with spaces': function(html) {
      assert.equal(htmlkup(html), '    div ->\n      p()');
    }
  },
  'when converting <p>  test  \\n</p>': {
    topic: '<p>  test  \n</p>',
    'we expect p " test "': function(html) {
      assert.equal(htmlkup(html), 'p " test "');
    }
  },
  'when converting <p>  test\\n  </p>': {
    topic: '<p>  test\n  </p>',
    'we expect p " test "': function(html) {
      assert.equal(htmlkup(html), 'p " test "');
    }
  },
  'when converting <textarea>//<![CDATA[  //]]></textarea>': {
    topic: '<textarea>//<![CDATA[ \n\n //]]></textarea>',
    'we expect textarea "//<![CDATA[ \n\n //]]>"': function(html) {
      assert.equal(htmlkup(html), 'textarea """\n//<![CDATA[ \n\n //]]>\n"""');
    }
  },
  'when converting <script>\\n\\n  // with whitespace\\n\\n</script>': {
    topic: '<script>\n\n  // with whitespace\n\n</script>',
    'we expect script """\\n\\n  // with whitespace\\n\\n"""': function(html) {
      assert.equal(htmlkup(html), 'script """\n\n  // with whitespace\n\n"""');
    }
  },
  'when converting <p>test <a href="/">link</a> test</p>': {
    topic: '<p>test <a href="/">link</a> test</p>',
    'we expect p -> text "test " ... text " test"': function(html) {
      assert.equal(htmlkup(html), 'p ->\n  text "test "\n  a href: "/", "link"\n  text " test"');
    }
  },
  'when converting <a id="myid" class="class1 class2" href="/">': {
    topic: '<a id="myid" class="class1 class2" href="/">link</a>',
    'we expect a': function(html) {
      assert.equal(htmlkup(html), 'a "#myid.class1.class2", href: "/", "link"');
    }
  },
  'when converting <div><a id="myid" class="class1 class2" href="/"></div>': {
    topic: '<div><a id="myid" class="class1 class2" href="/">link</a></div>',
    'we expect a': function(html) {
      assert.equal(htmlkup(html), 'div ->\n  a "#myid.class1.class2", href: "/", "link"');
    }
  },
  'when <span id=" myid ">text</a>': {
    topic: '<span id=" myid ">text</a>',
    'we expect a': function(html) {
      assert.equal(htmlkup(html), 'span "#myid", "text"');
    }
  },
  'when <span class=" myclass ">text</a>': {
    topic: '<span class=" myclass ">text</a>',
    'we expect a': function(html) {
      assert.equal(htmlkup(html), 'span ".myclass", "text"');
    }
  },
  'when <span class="class1  class2">text</a>': {
    topic: '<span class="class1  class2">text</a>',
    'we expect a': function(html) {
      assert.equal(htmlkup(html), 'span ".class1.class2", "text"');
    }
  },
  'when converting <select enabled autofocus><option value="value">label</option>': {
    topic: '<select enabled autofocus><option value="value">label</option>',
    'we expect select ... -> option': function(html) {
      assert.equal(htmlkup(html), 'select enabled: "enabled", autofocus: "autofocus", ->\n  option value: "value", "label"');
    }
  },
  'when converting bigtest': {
    topic: bigtest,
    'we expect bigkup': function(bigtest) {
      assert.equal(htmlkup(bigtest), bigkup);
    }
  },
  'when converting selfclosetest': {
    topic: selfclosetest,
    'we expect selfclosekup': function(selfclosetest) {
      assert.equal(htmlkup(selfclosetest), selfclosekup);
    }
  },
  'when converting doctypetest': {
    topic: doctypetest,
    'we expect doctype': function(doctypetest) {
      assert.equal(htmlkup(doctypetest), doctype);
    }
  },
  'when converting initialcommenttest': {
    topic: initialcommenttest,
    'we expect initialcommentup': function(initialcommenttest) {
      assert.equal(htmlkup(initialcommenttest), initialcomment);
    }
  },
  'when converting initialwhitespacetest': {
    topic: initialwhitespacetest,
    'we expect initialwhitespaceup': function(initialwhitespacetest) {
      assert.equal(htmlkup(initialwhitespacetest), initialwhitespace);
    }
  }
}).export(module);
