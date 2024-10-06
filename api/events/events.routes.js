const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
const cloudinary = require('../../config/cloudinary')
const fs = require('fs')
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

/*const eventValidationRules = () => {
  return [
    body('title').notEmpty().withMessage('El título es obligatorio'),
    body('date').isISO8601().withMessage('La fecha debe ser una fecha válida'),
    body('location').notEmpty().withMessage('La ubicación es obligatoria'),
    body('description').notEmpty().withMessage('La descripción es obligatoria')
  ]
}*/
router.post('/events', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ningún archivo' })
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'events'
    })

    fs.unlinkSync(req.file.path)

    const event = {
      name: req.body.name,
      imageUrl: result.secure_url
    }

    res.status(201).json({
      message: 'Evento creado correctamente',
      event: event
    })
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
