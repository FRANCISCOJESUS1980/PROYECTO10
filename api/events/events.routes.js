const express = require('express')
const router = express.Router()
const {
  createEvent,
  getEvents,
  getEventById,
  confirmAttendance,
  deleteEvent
} = require('./events.controller')
const authMiddleware = require('../../middleware/authMiddleware')

router.post('/', authMiddleware, createEvent)
router.get('/', getEvents)
router.get('/:id', getEventById)
router.post('/:eventId/attend', authMiddleware, confirmAttendance)
router.delete('/:id', authMiddleware, deleteEvent)

module.exports = router
