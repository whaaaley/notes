
import { button, div, h1, hr, p, text, textarea } from '../lib/vnodes/html'
import RenderMarkdown from './_renderMarkdown'

let scrollLockFoo = false
let scrollLockBar = false

const onscrollFoo = (event, target) => {
  if (!scrollLockFoo) {
    scrollSync(event.target, document.getElementById('bar'))
  }

  scrollLockFoo = false
}

const onscrollBar = (event, target) => {
  if (!scrollLockBar) {
    scrollSync(event.target, document.getElementById('foo'))
  }

  scrollLockBar = false
}

const getWidth = el => el.scrollWidth - el.clientWidth
const getHeight = el => el.scrollHeight - el.clientHeight

const scrollSync = (source, target) => {
  scrollLockFoo = true
  scrollLockBar = true

  window.requestAnimationFrame(() => {
    const x = getWidth(target) * (source.scrollLeft / getWidth(source))
    const y = getHeight(target) * (source.scrollTop / getHeight(source))

    target.scroll(x, y)
  })
}

//
//
//

const updateMarkdown = (state, data) => {
  state.notes[state.activeNote].markdown = data
  return { notes: state.notes }
}

//
//
//

const Text = (tag, content) => tag([text(content)])

const Notes = data => {
  const target = []

  for (let i = 0; i < data.notes.length; i++) {
    const { markdown } = data.notes[i]
    const newline = markdown.indexOf('\n')

    const title = markdown.slice(0, newline)
    const description = markdown.slice(newline, 128)

    const classList = i === data.activeIndex
      ? 'notes-item -active'
      : 'notes-item'

    const child = div({
      class: classList,
      onclick: () => {
        data.onclick(i)
      }
    }, [
      Text(h1, title),
      Text(p, description)
    ])

    target.push(child)
  }

  return div({ class: 'notes' }, target)
}

const StyleMenu = data => {
  const classList = data.active
    ? 'format-dropdown -open'
    : 'format-dropdown -close'

  return div({ class: classList }, [
    button({ class: '-title' }, [
      text('Title')
    ]),
    button({ class: '-heading' }, [
      text('Heading')
    ]),
    button({ class: '-subheading' }, [
      text('Subheading')
    ]),
    button({ class: '-body' }, [
      text('Body')
    ]),
    button({ class: '-ordered-list' }, [
      text('1. Ordered List')
    ]),
    button({ class: '-unordered-list' }, [
      text('• Unordered List')
    ])
  ])
}

const Format = data => {
  return div({ class: 'format' }, [
    button({ class: '-ic-format-bold' }),
    button({ class: '-ic-format-italic' }),
    button({ class: '-ic-format-underline' }),
    button({ class: '-ic-format-strikethrough' }),
    hr(),
    div([
      button({
        class: '-ic-text-format',
        onclick: () => {
          data.onToggle('style')
        }
      }),
      StyleMenu({
        active: data.activeMenu === 'style'
      })
    ]),
    hr(),

    button({ class: '-ic-format-quote' }),
    button({ class: '-ic-code' }),
    button({ class: '-ic-link' })
  ])
}

const toggleFormatMenu = (state, data) => {
  return { activeMenu: state.activeMenu === data ? '' : data }
}

const Editor = (state, dispatch) => {
  const activeMarkdown = state.notes[state.activeNote].markdown

  return div({ class: 'editor' }, [
    div({ class: 'editor-titlebar' }, [
      text('Onclick Notes')
    ]),
    div({ class: 'editor-head' }, [
      button({ class: '-ic-back' }),
      h1([
        text('Notes')
      ]),
      button({ class: '-ic-add' })
    ]),
    div({ class: 'editor-ribbon' }, [
      Format({
        activeMenu: state.activeMenu,
        onToggle: name => {
          dispatch(toggleFormatMenu, name)
        }
      })
    ]),
    div({ class: 'editor-sidebar' }, [
      Notes({
        notes: state.notes,
        activeIndex: state.activeNote,
        onclick: index => {
          dispatch(() => {
            return { activeNote: index }
          })
        }
      })
    ]),
    div({ class: 'editor-textarea' }, [
      textarea({
        id: 'foo',
        value: activeMarkdown,
        onscroll: onscrollFoo,
        oninput: event => {
          dispatch(updateMarkdown, event.target.value)
        }
      })
    ]),
    div({ id: 'bar', class: 'editor-markdown', onscroll: onscrollBar }, [
      div(RenderMarkdown(activeMarkdown))
    ])
  ])
}

export default {
  view: Editor,
  onroute: () => {
    console.log('hello from editor')
  }
}
