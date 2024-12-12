/*require('dotenv').config()
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

//const upload = require('./upload')
//const bodyParser = require('body-parser')
const cron = require('node-cron')
const Event = require('./models/Event')
const app = express()
const PORT = process.env.PORT || 3000

cron.schedule('0 0 * * *', async () => {
  try {
    const now = new Date()
    const result = await Event.deleteMany({ date: { $lt: now } })
    console.log(`Se eliminaron ${result.deletedCount} eventos antiguos.`)
  } catch (error) {
    console.error('Error eliminando eventos pasados:', error)
  }
})

connectDB()

app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})
app.use(limiter)

app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`)
})*/
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const authRoutes = require('./api/auth/auth.routes')
const eventRoutes = require('./api/events/events.routes')
const { connectDB } = require('./config/db')
const cron = require('node-cron')
const Event = require('./models/Event')

const app = express()
const PORT = process.env.PORT || 3000

cron.schedule('0 0 * * *', async () => {
  try {
    const now = new Date()
    const result = await Event.deleteMany({ date: { $lt: now } })
    console.log(`Se eliminaron ${result.deletedCount} eventos antiguos.`)
  } catch (error) {
    console.error('Error eliminando eventos pasados:', error)
  }
})

connectDB()

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https://vercel.live', "'unsafe-inline'"],
        connectSrc: ["'self'", 'https://vercel.live'],
        imgSrc: ["'self'", 'data:', 'https://vercel.live']
      }
    }
  })
)

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})
app.use(limiter)

app.get('/', (req, res) => {
  res.send('Bienvenido a la API de Eventos')
})

app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)

app.use((err, req, res, next) => {
  console.error('Error no capturado:', err)
  res.status(500).json({ error: 'Internal Server Error', message: err.message })
})

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`)
})
