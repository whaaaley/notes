
// https://github.com/jorgebucaran/superfine
// https://github.com/jorgebucaran/superfine/issues/184

const SSR_NODE = 1
const TEXT_NODE = 3
const EMPTY_OBJ = {}
const EMPTY_ARR = []
const SVG_NS = 'http://www.w3.org/2000/svg'

const listener = function (event) {
  this.events[event.type](event)
}

const getKey = vdom => vdom == null ? vdom : vdom.key

const patchProperty = (node, key, oldValue, newValue, isSvg) => {
  if (key === 'key') {
    return // exit
  }

  // react-like refs
  if (key === 'ref') {
    if (oldValue === newValue) {
      return // exit
    }

    oldValue && (oldValue.current = null)
    newValue && (newValue.current = node)

    return // exit
  }

  if (key.startsWith('on')) {
    key = key.slice(2)

    if (!((node.events || (node.events = {}))[key] = newValue)) {
      node.removeEventListener(key, listener)
    } else if (!oldValue) {
      node.addEventListener(key, listener)
    }

    return // exit
  }

  // <!-- refactored until here -->

  if (!isSvg && key !== 'list' && key !== 'form' && key in node) {
    node[key] = newValue == null ? '' : newValue
  } else if (newValue == null || newValue === false) {
    node.removeAttribute(key)
  } else {
    node.setAttribute(key, newValue)
  }
}

const createNode = (vdom, isSvg) => {
  const props = vdom.props
  const node = vdom.type === TEXT_NODE
    ? document.createTextNode(vdom.tag)
    : (isSvg = isSvg || vdom.tag === 'svg')
        ? document.createElementNS(SVG_NS, vdom.tag, { is: props.is })
        : document.createElement(vdom.tag, { is: props.is })

  for (const k in props) {
    patchProperty(node, k, null, props[k], isSvg)
  }

  for (let i = 0; i < vdom.children.length; i++) {
    node.appendChild(
      createNode((vdom.children[i] = vdomify(vdom.children[i])), isSvg)
    )
  }

  return (vdom.node = node)
}

