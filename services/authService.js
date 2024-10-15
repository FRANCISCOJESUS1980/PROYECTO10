const bcrypt = require('bcrypt')
const User = require('../models/User')
const { validateEmail, validatePassword } = require('../utils/validationUtils')

const registerUser = async (username, email, password) => {
  try {
    if (!validateEmail(email)) {
      throw new Error('Formato de correo inválido')
    }

    if (!validatePassword(password)) {
      throw new Error('La contraseña no cumple con los requisitos mínimos')
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({ username, email, password: hashedPassword })
    await newUser.save()

    return newUser
  } catch (error) {
    console.error('Error en el registro de usuario:', error.message)
    throw new Error('Error al registrar usuario: ' + error.message)
  }
}

const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email })
    if (!user) throw new Error('Usuario no encontrado')

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new Error('Credenciales incorrectas')

    return user
  } catch (error) {
    console.error('Error en el inicio de sesión:', error.message)
    throw new Error('Error en el inicio de sesión: ' + error.message)
  }
}

module.exports = { registerUser, loginUser }
