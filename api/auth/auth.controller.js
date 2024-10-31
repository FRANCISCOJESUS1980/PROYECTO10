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
    const validationErrors = errors
      .array()
      .map((err) => err.msg)
      .join(', ')
    return res
      .status(400)
      .json({ message: `Errores de validación: ${validationErrors}` })
  }

  const { email, password } = req.body
  try {
    const user = await loginUser(email, password)

    if (!user) {
      return res.status(401).json({
        message:
          'Las credenciales son incorrectas. Verifica tu correo y contraseña.'
      })
    }

    const token = generateToken(user._id)
    res.status(200).json({ message: 'Inicio de sesión correcta', token })
  } catch (error) {
    console.error('Error al iniciar sesión:', error)

    if (error.message.includes('password length')) {
      res.status(400).json({
        message:
          'La longitud de la contraseña debe tener al menos 8 caracteres.'
      })
    } else if (error.message.includes('username length')) {
      res.status(400).json({
        message: 'El nombre de usuario debe tener al menos 3 caracteres.'
      })
    } else {
      res.status(500).json({ message: 'Error en el inicio de la sesión' })
    }
  }
}

module.exports = { register, login }
