
import { h, text } from '../lib/vnodes/h'

import fromMarkdown from 'mdast-util-from-markdown'
import toHast from 'mdast-util-to-hast'
import toHyperscript from 'hast-to-hyperscript'

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
  return toHyperscript(hfn, toHast(fromMarkdown(data)))
}
