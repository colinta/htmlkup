 htmlkup
---------

``` shell
cat '<html></html>' | htmlkup
html()
```

``` shell
echo '<html>
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
    link type: "text/css", href: "/css/my.css", ->
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

``` coffeescript
htmlkup = require 'htmlkup'

html = '<p>Hi!</p>'
coffeekup = htmlkup(html)
# coffeekup =>
# p->
#   text 'Hi!'
```
