
import app from './lib/pocket'
import * as notes from './actions/notes'

import Home from './views/home'
import Editor from './views/editor'
import Missing from './views/missing'

// const testNotes = [
//   {
//     date: Date.now(),
//     markdown: 'The quick brown fox jumped over the lazy dog.\n\n```\nbig code block\n```'
//   },
//   {
//     date: Date.now(),
//     markdown: '# hello *world!*\n\n## hello *world!*\n### hello *world!*\n#### hello *world!*\n##### hello *world!*\n###### hello *world!*\n\n+ one\n+ two\n+ three\n\n+ one\n+ two\n+ three\n\n+ one\n+ two\n+ three\n\n+ one\n+ two\n+ three\n\n+ one\n+ two\n+ three\n\n+ one\n+ two\n+ three\n\n+ one\n+ two\n+ three\n\n+ one\n+ two\n+ three\n\n+ one\n+ two\n+ three\n\n+ one\n+ two\n+ three'
//   },
//   {
//     date: Date.now(),
//     markdown: '# My Fruit List\n\n## This is a list of fruit!\n\n+ Apple\n+ Banana\n+ Orange\n+ Grape'
//   },
//   {
//     date: Date.now(),
//     markdown: '# Note 3\n## hello *world!*'
//   }
// ]

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
