/*const bcrypt = require('bcrypt')
const { generateToken } = require('../../utils/tokenUtils')
const { registerUser, loginUser } = require('../../services/authService')
const { handleError } = require('../../utils/errorHandler')
const { validationResult } = require('express-validator')
const User = require('../../models/User')
const { registerValidation } = require('../../middleware/registerValidation')
const mongoose = require('mongoose')

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

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ username, email, password: hashedPassword })

    const user = await newUser.save()
    console.log('Usuario registrado:', user)

    const token = generateToken(user._id)
    res
      .status(201)
      .json({
        message: 'Usuario creado y autenticado',
        token,
        userId: user._id
      })
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

    res
      .status(200)
      .json({ message: 'Inicio de sesión correcta', token, userId: user._id })
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

/*const deleteUser = async (req, res) => {
  const userId = req.userId
  console.log(userId)
  if (!userId) {
    return res.status(400).json({ message: 'ID de usuario no encontrado' })
  }

  try {
    const user = await User.findByIdAndDelete(userId)
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    res.status(200).json({ message: 'Usuario eliminado exitosamente' })
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    res.status(500).json({ message: 'Error al eliminar el usuario' })
  }
}*/ /*
const deleteUser = async (req, res) => {
  const { userId } = req.params // Extraer correctamente el parámetro userId
  console.log('ID del usuario:', userId)

  // Validar el ID antes de continuar
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'ID de usuario inválido' })
  }

  try {
    const user = await User.findByIdAndDelete(userId)
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    res.status(200).json({ message: 'Usuario eliminado exitosamente' })
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    handleError(res, error, 'Error al eliminar el usuario') // Usar la función handleError correctamente
  }
}

module.exports = { register, login, deleteUser }*/

const bcrypt = require('bcrypt')
const { generateToken } = require('../../utils/tokenUtils')
const { validationResult } = require('express-validator')
const { handleError } = require('../../utils/errorHandler')
const mongoose = require('mongoose')
const User = require('../../models/User')

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

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ username, email, password: hashedPassword })

    const user = await newUser.save()
    console.log('Usuario registrado:', user)

    const token = generateToken(user._id)
    res.status(201).json({
      message: 'Usuario creado y autenticado',
      token,
      userId: user._id
    })
  } catch (error) {
    console.error('Error al registrar usuario:', error)
    handleError(res, error, 'Error en el registro')
  }
}
const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res
        .status(401)
        .json({ message: 'El correo o la contraseña son incorrectos.' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: 'El correo o la contraseña son incorrectos.' })
    }

    const token = generateToken(user._id)

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      userId: user._id
    })
  } catch (error) {
    console.error('Error al iniciar sesión:', error)
    res.status(500).json({ message: 'Error en el inicio de sesión' })
  }
}

const deleteUser = async (req, res) => {
  const { userId } = req.params
  console.log('ID del usuario:', userId)

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'ID de usuario inválido' })
  }

  try {
    const user = await User.findByIdAndDelete(userId)
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    res.status(200).json({ message: 'Usuario eliminado exitosamente' })
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    handleError(res, error, 'Error al eliminar el usuario')
  }
}

module.exports = { register, login, deleteUser }
