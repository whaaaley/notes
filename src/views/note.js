
import { html } from '@onclick/superstatic'

import * as urlSafeCompress from '../util/urlSafeCompress'
import RenderMarkdown from './_renderMarkdown'

const { div } = html

const Note = (state, dispatch) => {
  const markdown = urlSafeCompress.unzip(state.router.query.data)

  return div({ class: 'note' }, [
    div({ class: 'markdown' }, [
      RenderMarkdown(markdown)
    ])
  ])
}

export default {
  view: Note
}
