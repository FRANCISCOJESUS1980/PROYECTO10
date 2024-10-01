const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const userRoutes = require('./routes/userRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api', userRoutes)

mongoose
  .connect('DB_URL')
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
