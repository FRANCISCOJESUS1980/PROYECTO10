const express = require('express')
const router = express.Router()
const eventsController = require('./events.controller')

router.post('/', eventsController.createEvent)
router.get('/', eventsController.getAllEvents)

module.exports = router
