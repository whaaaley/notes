
// NOTE: I would be poggers if someone made an HTML to vdom parser. I tried my
// best to find something that seemed reliable.

// NOTE: An alternative solution would be to walk the markdown AST and convert
// it to Superfine nodes manually. I have to style all the data types anyway.

import micromark from 'micromark'
import fromDom from 'hast-util-from-dom'
import toHyperscript from 'hast-to-hyperscript'

import { h, text } from '../lib/vnodes/h'

const parser = new DOMParser()

const hfn = (tag, props, children) => {
  const node = h(tag)(props, children)
  const ch = node.children

  for (let i = 0; i < ch.length; i++) {
    const item = ch[i]

    if (typeof item === 'string') {
      ch[i] = text(item)
    }
  }

  return node
}

export default data => {
  const dom = parser.parseFromString(micromark(data), 'text/html').body
  return toHyperscript(hfn, fromDom(dom)).children
}
