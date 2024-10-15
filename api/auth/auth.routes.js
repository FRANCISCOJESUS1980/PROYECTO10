const express = require('express')
const { register, login } = require('./auth.controller')
const registerValidation = require('../../middleware/registerValidation')

const router = express.Router()

router.post('/register', registerValidation, register)

router.post('/login', login)

module.exports = router
