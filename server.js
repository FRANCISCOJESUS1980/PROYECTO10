require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const authRoutes = require('./api/auth/auth.routes')
const eventRoutes = require('./api/events/events.routes')
const errorHandler = require('./utils/errorHandler').handleError
const { connectDB } = require('./config/db')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const upload = require('./upload')

const app = express()
const PORT = process.env.PORT || 3000

connectDB()

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Event Management API',
      version: '1.0.0',
      description: 'API for managing events and attendees'
    }
  },
  apis: ['./api/**/*.js']
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})
app.use(limiter)

app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)

app.post('/api/events', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ningún archivo' })
    }

    res.status(201).json({
      message: 'Archivo subido correctamente',
      file: req.file
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Ocurrió un error en el servidor.' })
  }
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`)
})
