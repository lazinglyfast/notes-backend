import pkg from 'mongoose';
const { set, connect, Schema, model, connection } = pkg

if (process.argv.length < 3) {
  console.log("give password as argument")
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://root:${password}@phonebook.h8rb2wm.mongodb.net/noteApp?retryWrites=true&w=majority`
connect(url)
set("strictQuery", false)


// const run = () => {
const schema = new Schema({
  content: String,
  important: Boolean,
})

const Note = model("Note", schema)

const notes = [
  { content: "HTML is Easy", important: true },
  { content: "CSS is hard", important: true },
  { content: "Mongoose makes things easy", important: true },
  { content: "Browser can execute only JavaScript", important: false },
  { content: "GET and POST are the most important methods of HTTP protocol", important: true }
]

for (const data of notes) {
  const note = new Note(data)
  await note.save()
}

await Note.find({}).then(notes => {
  notes.forEach(note => {
    console.log(note)
  })
})

connection.close()
