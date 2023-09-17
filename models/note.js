import dotenv from "dotenv"
dotenv.config() // it didn't work when called from index.js, do imports get reordered?
import pkg from 'mongoose';
const { set, connect, Schema, model } = pkg

set("strictQuery", false)

console.log("why empty", process.env.MONGODB_URI)
const url = process.env.MONGODB_URI
console.log("connecting to", url)

connect(url).then(_result => {
  console.log("connected to MongoDB")
}).catch(error => {
  console.log("error connecting to MongoDB", error.message)
})

const schema = new Schema({
  content: String,
  important: Boolean,
})

schema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Note = model("Note", schema)

export default Note
