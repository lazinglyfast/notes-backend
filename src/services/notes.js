import axios from "axios"

const baseUrl = "http://localhost:3002/api/notes"

const list = () => {
  const ghost = {
    id: 10000,
    content: "This note is not saved to server",
    important: true,
  }
  return axios
    .get(baseUrl)
    .then(response => response.data.concat(ghost))
}

const create = note => {
  return axios
    .post(baseUrl, note)
    .then(response => response.data)
}

const update = note => {
  return axios
    .put(`${baseUrl}/${note.id}`, note)
    .then(response => response.data)
}

export default { list, create, update }
