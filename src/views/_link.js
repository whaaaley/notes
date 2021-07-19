
import { link } from '@onclick/pocket'
import { html, text } from '@onclick/superstatic'

const { a } = html

export default (data, content) => {
  const props = {
    class: location.pathname === data.to ? '-active' : '',
    href: data.to,
    onclick: event => {
      event.preventDefault()
      link({ to: data.to, query: data.query })
    }
  }

  return a(props, [text(content)])
}
