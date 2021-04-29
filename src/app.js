
import app from './lib/pocket'
import * as notes from './actions/notes'

import * as subs from './subscriptions'

import Home from './views/home'
import Editor from './views/editor'
import Missing from './views/missing'
import Note from './views/note'

const dispatch = app({
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

subs.gtm({ id: 'GTM-KJC3N85' })

// Google Tag Manager
window.dataLayer = window.dataLayer || []
window.dataLayer.push({
  'gtm.start': Date.now(),
  'event': 'gtm.js'
})
