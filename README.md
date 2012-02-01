 htmlkup
=========

Installation
------------

``` sh
$ npm install -g htmlkup
```

 Command line usage:
---------------------

Pipe it in, it pipes it out.

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
    script type: "text/javascript", src: "/js/my.js"
    title "Title"
  body ->
    div "Text"
    div ->
      a href: "/", "somewhere"
      br()
```

``` sh
$ htmlkup < your.html > your.coffee
```

 Online usage:
---------------

You can paste in your HTML and it'll output coffeescript.

<http://html2coffeekup.no.de/>

Thanks to [webjay](https://github.com/webjay/html2coffeekup) for building this!


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
