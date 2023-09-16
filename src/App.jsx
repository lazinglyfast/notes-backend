import { PropTypes } from "prop-types"
import { useState, useEffect } from "react"
import Note from "./components/Note"
import Notification from "./components/Notification"
import Footer from "./components/Footer"
import notesService from "./services/notes"

const App = () => {
  const [notes, setNotes] = useState(null)
  const [newNote, setNewNote] = useState("a new note...")
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  const hook = () => {
    notesService
      .list()
      .then(data => {
        setNotes(data)
      })
  }
  // [] means run only on first render
  useEffect(hook, [])

  const addNote = (event) => {
    event.preventDefault()

    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    }

    notesService
      .create(noteObject)
      .then(data => {
        setNotes(notes.concat(data))
        setNewNote("")
      })
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const toggleImportanceOf = (note) => {
    // shallow!
    const changedNote = {
      ...note,
      important: !note.important
    }

    //HTTP PUT replaces
    //HTTP PATCH changes some properties
    notesService
      .update(changedNote)
      .then((data) => {
        setNotes(notes.map(n => n.id == note.id ? data : n))
      })
      .catch(() => {
        setErrorMessage(`the note '${note.content}' was already deleted from the server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id != note.id))
      })
  }

  if (!notes) {
    return null
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <ul>
        {
          notes
            .filter((note) => showAll || note.important)
            .map((note) => {
              return (
                <Note
                  key={note.id}
                  note={note}
                  toggleImportance={() => toggleImportanceOf(note)} />
              )
            })
        }
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
      <button onClick={() => setShowAll(!showAll)}>
        {showAll ? "Show only important notes" : "Show all notes"}
      </button>
      <Footer />
    </div>
  )
}
const notePropTypes = PropTypes.shape({
  content: PropTypes.string,
})
App.propTypes = {
  notes: PropTypes.arrayOf(notePropTypes),
}

export default App
