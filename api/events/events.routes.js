const express = require('express')
const router = express.Router()
const upload = require('../../upload')
const {
  createEvent,
  getEvents,
  getEventById,
  confirmAttendance,
  deleteEvent,
  leaveEvent
} = require('./events.controller')
const authMiddleware = require('../../middleware/authMiddleware')

router.post('/events', authMiddleware, upload.single('image'), createEvent)

router.get('/', getEvents)
router.get('/:id', getEventById)
router.post('/:eventId/attend', authMiddleware, confirmAttendance)
router.delete('/:id', authMiddleware, deleteEvent)
router.post('/:eventId/leave', authMiddleware, leaveEvent)

module.exports = router
