const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
const {
  createEvent,
  getEvents,
  getEventById,
  confirmAttendance,
  deleteEvent
} = require('./events.controller')
const authMiddleware = require('../../middleware/authMiddleware')

const eventValidationRules = () => {
  return [
    body('title').notEmpty().withMessage('El título es obligatorio'),
    body('date').isISO8601().withMessage('La fecha debe ser una fecha válida'),
    body('location').notEmpty().withMessage('La ubicación es obligatoria'),
    body('description').notEmpty().withMessage('La descripción es obligatoria')
  ]
}

router.post('/events', authMiddleware, createEvent)

router.get('/', getEvents)
router.get('/:id', getEventById)
router.post('/:eventId/attend', authMiddleware, confirmAttendance)
router.delete('/:id', authMiddleware, deleteEvent)

module.exports = router
