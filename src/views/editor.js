
import { button, div, h1, hr, p, text, textarea } from '../lib/vnodes/html'
import RenderMarkdown from './_renderMarkdown'

let scrollLockFoo = false
let scrollLockBar = false

const onscrollFoo = event => {
  if (!scrollLockFoo) {
    scrollSync(event.target, document.getElementById('bar'))
  }

  scrollLockFoo = false
}

const onscrollBar = event => {
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

const createNote = (state, data) => {
  const length = state.notes.length

  state.notes.push({
    date: Date.now(),
    markdown: '# New Note ' + (length + 1) + '\n## All systems go!'
  })

  return {
    activeNote: length,
    notes: state.notes
  }
}

const toggleFormatMenu = (state, data) => {
  return { activeMenu: state.activeMenu === data ? '' : data }
}

//
//
//

const Text = (tag, content) => tag([text(content)])

const Notes = data => {
  const target = []

  for (let i = data.notes.length; i--;) {
    const { markdown } = data.notes[i]
    const newline = markdown.indexOf('\n')
    const end = newline === -1 ? 128 : newline

    const title = markdown.slice(0, end)
    const description = markdown.slice(end, 128)

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

const formatSelection = (delimiter, length) => {
  const el = document.getElementById('foo')

  const start = el.selectionStart
  const end = el.selectionEnd

  const text = delimiter + el.value.slice(start, end) + delimiter

  // NOTE: document.execCommand is deprecated
  // There might be a new way of doing this with content editable
  document.execCommand('insertText', false, text)
  el.setSelectionRange(start + length, end + length)
}

const Format = data => {
  return div({ class: 'format' }, [
    button({
      class: '-ic-format-bold',
      onclick: () => {
        formatSelection('**', 2)
      }
    }),
    button({
      class: '-ic-format-italic',
      onclick: () => {
        formatSelection('_', 1)
      }
    }),
    button({
      class: '-ic-format-strikethrough',
      onclick: () => {
        formatSelection('~~', 2)
      }
    }),
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

const Editor = (state, dispatch) => {
  const activeMarkdown = state.notes[state.activeNote].markdown

  return div({ class: 'editor' }, [
    div({ class: 'editor-titlebar' }, [
      h1([
        text('Onclick Notes')
      ]),
      div([
        button({
          onclick: () => {
            alert('Comming soon...')
          }
        }, [
          text('Login')
        ])
      ])
    ]),
    div({ class: 'editor-head' }, [
      button({ class: '-ic-back' }),
      h1([
        text('Notes')
      ]),
      button({
        class: '-ic-add',
        onclick: () => {
          dispatch(createNote)
        }
      })
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
    div({ id: 'bar', class: 'editor-markdown markdown', onscroll: onscrollBar }, [
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
