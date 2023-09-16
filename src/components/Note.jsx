import { PropTypes } from "prop-types"

const Note = ({ note, toggleImportance }) => {
  const label = note.important ? "make not important" : "make important"
  return (
    <li className="note">
      {note.content}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}
const notePropTypes = PropTypes.shape({
  content: PropTypes.string,
  important: PropTypes.bool,
})
Note.propTypes = {
  note: notePropTypes,
  toggleImportance: PropTypes.func,
}

export default Note
