
import { div } from '../lib/vnodes/html'
import Link from './_link'

const Home = (state, dispatch) => {
  return div({ class: 'home' }, [
    div({ class: 'home-main' }, [
      div({ class: 'home-logo' }),
      Link({ to: '/editor' }, 'Edit my notes')
    ])
  ])
}

export default {
  view: Home,
  onroute: () => {
    console.log('hello from home')
  }
}
