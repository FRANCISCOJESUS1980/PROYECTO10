const express = require('express')
const { createEvent, getAllEvents } = require('./events.controller')

const router = express.Router()

router.post('/', createEvent)

router.get('/', getAllEvents)

module.exports = router
