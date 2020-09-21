
const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const acronymRouter = require('./routes/acronym')
const swaggerJSDoc = require('swagger-jsdoc');

let app = express()

// TODO: logger set to environment variable
app.use(logger('dev'))
app.use(express.json())

app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/api-docs', express.static('api-docs'))
app.use('/v1/acronym', acronymRouter)

//swagger stuff
var swaggerDefinition = {
    "info": {
        "title": "WTF API",
        "description": "REST API for the **World Texting Foundation**, also known as **WTF**",
        "contact": {
            "name": "Leonidas Menendez",
            "email": "leonidasmenendez@gmail.com"
        },
        "servers": [
            "http://localhost:3000"
        ],
        "version": "0.1.0"
    },
    host: 'localhost:3000',
    basePath: '/',
};

const swaggerOptions = {
    swaggerDefinition: swaggerDefinition,
    apis: ['./routes/*.js'],
}

app.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })

const swaggerSpec = swaggerJSDoc(swaggerOptions)

module.exports = app