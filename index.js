/*
  Filename: index.js
  Description: Entry-point for URL-Shortener
*/
const mysql = require('mysql2')
const express = require('express')
const cors = require('cors')

let sql_db = null

module.exports = {
  
  connectToDB: async function(options){
    sql_db = mysql.createPool(options)
    // create table if it doesn't exist
    sql_db.query(`CREATE TABLE IF NOT EXISTS \`sus\`.\`URLS\` (
      \`id\` int unsigned NOT NULL AUTO_INCREMENT, 
      \`url\` text NOT NULL,
      PRIMARY KEY(\`id\`)
    );`, (err) => {
      if (err) throw err
    })
    return sql_db
  },
  buildRouter: function({origin, optionsSuccessStatus = 200, port, url = "http://localhost/"}){

    if (!sql_db){
      throw new Error("Not connected to SQL Database.  Did you call connectToDB?")
    }

    const corsOption = {
      origin,
      optionsSuccessStatus
    }
    const appPort = port
    const router = express.Router()
    router.use(express.json())
    // Add URL
    router.post('/', cors(corsOption), (req, res) => {
      // Read URL from request body
      const {url} = req.body
      if (url) {
        res.status(400).text("Bad Request")
        return
      }

      sql_db.query("INSERT INTO URLS (url) VALUES (?); SELECT LAST_INSERT_ID();", [url], (err, rows, fields) => {
        if (err) res.status(500).text("Server DB Error")
        else {
          console.log(rows)
          // Encode id as base 36
          const shortURL = url + Number(rows[0]).toString(36)
          res.status(200).json({url: shortURL})
        }
      })
    })

    // Re-direct key
    router.get('/:key', cors(corsOption), (req, res) => {
      const urlID = req.params.key
      console.log(urlID)
      // TODO: DB QUERY
      const id = parseInt(urlID, 36)
      sql_db.query('SELECT url from URLS where id = ?', [id], (err, rows, fields) => {
        if (err) res.status(500).text("Bad URL")
        else {
          console.log(longURL)
          const longURL = rows[0]
          res.redirect(301, longURL)
        }
      })
    })

    // Return Express Router
    return router
  }

}