const patchNode = (parent, node, oldVNode, newVNode, isSvg) => {
  if (oldVNode === newVNode) {
    // empty
  } else if (
    oldVNode != null &&
    oldVNode.type === TEXT_NODE &&
    newVNode.type === TEXT_NODE
  ) {
    if (oldVNode.tag !== newVNode.tag) node.nodeValue = newVNode.tag
  } else if (oldVNode == null || oldVNode.tag !== newVNode.tag) {
    node = parent.insertBefore(
      createNode((newVNode = vdomify(newVNode)), isSvg),
      node
    )
    if (oldVNode != null) {
      parent.removeChild(oldVNode.node)
    }
  } else {
    let tmpVKid
    let oldVKid
    let oldKey
    let newKey
    const oldProps = oldVNode.props
    const newProps = newVNode.props
    const oldVKids = oldVNode.children
    const newVKids = newVNode.children
    let oldHead = 0
    let newHead = 0
    let oldTail = oldVKids.length - 1
    let newTail = newVKids.length - 1

    isSvg = isSvg || newVNode.tag === 'svg'

    for (var i in { ...oldProps, ...newProps }) {
      if (
        (i === 'value' || i === 'selected' || i === 'checked'
          ? node[i]
          : oldProps[i]) !== newProps[i]
      ) {
        patchProperty(node, i, oldProps[i], newProps[i], isSvg)
      }
    }

    while (newHead <= newTail && oldHead <= oldTail) {
      if (
        (oldKey = getKey(oldVKids[oldHead])) == null ||
        oldKey !== getKey(newVKids[newHead])
      ) {
        break
      }

      patchNode(
        node,
        oldVKids[oldHead].node,
        oldVKids[oldHead++],
        (newVKids[newHead] = vdomify(newVKids[newHead++])),
        isSvg
      )
    }

    while (newHead <= newTail && oldHead <= oldTail) {
      if (
        (oldKey = getKey(oldVKids[oldTail])) == null ||
        oldKey !== getKey(newVKids[newTail])
      ) {
        break
      }

      patchNode(
        node,
        oldVKids[oldTail].node,
        oldVKids[oldTail--],
        (newVKids[newTail] = vdomify(newVKids[newTail--])),
        isSvg
      )
    }

    if (oldHead > oldTail) {
      while (newHead <= newTail) {
        node.insertBefore(
          createNode((newVKids[newHead] = vdomify(newVKids[newHead++])), isSvg),
          (oldVKid = oldVKids[oldHead]) && oldVKid.node
        )
      }
    } else if (newHead > newTail) {
      while (oldHead <= oldTail) {
        node.removeChild(oldVKids[oldHead++].node)
      }
    } else {
      for (var keyed = {}, newKeyed = {}, i = oldHead; i <= oldTail; i++) {
        if ((oldKey = oldVKids[i].key) != null) {
          keyed[oldKey] = oldVKids[i]
        }
      }

      while (newHead <= newTail) {
        oldKey = getKey((oldVKid = oldVKids[oldHead]))
        newKey = getKey((newVKids[newHead] = vdomify(newVKids[newHead])))

        if (
          newKeyed[oldKey] ||
          (newKey != null && newKey === getKey(oldVKids[oldHead + 1]))
        ) {
          if (oldKey == null) {
            node.removeChild(oldVKid.node)
          }
          oldHead++
          continue
        }

        if (newKey == null || oldVNode.type === SSR_NODE) {
          if (oldKey == null) {
            patchNode(
              node,
              oldVKid && oldVKid.node,
              oldVKid,
              newVKids[newHead],
              isSvg
            )
            newHead++
          }
          oldHead++
        } else {
          if (oldKey === newKey) {
            patchNode(node, oldVKid.node, oldVKid, newVKids[newHead], isSvg)
            newKeyed[newKey] = true
            oldHead++
          } else {
            if ((tmpVKid = keyed[newKey]) != null) {
              patchNode(
                node,
                node.insertBefore(tmpVKid.node, oldVKid && oldVKid.node),
                tmpVKid,
                newVKids[newHead],
                isSvg
              )
              newKeyed[newKey] = true
            } else {
              patchNode(
                node,
                oldVKid && oldVKid.node,
                null,
                newVKids[newHead],
                isSvg
              )
            }
          }
          newHead++
        }
      }

      while (oldHead <= oldTail) {
        if (getKey((oldVKid = oldVKids[oldHead++])) == null) {
          node.removeChild(oldVKid.node)
        }
      }

      for (var i in keyed) {
        if (newKeyed[i] == null) {
          node.removeChild(keyed[i].node)
        }
      }
    }
  }

  return (newVNode.node = node)
}

const vdomify = newVNode =>
  newVNode !== true && newVNode !== false && newVNode ? newVNode : text('')

const recycleNode = node =>
  node.nodeType === TEXT_NODE
    ? text(node.nodeValue, node)
    : createVNode(
      node.nodeName.toLowerCase(),
      EMPTY_OBJ,
      EMPTY_ARR.map.call(node.childNodes, recycleNode),
      SSR_NODE,
      node
    )

const createVNode = (tag, props, children, type, node) => ({
  tag,
  props,
  key: props.key,
  children,
  type,
  node
})

export const text = (value, node) =>
  createVNode(value, EMPTY_OBJ, EMPTY_ARR, TEXT_NODE, node)

export const h = (tag, props, children = EMPTY_ARR) =>
  createVNode(tag, props, Array.isArray(children) ? children : [children])

export const patch = (node, vdom) => (
  ((node = patchNode(
    node.parentNode,
    node,
    node.vdom || recycleNode(node),
    vdom
  )).vdom = vdom),
  node
)
