
import app from './lib/pocket'

import Home from './views/home'
import Editor from './views/editor'
// import Missing from './views/missing'

import * as subs from './subscriptions'

app({
  state: {
    activeMenu: '',
    activeNote: 0,
    notes: [
      {
        date: Date.now(),
        markdown: '# Note 1!\n\n## hello *world!*\n### hello *world!*\n#### hello *world!*\n##### hello *world!*\n###### hello *world!*\n\n+ one\n+ two\n+ three\n\n+ one\n+ two\n+ three\n\n+ one\n+ two\n+ three\n\n+ one\n+ two\n+ three\n\n+ one\n+ two\n+ three\n\n+ one\n+ two\n+ three\n\n+ one\n+ two\n+ three\n\n+ one\n+ two\n+ three\n\n+ one\n+ two\n+ three\n\n+ one\n+ two\n+ three'
      },
      {
        date: Date.now(),
        markdown: '# My Fruit List\n\n## This is a list of fruit!\n\n+ Apple\n+ Banana\n+ Orange\n+ Grape'
      },
      {
        date: Date.now(),
        markdown: '# Note 3\n## hello *world!*'
      }
    ],
    footer: {
      year: new Date().getFullYear()
    }
  },
  pages: {
    '/': Home,
    '/editor': Editor
    // '/missing': Missing
  },
  mount: (state, dispatch) => {
    subs.gtm({ id: '' })
  }
})

// Google Tag Manager
window.dataLayer = window.dataLayer || []
window.dataLayer.push({
  'gtm.start': Date.now(),
  'event': 'gtm.js'
})
