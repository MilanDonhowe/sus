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
    sql_db.query(`CREATE TABLE IF NOT EXISTS URLS (
      id int NOT NULL auto_increment, 
      url text NOT NULL
    );`, (err) => {
      if (err) throw err
    })
    return sql_db
  },
  buildRouter: function({origin, optionsSuccessStatus: 200, port}){

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
    // TODO

    // Add URL
    router.post('/', cors(corsOption), (req, res) => {
      //
      const {url} = req.body
      if (url) {
        res.status(400).text("Bad Request")
        return
      }

      sql_db.query("INSERT INTO URLS (url) VALUES (?)", [url], (err, rows, fields) => {
        if (err) res.status(500).text("Server DB Error")
        else {
          console.log(rows)
          console.log('fields: ' + fields)
          res.status(200).json({url: shortURL})
        }
      })
    })

    // Re-direct key
    router.get('/:key', cors(corsOption), (req, res) => {
      const urlID = req.params.key
      // TODO: DB QUERY
      const longURL = null

      res.redirect(301, longURL)
    })

    // Return Express Router
    return router
  }

}