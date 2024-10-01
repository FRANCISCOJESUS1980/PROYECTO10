const express = require('express')
const router = express.Router()
const {
  createEvent,
  getEvents,
  getEventById,
  confirmAttendance
} = require('./events.controller')
const authMiddleware = require('../../middleware/authMiddleware')

router.post('/', authMiddleware, createEvent)
router.get('/', getEvents)
router.get('/:id', getEventById)
router.post('/:eventId/attend', authMiddleware, confirmAttendance)

module.exports = router
