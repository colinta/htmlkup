 htmlkup
=========

 Command line usage:
---------------------

Pipe it in, it pipes it out.

``` sh
$ npm install -g htmlkup
```

``` sh
$ echo '<html></html>' | htmlkup
```
``` coffeescript
html()
```

``` sh
$ echo '<html>
  <head>
    <link type="text/css" href="/css/my.css" />
    <script type="text/javascript" src="/js/my.js"></script>
    <title>Title</title>
  </head>
  <body>
    <div>Text</div>
    <div>
      <a href="/">somewhere</a><br/>
    </div>
  </body>
</html>' | htmlkup
```
``` coffeescript
html ->
  head ->
    link type: "text/css", href: "/css/my.css"
    script type: "text/javascript", src: "/js/my.js", ->
    title ->
      text "Title"
  body ->
    div ->
      text "Text"
    div ->
      a href: "/", ->
        text "somewhere"
      br()
```

``` sh
$ htmlkup < your.html > your.coffee
```

 Module usage:
---------------

hmtlkup exports just one function.  Pass in html, it returns coffeescript


``` coffeescript
htmlkup = require 'htmlkup'

html = '<p>Hi!</p>'
coffeekup = htmlkup(html)
```
``` coffeescript
p "Hi!"
```

 Tests
-------

```
$ vows
```
