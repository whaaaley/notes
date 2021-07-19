
import { pocket, router } from '@onclick/pocket'
import { patch } from 'superfine'

import * as notes from './actions/notes'

import Home from './views/home'
import Editor from './views/editor'
import Missing from './views/missing'
import Note from './views/note'

const node = document.getElementById('app')
const app = foo => router(foo, bar => pocket(bar, view => patch(node, view)))

export const { getState, dispatch } = app({
  state: {
    activeMenu: '',

    activeNote: 0,
    notes: [{
      date: Date.now(),
      markdown: ''
    }],

    footer: {
      year: new Date().getFullYear()
    }
  },
  pages: {
    '/': Home,
    '/editor': Editor,
    '/missing': Missing,
    '/note': Note
  }
})

dispatch(notes.restore)

/**
 *
 * Google Tag Manager
 *
 */

if (process.env.APP_PROD === true) {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    'gtm.start': Date.now(),
    'event': 'gtm.js'
  })

  window.addEventListener('load', () => {
    const script = document.createElement('script')

    script.async = true
    script.defer = true

    script.id = 'gtm'
    script.src = 'https://googletagmanager.com/gtm.js?id=GTM-KJC3N85'

    document.body.appendChild(script)
  })
}
