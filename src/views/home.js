
import { html } from '@onclick/superstatic'
import Link from './_link'

const { div } = html

const Home = (state, dispatch) => {
  return div({ class: 'home' }, [
    div({ class: 'home-main' }, [
      div({ class: 'home-logo' }),
      Link({ to: '/editor' }, 'Edit my notes')
    ])
  ])
}

export default {
  view: Home
}
