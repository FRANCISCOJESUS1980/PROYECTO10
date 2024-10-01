const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const authRoutes = require('./api/auth/auth.routes')
const eventRoutes = require('./api/events/events.routes')

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error de conexión a MongoDB:', err))

app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`)
})
