const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const dbPath = path.join(__dirname, 'todoApplication.db')
let db = null

const app = express()
app.use(express.json())

const intitializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server started')
    })
  } catch (e) {
    console.log(`DB Error:${e.message}`)
    process.exit(1)
  }
}
intitializeDbAndServer()

//Returns a specific todo based on the todo ID

app.get('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const getTodo = `SELECT * FROM todo WHERE id=${todoId}`
  const reqTodo = await db.get(getTodo)
  response.send(reqTodo)
})

//Create a todo in the todo table

app.post('/todos/', async (request, response) => {
  const {id, todo, priority, status} = request.body
  const addTodo = `
  INSERT INTO 
  todo (id,todo,priority,status)
  VALUES (${id},'${todo}','${priority}','${status}');`
  await db.run(addTodo)
  response.send('Todo Successfully Added')
})

//Deletes a todo from the todo table based on the todo ID

app.delete('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const deleteTodo = `DELETE FROM todo WHERE id=${todoId}`
  await db.run(deleteTodo)
  response.send('Todo Deleted')
})
module.exports = app
