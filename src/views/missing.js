
import { div, text } from '../lib/vnodes/html'
import main from './_main'

const Text = (h, data) => h([text(data)])

const Missing = (state, dispatch) => {
  return div({ class: 'missing' }, [
    Text(div, '404 NOT FOUND')
  ])
}

export default {
  view: main(Missing),
  onroute: () => {}
}
