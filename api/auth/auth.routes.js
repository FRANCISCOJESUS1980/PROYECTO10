const express = require('express')
const { register, login } = require('./auth.controller')
const registerValidation = require('../../middleware/registerValidation')
const { getAllUsers } = require('../auth/auth.controller')

const router = express.Router()
router.get('/users', getAllUsers)
router.post('/register', registerValidation, register)

router.post('/login', login)

module.exports = router
