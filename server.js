const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const authRoutes = require('./api/auth/auth.routes')
const eventRoutes = require('./api/events/events.routes')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log('Conectado a MongoDB')
  })
  .catch((err) => {
    console.error('Error de conexión a MongoDB:', err)
  })

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`)
})
