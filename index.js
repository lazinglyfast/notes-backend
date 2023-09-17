import express, { json } from "express"
import cors from "cors"
import Note from "./models/note.js"

const app = express()
app.use(cors())
app.use(json())
app.use(express.static("build"))

app.get("/", (_req, res) => {
  res.send("<h1>Hello, World!</h1>")
})

app.get("/api/notes", (_req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes)
  })
})

app.get("/api/notes/:id", (req, res) => {
  Note.findById(req.params.id).then(note => {
    // const note = notes.find(note => note.id === id)
    // if (note) {
    res.json(note)
    // } else {
    //   res
    //     .status(404)
    //     .send(`Notes with id ${id} not found`)
    //     .end()
    // }
  })
})

app.delete("/api/notes/:id", (req, res) => {
  Note.findById(req.params.id).then(note => {
    note.deleteOne()
    res.status(204).end()
  })
  // const id = Number(req.params.id)
  // notes = notes.filter(note => note.id !== id)
  // res.status(204).end()
})

// const generateId = () => {
//   const maxId = notes.reduce((max, n) => n.id > max ? n.id : max, Number.MIN_VALUE)
//   return maxId + 1
// }

app.post("/api/notes", (req, res) => {
  const data = req.body
  if (!data.content) {
    return res.status(400).json({
      error: "content is missing",
    })
  }
  const note = new Note({
    content: data.content,
    important: data.important || false,
    // id: generateId(),
  })
  note.save().then((note) => {
    res.json(note)
  })
  // notes.push(data)
})

app.put("/api/notes/:id", (req, res) => {
  const data = req.body
  Note.findById(req.params.id).then(note => {
    note.content = data.content
    note.important = data.important
    note.save().then(note => {
      res.json(note)
    })
  })
  // const note = req.body
  // if (!notes.find(p => p.id == note.id)) {
  //   res.status(400) // person does not exist
  // }
  //
  // notes = notes
  //   .filter(p => p.id != note.id)
  //   .concat(note)
  //
  // res.json(note)
})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
