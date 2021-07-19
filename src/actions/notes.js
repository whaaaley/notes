
const persist = data => {
  localStorage.setItem('notes', JSON.stringify(data))
}

export const create = state => {
  const length = state.notes.length

  state.notes.push({
    date: Date.now(),
    markdown: ''
  })

  persist(state.notes)

  return {
    activeNote: length,
    notes: state.notes
  }
}

export const update = (state, data) => {
  state.notes[state.activeNote].markdown = data

  persist(state.notes)

  return { notes: state.notes }
}

export const remove = (state, index) => {
  state.notes.splice(index, 1)

  if (state.notes.length < 1) {
    state.notes.push({
      date: Date.now(),
      markdown: ''
    })
  }

  persist(state.notes)

  return {
    activeNote: index,
    notes: state.notes
  }
}

export const restore = () => {
  const json = localStorage.getItem('notes')

  if (json !== null) {
    return { notes: JSON.parse(json) }
  }
}
