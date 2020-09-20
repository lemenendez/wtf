
const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const acronymRouter = require('./routes/acronym')

let app = express()

// TODO: logger set to environment variable
app.use(logger('dev'))
app.use(express.json())

app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/v1/acronym', acronymRouter)

module.exports = app