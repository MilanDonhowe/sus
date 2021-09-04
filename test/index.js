/*
  Filename: index.js
  Description: Test setup for SUS
*/

const sus = require('../index.js')
const express = require('express')
const app = express()

sus.connectToDB({
  host: process.env.MYSQL_HOST,
  user: 'root',
  password: 'password',
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

const susRouter = sus.buildRouter({origin: 'localhost', port: 3306, url: "http://localhost/sus/"})
app.use('/sus', susRouter)
const port = 3000
app.listen(port, () => {
  console.log(`URL Shortener listening on port ${port}`)
})

// now test out the routes