
import { button, div, h1, p, span, text, textarea } from '../lib/vnodes/html'
import Link from './_link'
import RenderMarkdown from './_renderMarkdown'
import * as notes from '../actions/notes'

let scrollLockFoo = false
let scrollLockBar = false

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

const toggleFormatMenu = (state, data) => {
  return { activeMenu: state.activeMenu === data ? '' : data }
}

const Notes = data => {
  const target = []

  for (let i = data.notes.length; i--;) {
    const { markdown } = data.notes[i]

    let title = 'New Note'
    let description = '(This note is empty)'

    if (markdown.length) {
      const newline = markdown.indexOf('\n')
      const end = newline === -1 ? 128 : newline

      title = markdown.slice(0, end)
      description = markdown.slice(end, 128)

      if (!/\S/g.test(description)) {
        description = '(No additional text)'
      }
    }

    const classList = i === data.activeIndex
      ? 'notes-item -active'
      : 'notes-item'

    const child = button({
      class: classList,
      onclick: () => {
        data.onClick(i)
      },
      onkeydown: event => {
        if (event.code === 'Backspace' || event.code === 'Delete') {
          data.onRemove(i)
        }
      }
    }, [
      h1([
        text(title)
      ]),
      p([
        text(description)
      ])
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
    })
    // button({
    //   class: '-ic-format-strikethrough',
    //   onclick: () => {
    //     formatSelection('~~', 2)
    //   }
    // }),
    // hr(),
    // div([
    //   button({
    //     class: '-ic-text-format',
    //     onclick: () => {
    //       data.onToggle('style')
    //     }
    //   }),
    //   StyleMenu({
    //     active: data.activeMenu === 'style'
    //   })
    // ]),
    // hr(),
    // button({ class: '-ic-format-quote' }),
    // button({ class: '-ic-code' }),
    // button({ class: '-ic-link' })
  ])
}

const Editor = (state, dispatch) => {
  const foo = { current: null }
  const bar = { current: null }

  const activeMarkdown = state.notes[state.activeNote].markdown

  return div({ class: 'editor' }, [
    div({ class: 'editor-titlebar' }, [
      Link({ to: '/' }),
      h1([
        text('Onclick Notes'),
        span([
          text('[Beta]')
        ])
      ]),
      div([
        // button({
        //   onclick: () => {
        //     alert('Comming soon...')
        //   }
        // }, [
        //   text('Login')
        // ])
      ])
    ]),
    div({ class: 'editor-head' }, [
      // button({ class: '-ic-back' }),
      div(),
      h1([
        text('Notes')
      ]),
      button({
        class: '-ic-add',
        onclick: () => {
          dispatch(notes.create)
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
        onClick: index => {
          dispatch(() => {
            return { activeNote: index }
          })
        },
        onRemove: index => {
          dispatch(notes.remove, index)
        }
      }),
      div({ class: 'editor-footer' }, [
        h1([
          text('© Dustin Dowell, 2021')
        ]),
        p([
          text('By using this site you agree to our\nTerms of Use and Privacy Policy.')
        ])
      ])
    ]),
    div({ class: 'editor-textarea' }, [
      textarea({
        id: 'foo',
        ref: foo,
        key: 'textarea',
        value: activeMarkdown,
        onscroll: event => {
          !scrollLockFoo && scrollSync(event.target, bar.current)
          scrollLockFoo = false
        },
        oninput: event => {
          dispatch(notes.update, event.target.value)
        }
      })
    ]),
    div({
      id: 'bar',
      ref: bar,
      key: 'markdown',
      class: 'editor-markdown markdown',
      onscroll: event => {
        !scrollLockBar && scrollSync(event.target, foo.current)
        scrollLockBar = false
      }
    }, [
      div([
        RenderMarkdown(activeMarkdown)
      ])
    ])
  ])
}

export default {
  view: Editor,
  onroute: () => {
    console.log('hello from editor')
  }
}
