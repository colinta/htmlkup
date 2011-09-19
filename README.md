 htmlkup
---------

``` shell
cat '<html></html>' | htmlkup
html()
```

``` shell
cat '<html>
  <head>
    <link type="text/css" href="/css/my.css">
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
htmlkup = require 'htmlkup'

html = '<p>Hi!</p>'
coffeekup = htmlkup(html)
# coffeekup =>
# p->
#   text 'Hi!'
```
