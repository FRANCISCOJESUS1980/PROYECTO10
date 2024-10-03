const bcrypt = require('bcrypt')
const User = require('../models/User')
const { generateToken } = require('../utils/tokenUtils')
const { validateEmail, validatePassword } = require('../utils/validationUtils')

const registerUser = async (username, email, password) => {
  if (!validateEmail(email)) {
    throw new Error('Formato de correo inválido')
  }
  if (!validatePassword(password)) {
    throw new Error('La contraseña no cumple con los requisitos mínimos')
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = new User({ username, email, password: hashedPassword })
  await newUser.save()

  const token = generateToken(newUser._id)
  return token
}

const loginUser = async (email, password) => {
  const user = await User.findOne({ email })
  if (!user) throw new Error('Usuario no encontrado')

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) throw new Error('Credenciales incorrectas')

  const token = generateToken(user._id)
  return token
}

module.exports = { registerUser, loginUser }
