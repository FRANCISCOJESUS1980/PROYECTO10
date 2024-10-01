const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)
    console.log('Conectado a MongoDB')
  } catch (error) {
    console.log('Error al conectar a MongoDB:', error.message)
    process.exit(1)
  }
}

module.exports = { connectDB }
