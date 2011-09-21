(function() {
  var debug, doctypes, render;
  var __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  }, __hasProp = Object.prototype.hasOwnProperty;
  module.exports = function(html, output_debug) {
    var c, condition, current, detect, final_whitespace, initial_indent, initial_whitespace, last_attr, last_tag, new_tag, next, nexts, noun, parent_tags, possibles, post_whitespace, pre_whitespace, preserve_ws, regex, state, value, was_ws, _ref;
    preserve_ws = ['style', 'script'];
    possibles = {
      start: ['tag-open', 'doctype', 'text', 'end'],
      doctype: ['reset'],
      reset: ['tag-open', 'ie-open', 'ie-close', 'comment-open', 'tag-close', 'text', 'end'],
      end: [],
      'tag-open': ['attr-reset'],
      'tag-close': ['reset'],
      'tag-ws': ['attr', 'singleton'],
      'tag-gt': ['cdata', 'reset'],
      'singleton': ['reset'],
      'attr-reset': ['tag-ws', 'singleton', 'tag-gt'],
      'attr': ['tag-ws', 'attr-eq', 'tag-gt', 'singleton'],
      'attr-eq': ['attr-value', 'attr-dqt', 'attr-sqt'],
      'attr-dqt': ['attr-dvalue'],
      'attr-sqt': ['attr-svalue'],
      'attr-value': ['tag-ws', 'tag-gt', 'singleton'],
      'attr-dvalue': ['attr-cdqt'],
      'attr-svalue': ['attr-csqt'],
      'attr-cdqt': ['tag-ws', 'tag-gt', 'singleton'],
      'attr-csqt': ['tag-ws', 'tag-gt', 'singleton'],
      text: ['reset'],
      cdata: ['tag-close'],
      'ie-open': ['reset'],
      'ie-close': ['reset'],
      'comment-open': ['comment'],
      'comment': ['comment-close'],
      'comment-close': ['reset']
    };
    detect = {
      start: /^/,
      reset: /^/,
      doctype: /^<!doctype .*?>/i,
      end: /^$/,
      'tag-open': /^<[a-zA-Z]([-_]?[a-zA-Z0-9])*/,
      'tag-close': /^<\/[a-zA-Z]([-_]?[a-zA-Z0-9])*>/,
      'tag-ws': /^[ ]/,
      'tag-gt': /^>/,
      'singleton': /^\/>/,
      'attr-reset': /^/,
      attr: /^[a-zA-Z]([-_]?[a-zA-Z0-9])*/,
      'attr-eq': /^=/,
      'attr-dqt': /^"/,
      'attr-sqt': /^'/,
      'attr-value': /^[a-zA-Z0-9]([-_]?[a-zA-Z0-9])*/,
      'attr-dvalue': /^[^"\n]*/,
      'attr-svalue': /^[^'\n]*/,
      'attr-cdqt': /^"/,
      'attr-csqt': /^'/,
      cdata: /^(\/\/)?<!\[CDATA\[([^>]|>)*?\/\/]]>/,
      text: /^(.|\n)+?($|(?=<[!/a-zA-Z]))/,
      'ie-open': /^<!(?:--)?\[if.*?\]>/,
      'ie-close': /^<!\[endif\](?:--)?>/,
      'comment-open': /^<!--/,
      'comment': /^(.|\n)*?(?=-->)/,
      'comment-close': /^-->/
    };
    state = 'start';
    last_tag = {
      name: '',
      tags: []
    };
    last_attr = null;
    parent_tags = [];
    html = html.replace(/\t/g, '  ');
    html = html.replace(/\r/g, "\n");
    initial_whitespace = (html.match(/^[ \n]*/))[0];
    initial_indent = initial_whitespace.match(/[ ]*$/)[0];
    initial_whitespace = initial_whitespace.substring(0, initial_whitespace.length - initial_indent.length);
    final_whitespace = (html.match(/[ \n]*$/))[0];
    html = html.trim();
    if (output_debug) {
      console.log({
        initial_whitespace: initial_whitespace,
        initial_indent: initial_indent,
        final_whitespace: final_whitespace,
        html: html
      });
    }
    was_ws = initial_whitespace.length ? true : false;
    c = 0;
    while (state !== 'end') {
      current = html.substring(c);
      if (!possibles[state]) {
        throw new Error("Missing possibles for " + state);
      }
      nexts = (function() {
        var _i, _len, _ref, _results;
        _ref = possibles[state];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          next = _ref[_i];
          if (current.match(detect[next])) {
            _results.push(next);
          }
        }
        return _results;
      })();
      if (!nexts.length) {
        throw new Error("At: " + state + " (" + (JSON.stringify(current.length > 10 ? current.substring(0, 10) + '...' : current)) + "), expected: " + (((function() {
          var _i, _len, _ref, _results;
          _ref = possibles[state];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            noun = _ref[_i];
            _results.push(noun);
          }
          return _results;
        })()).join(' ')) + ", found " + (((function() {
          var _results;
          _results = [];
          for (noun in detect) {
            regex = detect[noun];
            if (current.match(regex)) {
              _results.push(noun);
            }
          }
          return _results;
        })()).join(' ')));
      }
      next = nexts[0];
      value = (current.match(detect[next]))[0];
      c += value.length;
      if (output_debug) {
        console.log({
          state: state,
          next: next,
          value: value
        });
      }
      switch (next) {
        case 'doctype':
          last_tag.tags.push({
            doctype: value.match(/^<!doctype (.*?)>$/i)[1].toLowerCase()
          });
          break;
        case 'tag-open':
          new_tag = {
            name: value.substring(1),
            attrs: {},
            tags: [],
            is_singleton: false
          };
          last_tag.tags.push(new_tag);
          parent_tags.push(last_tag);
          if (output_debug) {
            console.log('push: ', parent_tags.length, last_tag);
          }
          last_tag = new_tag;
          last_attr = null;
          break;
        case 'attr':
          if (output_debug && last_attr) {
            console.log({
              last_attr: last_attr
            });
          }
          last_attr = value;
          break;
        case 'tag-ws':
          if (last_attr) {
            last_tag.attrs[last_attr] = true;
          }
          last_attr = null;
          break;
        case 'attr-value':
        case 'attr-dvalue':
        case 'attr-svalue':
          last_tag.attrs[last_attr] = value;
          last_attr = null;
          break;
        case 'tag-gt':
          if (last_attr) {
            last_tag.attrs[last_attr] = true;
          }
          break;
        case 'singleton':
        case 'tag-close':
          last_tag = parent_tags.pop();
          if (output_debug) {
            console.log('pop: ', parent_tags.length, last_tag);
          }
          break;
        case 'text':
          if (_ref = last_tag.name, __indexOf.call(preserve_ws, _ref) >= 0) {
            last_tag.tags.push(value);
          } else {
            pre_whitespace = (value.match(/^[ \n]*/))[0];
            post_whitespace = (value.match(/[ \n]*$/))[0];
            last_tag.tags.push((pre_whitespace ? ' ' : '') + value.trim() + (post_whitespace ? ' ' : ''));
          }
          break;
        case 'cdata':
          last_tag.tags.push(value);
          break;
        case 'comment':
          last_tag.tags.push({
            comment: value
          });
          break;
        case 'ie-open':
          condition = value.match(/^<!(?:--)?\[if(.*?)\]>/)[1].trim();
          new_tag = {
            name: 'ie',
            attrs: {},
            tags: [],
            is_singleton: false,
            ie_condition: condition
          };
          last_tag.tags.push(new_tag);
          parent_tags.push(last_tag);
          if (output_debug) {
            console.log('push: ', parent_tags.length, last_tag);
          }
          last_tag = new_tag;
          last_attr = null;
      }
      state = next;
    }
    if (output_debug) {
      console.log(parent_tags.length, last_tag);
    }
    while (parent_tags.length) {
      last_tag = parent_tags.pop();
    }
    if (output_debug) {
      debug(last_tag.tags);
    }
    return initial_whitespace + (render(last_tag.tags, [initial_indent])).replace(/\n$/, '') + final_whitespace;
  };
  doctypes = {
    'html': 'default',
    'html': '5',
    '<?xml version="1.0" encoding="utf-8" ?>': 'xml',
    'html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"': 'transitional',
    'html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"': 'strict',
    'html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd"': 'frameset',
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"': '1.1',
    'html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd"': 'basic',
    'html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.2//EN" "http://www.openmobilealliance.org/tech/DTD/xhtml-mobile12.dtd"': 'mobile',
    'html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "ce-html-1.0-transitional.dtd"': 'ce'
  };
  render = function(tags, indent) {
    var added_something, ak, attrs, av, extra, mapped, ret, str, tag, _i, _len, _ref;
    if (indent == null) {
      indent = [];
    }
    ret = '';
    for (_i = 0, _len = tags.length; _i < _len; _i++) {
      tag = tags[_i];
      if (typeof tag === 'string') {
        str = tag;
        if (str.trim().length > 0) {
          if (str.match(/[\n]/)) {
            str = str.replace(/"""/g, '"\\""').replace(/^\n|\n$/g, '');
            ret += "" + (indent.join('')) + "text \"\"\"\n" + str + "\n\"\"\"";
          } else {
            ret += "" + (indent.join('')) + "text " + (JSON.stringify(tag));
          }
          ret += "\n";
        }
      } else if (tag.doctype) {
        mapped = doctypes[tag.doctype.replace(/\s+/g, ' ')];
        if (mapped === '5') {
          ret += "doctype 5";
        } else {
          ret += "doctype " + (JSON.stringify((mapped != null ? mapped : tag.doctype)));
        }
        ret += "\n";
      } else if (tag.comment) {
        ret += "" + (indent.join('')) + "comment ";
        str = tag.comment.trim();
        if (str.match(/\n/)) {
          str = str.replace(/"""/g, '"\\""').replace(/^\n|\n$/g, '');
          ret += "" + (indent.join('')) + "text \"\"\"\n" + str + "\n\"\"\"";
        } else {
          ret += JSON.stringify(str);
        }
        ret += "\n";
      } else {
        ret += "" + (indent.join('')) + tag.name;
        extra = '';
        if (tag.attrs["class"]) {
          extra += '.' + tag.attrs["class"].replace(/[ ]/g, '.');
        }
        if (tag.attrs.id) {
          extra += "\#" + tag.attrs.id;
        }
        attrs = [];
        if (tag.attrs && Object.keys(tag.attrs).length) {
          _ref = tag.attrs;
          for (ak in _ref) {
            if (!__hasProp.call(_ref, ak)) continue;
            av = _ref[ak];
            if (ak === 'class' || ak === 'id') {
              continue;
            }
            if (av === true) {
              av = ak;
            } else if (av === false) {
              continue;
            }
            if (!ak.match(/^[a-zA-Z0-9]+$/)) {
              ak = JSON.stringify(ak);
            }
            if (!av.match(/^[0-9]+$/)) {
              av = JSON.stringify(av);
            }
            attrs.push("" + ak + ": " + av);
          }
        }
        added_something = false;
        if (extra.length) {
          ret += ' ' + JSON.stringify(extra);
          added_something = true;
        }
        if (tag.ie_condition) {
          ret += ' ' + JSON.stringify(tag.ie_condition);
          added_something = true;
        }
        if (attrs.length) {
          if (added_something) {
            ret += ', ';
          } else {
            ret += ' ';
          }
          ret += attrs.join(', ');
          added_something = true;
        }
        if (!added_something && tag.tags.length === 0) {
          ret += "()\n";
        } else if (tag.tags.length === 0) {
          ret += "\n";
        } else if (tag.tags.length === 1 && typeof tag.tags[0] === 'string') {
          str = tag.tags[0];
          if (str.trim().length > 0) {
            if (added_something) {
              ret += ', ';
            } else {
              ret += ' ';
            }
            if (str.match(/[\n]/)) {
              str = str.replace(/"""/g, '"\\""').replace(/^\n|\n$/g, '');
              ret += "\"\"\"\n" + str + "\n\"\"\"";
            } else {
              ret += JSON.stringify(str);
            }
            ret += "\n";
          }
        } else {
          if (added_something) {
            ret += ', ';
          } else {
            ret += ' ';
          }
          ret += "->\n";
          indent.push('  ');
          if (tag.tags.length) {
            ret += render(tag.tags, indent);
          }
          indent.pop();
        }
      }
    }
    return ret;
  };
  debug = function(tags, indent) {
    var ak, av, mapped, tag, _i, _len, _results;
    if (indent == null) {
      indent = [];
    }
    _results = [];
    for (_i = 0, _len = tags.length; _i < _len; _i++) {
      tag = tags[_i];
      _results.push((function() {
        var _ref;
        if (typeof tag === 'string') {
          return console.log("" + (indent.join('')) + "text: " + tag);
        } else if (tag.doctype) {
          mapped = doctypes[tag.doctype.replace(/\s+/g, ' ')];
          return console.log("" + (indent.join('')) + "doctype: " + (JSON.stringify(tag.doctype)) + " => " + (JSON.stringify(mapped)));
        } else if (tag.comment) {
          return console.log("" + (indent.join('')) + "comment: " + (JSON.stringify(tag.comment)));
        } else {
          console.log("" + (indent.join('')) + "{ name: " + tag.name);
          indent.push('  ');
          if (Object.keys(tag.attrs).length) {
            console.log("" + (indent.join('')) + "attrs: {");
            indent.push('  ');
            _ref = tag.attrs;
            for (ak in _ref) {
              if (!__hasProp.call(_ref, ak)) continue;
              av = _ref[ak];
              console.log("" + (indent.join('')) + ak + ": " + (JSON.stringify(av)));
            }
            console.log("" + (indent.join('')) + "}");
            indent.pop();
          }
          if (tag.ie_condition) {
            console.log("" + (indent.join('')) + "ie_condition: " + (JSON.stringify(tag.ie_condition)));
          }
          console.log("" + (indent.join('')) + "tags:");
          indent.push('  ');
          if (tag.tags.length) {
            debug(tag.tags, indent);
          }
          console.log("" + (indent.join('')) + "}");
          indent.pop();
          console.log("" + (indent.join('')) + "}");
          return indent.pop();
        }
      })());
    }
    return _results;
  };
}).call(this);
