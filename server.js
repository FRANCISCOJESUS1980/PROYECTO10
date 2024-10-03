const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const authRoutes = require('./api/auth/auth.routes')
const eventRoutes = require('./api/events/events.routes')
const errorHandler = require('./utils/errorHandler')
const { connectDB } = require('./config/db')
const authMiddleware = require('./middleware/authMiddleware')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

connectDB()

app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})
app.use(limiter)

app.use('/api/auth', authRoutes)
app.use('/api/events', authMiddleware, eventRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`)
})
