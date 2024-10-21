const { generateToken } = require('../../utils/tokenUtils')
const { registerUser, loginUser } = require('../../services/authService')
const { handleError } = require('../../utils/errorHandler')
const { validationResult } = require('express-validator')
const User = require('../../models/User')
const { registerValidation } = require('../../middleware/registerValidation')

const register = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    })
  }

  const { username, email, password } = req.body

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está en uso.' })
    }

    const user = await registerUser(username, email, password)
    console.log('Usuario registrado:', user)
    const token = generateToken(user._id)
    res.status(201).json({ message: 'Usuario creado y autenticado', token })
  } catch (error) {
    console.error('Error al registrar usuario:', error)
    handleError(res, error, 'Error en el registro')
  }
}

const login = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { email, password } = req.body
  try {
    const user = await loginUser(email, password)
    const token = generateToken(user._id)
    res.status(200).json({ message: 'Inicio de sesión correcta', token })
  } catch (error) {
    console.error('Error al iniciar sesión:', error)
    handleError(res, error, 'Error en el inicio de la sesión')
  }
}

module.exports = { register, login }
