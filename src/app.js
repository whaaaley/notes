
import app from './lib/pocket'
import * as notes from './actions/notes'

import Home from './views/home'
import Editor from './views/editor'
import Missing from './views/missing'

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
  rewrites: [
    { source: /[a-zA-Z0-9+/]*={0,3}$/, destination: '/file' }
  ],
  pages: {
    '/': Home,
    '/editor': Editor,
    '/missing': Missing
  }
})

dispatch(notes.restore)

// Google Tag Manager
window.dataLayer = window.dataLayer || []
window.dataLayer.push({
  'gtm.start': Date.now(),
  'event': 'gtm.js'
})
