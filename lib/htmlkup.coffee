

module.exports = (html)->
  possibles = 
    start: ['ws', 'text', 'lt', 'end']
    ws: ['text', 'lt', 'end']
    lt: ['tag', 'close', 'ws', 'end']
    tag: ['tag-ws', 'gt', 'singleton']
    'close-tag': ['text', 'ws', 'lt', 'end']
    'tag-ws': ['attr', 'singleton']
    attr: ['tag-ws', 'eq', 'gt', 'singleton']
    eq: ['value', 'dqt', 'sqt']
    dqt: ['dvalue']
    sqt: ['svalue']
    value: ['tag-ws', 'gt', 'singleton']
    dvalue: ['cdqt']
    svalue: ['csqt']
    cdqt: ['tag-ws', 'gt', 'singleton']
    csqt: ['tag-ws', 'gt', 'singleton']
    gt: ['text', 'ws', 'lt', 'end']
    singleton: ['text', 'ws', 'lt', 'end']
    text: ['lt', 'ws', 'end']
    close: ['close-tag']
  
  html_thing = /^[a-zA-Z]([-_]?[a-zA-Z0-9])*/
  detect =
    start: /^/
    end: /$/
    ws: /^[ \n\r]+/
    lt: /^</
    gt: /^>/
    tag: html_thing
    'close-tag': /^[a-zA-Z]([-_]?[a-zA-Z0-9])*>/
    'tag-ws': /^[ ]/
    attr: html_thing
    eq: /^=/
    dqt: /^"/
    sqt: /^'/
    cdqt: /^"/
    csqt: /^'/
    value: html_thing
    dvalue: /^[^"\n\r]+/
    svalue: /^[^'\n\r]+/
    text: /^[^<\s][^<]*/
    singleton: /^\/>/
    close: /^\//

  state = 'start'
  c = 0
  coffee = ''
  last_tag = null
  last_attr = null
  tags = []
  
  html = html.replace(/[\t]/g, '  ') # YEAH, FUCK YOU, TABS!
  initial_indent = (html.match /^[ ]*/)[0]
  indent = [initial_indent]
  
  c = initial_indent.length
  while state != 'end'
    current = html.substring c
    
    nexts = (next for next in possibles[state] when current.match detect[next])
    if ! nexts.length
      e = new Error "Expected: #{(n for n in possibles[state]).join ' '}, found #{(n for n,v of detect when current.match detect[v]).join ' '}"
      e.coffee = coffee
      e.html = html
      e.current = current
      throw e
    
    next = nexts[0]
    value = (current.match detect[next])[0]
    
    switch next
      when 'tag'
        last_tag = { name: value, attr: {} }
        tags.push last_tag
        last_attr = null
      when 'close-tag'
        last_tag = tags.pop()
        indent.pop()
      when 'attr'
        last_attr = value
      when 'tag-ws'
        if last_attr then last_tag.attr[last_attr] = true
        last_attr = null
      when 'value', 'dvalue', 'svalue'
        last_tag.attr[last_attr] = value
        last_attr = null
      when 'gt'
        coffee += indent.join('') + addTag last_tag
        indent.push('  ')
      when 'singleton'
        coffee += indent.join('') + addTag last_tag, true
      when 'text'
        coffee += indent.join('') + "text #{JSON.stringify value}\n"
      ##|
      ##|  IGNORE
      ##|
      # when 'lt'
      #   reset last_tag, ignore value
      # when 'eq'
      #   coffee += '='
      # when 'dqt'
      #   coffee += value
      # when 'cdqt'
      #   coffee += value
      # when 'sqt'
      #   coffee += value
      # when 'csqt'
      #   coffee += value
      # when 'close'
      # when 'ws'
    c += value.length
    state = next
  coffee.trim()

addTag = (last_tag, is_singleton = false)->
  coffee = ''
  extra = ''
  if last_tag.attr['class'] then  extra += '.' + last_tag.attr['class'].replace(/[ ]/g, '.')
  if last_tag.attr.id then  extra += "\##{last_tag.attr.id}"
  # delete so they don't get re-added
  last_tag.attr.class = null
  last_tag.attr.id = null
  if extra then coffee += JSON.stringify extra
  first = true
  for own attr, attr_value of last_tag.attr
    if not attr_value? then continue
    if not first or extra.length then coffee += ', '
    if attr.match /^[a-zA-Z0-9]+$/ then coffee += attr
    else coffee += JSON.stringify attr
    coffee += ': '
    if attr_value == true then coffee += 'true'
    else if attr_value.match /^[0-9]+$/ then coffee += attr_value
    else coffee += JSON.stringify attr_value
    first = false
  if coffee.length == 0
    if is_singleton then coffee = last_tag.name + "()\n"
    else coffee = last_tag.name + " ->\n"
  else
    coffee = last_tag.name + ' ' + coffee + ", ->\n"
  coffee
