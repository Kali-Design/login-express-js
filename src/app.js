import express from 'express'
import bodyParser from 'body-parser'

import { fileURLToPath } from 'url'
import path from 'path'

// We can't use __filename and __dirname directive anymore in esm modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Our user database
const db_user = {
  alice: '123',
  bob: '456',
  charlie: '789',
}

// Middleware for checking if user exists
const userChecker = (req, res, next) => {
  const username = req.body.username
  if (db_user.hasOwnProperty(username)) {
    next()
  } else {
    res.send('Username or Password invalid.')
  }
}

// Middleware for checking if password is correct
const passwordChecker = (req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  if (db_user[username] === password) {
    next()
  } else {
    res.send('Username or password invalid.')
  }
}

const IP = '127.0.0.1'
const PORT = 7777

const app = express()

// Configure express to use body-parser as middleware.
app.use(bodyParser.urlencoded({ extended: false })) // to support URL-encoded bodies
app.use(bodyParser.json()) // to support JSON-encoded bodies

//serve static files
app.use(express.static(path.join(__dirname, '../public')))

// Configure express to use these 2 middleware for /login route only
app.use('/login', userChecker)
app.use('/login', passwordChecker)

// Create route /login for POST method
// we are waiting for a POST request with a body containing a json data
/*
format de json attendu:
{
    "username": "alice",
    "password" : "123"
}
*/
app.post('/login', (req, res) => {
  let username = req.body.username
  res.send(`Welcome to your dashboard ${username}`)
})

app.listen(PORT, IP, () => {
  console.log(`listening on ${IP}:${PORT}`)
})