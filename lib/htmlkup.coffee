

module.exports = (html, output_debug)->
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
    value: /^[a-zA-Z0-9]([-_]?[a-zA-Z0-9])*/
    dvalue: /^[^"\n\r]+/
    svalue: /^[^'\n\r]+/
    text: /^[^<\s][^<]*/
    singleton: /^\/>/
    close: /^\//

  state = 'start'
  c = 0
  last_tag = {tags: []}
  last_attr = null
  parent_tags = []

  html = html.replace(/\t/g, '  ') # YEAH, FUCK YOU, TABS!
  initial_whitespace = (html.match /^[ \n\r]*/)[0]
  initial_indent = initial_whitespace.match(/[ ]*$/)[0]
  initial_whitespace = initial_whitespace.substring(0, initial_whitespace.length - initial_indent.length)
  final_whitespace = (html.match /[ \r\n]*$/)[0]
  console.log {initial_whitespace, initial_indent, final_whitespace} if output_debug

  c = initial_whitespace.length
  while state != 'end'
    current = html.substring c

    nexts = (next for next in possibles[state] when current.match detect[next])
    if ! nexts.length
      e = new Error "Expected: #{(noun for noun in possibles[state]).join ' '}, found #{(noun for noun, regex of detect when current.match regex).join ' '}"
      e.html = html
      e.current = current
      throw e

    next = nexts[0]
    value = (current.match detect[next])[0]

    switch next
      when 'tag'
        new_tag = { name: value, attrs: {}, tags: [], is_singleton: false }
        last_tag.tags.push new_tag
        parent_tags.push last_tag

        last_tag = new_tag
        last_attr = null
      when 'attr'
        last_attr = value
      when 'tag-ws'
        if last_attr then last_tag.attrs[last_attr] = true
        last_attr = null
      when 'value', 'dvalue', 'svalue'
        last_tag.attrs[last_attr] = value
        last_attr = null
      when 'gt'
        if last_attr then last_tag.attrs[last_attr] = true
      when 'singleton', 'close-tag'
        last_tag = parent_tags.pop()
      when 'text'
        value_whitespace = (value.match /[ \r\n]*$/)[0]
        value = value.trim() + (if value_whitespace then ' ' else '')
        last_tag.tags.push value
    c += value.length
    state = next
  
  while parent_tags.length
    last_tag = parent_tags.pop()
  debug last_tag.tags if output_debug
  initial_whitespace + (render last_tag.tags, [initial_indent]).replace(/\n$/, '') + final_whitespace


render = (tags, indent = [])->
  ret = ''
  for tag in tags
    if typeof tag == 'string'
      ret += "#{indent.join('')}text #{JSON.stringify tag}\n"
    else
      ret += "#{indent.join('')}#{tag.name}"
      extra = ''
      if tag.attrs.class then  extra += '.' + tag.attrs.class.replace(/[ ]/g, '.')
      if tag.attrs.id then  extra += "\##{tag.attrs.id}"
      attrs = []
      if Object.keys(tag.attrs).length
        for own ak, av of tag.attrs
          if ak in ['class', 'id'] then continue
          
          if av == true then av = ak
          else if av == false then continue
          
          if not ak.match /^[a-zA-Z0-9]+$/ then ak = JSON.stringify ak
          
          if not av.match /^[0-9]+$/ then av = JSON.stringify av
          attrs.push "#{ak}: #{av}"

      added_something = false
      if extra.length
        ret += ' ' + JSON.stringify extra
        added_something = true

      if attrs.length
        if added_something then ret += ', '
        else ret += ' '
        ret += attrs.join(', ')
        added_something = true

      if not added_something and tag.tags.length == 0
        ret += "()\n"
      else if tag.tags.length == 0
        ret += "\n"
      else if tag.tags.length == 1 and typeof tag.tags[0] == 'string'
        if added_something then ret += ', '
        else ret += ' '
        ret += JSON.stringify tag.tags[0]
        ret += "\n"
      else
        if added_something then ret += ', '
        else ret += ' '
        ret += "->\n"
        indent.push '  '
        ret += render tag.tags, indent if tag.tags.length
        indent.pop()
  ret


debug = (tags, indent = [])->
  for tag in tags
    if typeof tag == 'string'
      console.log "#{indent.join('')}text: #{tag}"
    else
      console.log "#{indent.join('')}{ name: #{tag.name}"
      indent.push '  '
      if Object.keys(tag.attrs).length
        console.log "#{indent.join('')}attrs: {"
        indent.push '  '
        for own ak, av of tag.attrs
          console.log "#{indent.join('')}#{ak}: #{JSON.stringify av}"
        console.log "#{indent.join('')}}"
        indent.pop()
      console.log "#{indent.join('')}tags:"
      indent.push '  '
      debug tag.tags, indent if tag.tags.length
      console.log "#{indent.join('')}}"
      indent.pop()
      console.log "#{indent.join('')}}"
      indent.pop()
