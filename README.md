 htmlkup
---------

``` sh
$ npm install -g htmlkup
```

``` sh
$ echo '<html></html>' | htmlkup
html ->
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
      br()```

``` coffeescript
htmlkup = require 'htmlkup'

html = '<p>Hi!</p>'
coffeekup = htmlkup(html)
```

`=>`

``` coffeescript
p->
  text 'Hi!'
```

 Tests
-------

```
$ vows
····· 
&#x2713; OK &raquo; 10 honored (0.005s)
```
