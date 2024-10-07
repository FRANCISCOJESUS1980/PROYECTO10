const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
const cloudinary = require('../../config/cloudinary')
const fs = require('fs')
const Event = require('../../models/Event')
const {
  createEvent,
  getEvents,
  getEventById,
  confirmAttendance,
  deleteEvent
} = require('./events.controller')
const authMiddleware = require('../../middleware/authMiddleware')

const multer = require('multer')
const upload = require('../../upload')

router.post('/events', upload.single('image'), async (req, res) => {
  try {
    const { title, date, location, description } = req.body

    const existingEvent = await Event.findOne({
      title: title.toLowerCase(),
      date,
      location: location.toLowerCase()
    })

    if (existingEvent) {
      return res.status(400).json({ message: 'El evento ya ha sido creado.' })
    }

    if (!title || !date || !location || !description) {
      return res
        .status(400)
        .json({ message: 'Todos los campos son obligatorios.' })
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'events'
    })

    const newEvent = new Event({
      title: title.toLowerCase(),
      date,
      location: location.toLowerCase(),
      description,
      imageUrl: result.secure_url
    })

    await newEvent.save()

    fs.unlinkSync(req.file.path)

    res
      .status(201)
      .json({ message: 'Evento creado correctamente', event: newEvent })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Ocurrió un error en el servidor.' })
  }
})

router.get('/', getEvents)
router.get('/:id', getEventById)
router.post('/:eventId/attend', authMiddleware, confirmAttendance)
router.delete('/:id', authMiddleware, deleteEvent)

module.exports = router
