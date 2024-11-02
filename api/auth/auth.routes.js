const express = require('express')
const { register, login, deleteUser } = require('./auth.controller')
const registerValidation = require('../../middleware/registerValidation')

const router = express.Router()

router.post('/register', registerValidation, register)
router.post('/login', login)
router.delete('/delete/:userId', deleteUser)

module.exports = router
