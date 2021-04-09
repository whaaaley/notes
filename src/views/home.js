
import { div } from '../lib/vnodes/html'

import link from './_link'

const Home = (state, dispatch) => {
  return div({ class: 'home' }, [
    div({ class: 'home-main' }, [
      link({ to: '/editor' }, 'Edit my notes')
    ])
  ])
}

export default {
  view: Home,
  onroute: () => {
    console.log('hello from home')
  }
}
