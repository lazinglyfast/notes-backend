import express, { json } from "express"
import cors from "cors"
import Note from "./models/note.js"
import * as logger from "./utils/logger.js"

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
  }).catch(error => {
    logger.error(error)
    res.status(500).end()
  })
})

app.get("/api/notes/:id", (req, res, next) => {
  Note.findById(req.params.id).then(note => {
    if (note) {
      res.json(note)
    } else {
      res.status(404).end()
    }
  }).catch(error => {
    return next(error)
  })
})

app.delete("/api/notes/:id", (req, res, next) => {
  Note.findByIdAndRemove(req.params.id).then(result => {
    res.status(204).end() // 204 ok, no content
  }).catch(error => next(error))
})

app.post("/api/notes", (req, res, next) => {
  const data = req.body
  if (!data.content) {
    return res.status(400).json({
      error: "content is missing",
    })
  }
  const note = new Note({
    content: data.content,
    important: data.important || false,
  })
  note.save().then((note) => {
    res.json(note)
  }).catch(error => next(error))
})

app.put("/api/notes/:id", (req, res, next) => {
  const note = {
    content: req.body.content,
    important: req.body.important,
  }
  // the {new: true} causes updatedNote to have the persisted changes
  const options = { new: true, runValidators: true, context: "query" }
  Note.findByIdAndUpdate(req.params.id, note, options).then(updatedNote => {
    res.json(updatedNote)
  }).catch(error => next(error))
})

const unknownEndpoint = (_req, res) => {
  res.status(404).send({ error: "unknownEndpoint" })
}

app.use(unknownEndpoint)

const errorHandler = (error, _req, res, next) => {
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" })
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

export default app
