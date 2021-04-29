
import { patch } from './superfine'
import { decode } from './routerLib'

/**
 * Debounce wrapper around `window.requestAnimationFrame`
 * @function enqueue
 */

const enqueue = render => {
  let lock = false

  const callback = () => {
    lock = false
    render()
  }

  return () => {
    if (!lock) {
      lock = true
      window.requestAnimationFrame(callback)
    }
  }
}

/**
 * Collect state changes for batch updates
 * @function collect
 */

const renderEvent = new CustomEvent('render')

const collect = (state, render) => {
  let batch = [state]

  const schedule = enqueue(() => {
    state = Object.assign.apply(Object, batch)
    batch = [state]

    render(state)
    window.dispatchEvent(renderEvent)
  })

  return result => {
    batch.push(result)
    schedule()
  }
}

/**
 * Minimalist state manager with agressive optimization
 * @function pocket
 */

const pocket = (state, render) => {
  const push = collect(state, render)

  const dispatch = (action, data) => {
    const result = action(state, data)

    console.log(
      'Dispatch >>',
      action.name || '(anon)',
      typeof result === 'function' ? '(effect)' : result
    )

    if (typeof result === 'function') {
      const effect = result(dispatch)

      if (effect && effect.then) {
        return effect.then(push)
      }
    } else {
      push(result)
    }
  }

  return dispatch
}

/**
 * An action that syncs router state with `window.location`
 * @function sync
 */

const sync = state => {
  const search = location.search

  state.router.to = location.pathname
  state.router.query = search.startsWith('?') ? decode(search) : ''

  return { router: state.router }
}

/**
 * Initialize the app
 * @module pocket
 */

export default init => {
  const node = document.getElementById('app')
  let route

  init.state.router = {
    query: '',
    to: '/'
  }

  const dispatch = pocket(init.state, state => {
    patch(node, route.view(state, dispatch))
  })

  const listener = () => {
    dispatch(sync)

    route = init.pages[init.state.router.to] || init.pages['/missing']

    if (typeof route.onroute === 'function') {
      route.onroute(init.state, dispatch)
    }
  }

  listener()

  window.addEventListener('pushstate', listener)
  window.addEventListener('popstate', listener)

  return dispatch
}
