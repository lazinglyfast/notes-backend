import express, { json } from "express"
import cors from "cors"

const app = express()
app.use(cors())
app.use(json())

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { "Content-Type": "application/json" })
//   response.end(JSON.stringify(notes))
// })

app.get("/", (request, response) => {
  response.send("<h1>Hello, World!</h1>")
})

app.get("/api/notes", (request, response) => {
  response.json(notes)
})

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  if (note) {
    response.json(note)
  } else {
    response
      .status(404)
      .send(`Notes with id ${id} not found`)
      .end()
  }
})

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})

const generateId = () => {
  const maxId = notes.reduce((max, n) => n.id > max ? n.id : max, Number.MIN_VALUE)
  return maxId + 1
}

app.post("/api/notes", (request, response) => {
  let note = request.body
  if (!note.content) {
    return response.status(400).json({
      error: "content is missing",
    })
  }
  note = {
    content: note.content,
    important: note.important || false,
    id: generateId(),
  }
  notes.push(note)
  response.json(note)
})

app.put("/api/notes/:id", (req, res) => {
  const note = req.body
  if (!notes.find(p => p.id == note.id)) {
    res.status(400) // person does not exist
  }

  notes = notes
    .filter(p => p.id != note.id)
    .concat(note)

  res.json(note)
})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
