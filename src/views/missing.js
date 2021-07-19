
import { html, text } from '@onclick/superstatic'

const { div } = html

const Missing = (state, dispatch) => {
  return div({ class: 'missing' }, [
    div([
      text('404 NOT FOUND')
    ])
  ])
}

export default {
  view: Missing
}
