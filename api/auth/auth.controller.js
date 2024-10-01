const User = require('../../models/User')
const bcrypt = require('bcryptjs')

const registerUser = async (req, res) => {
  const { name, email, password } = req.body

  console.log('Datos recibidos para registro:', req.body)

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' })
  }

  try {
    const userExists = await User.findOne({ email })
    if (userExists) {
      console.log('El usuario ya existe:', email)
      return res.status(400).json({ message: 'El usuario ya existe' })
    }

    const user = new User({ name, email, password })
    await user.save()

    console.log('Usuario registrado exitosamente:', user)
    res.status(201).json({ message: 'Usuario registrado exitosamente' })
  } catch (error) {
    console.error('Error al registrar el usuario:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
}
const loginUser = async (req, res) => {
  const { email, password } = req.body

  console.log('Intento de login:', { email, password })

  try {
    const user = await User.findOne({ email })
    if (!user) {
      console.log('Usuario no encontrado:', email)
      return res.status(400).json({ message: 'Credenciales incorrectas' })
    }

    console.log('Usuario encontrado:', user)

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      console.log('Contraseña incorrecta para:', email)
      return res.status(400).json({ message: 'Credenciales incorrectas' })
    }

    console.log('Login exitoso para:', user)
    res.status(200).json({ message: 'Inicio de sesión exitoso', user })
  } catch (error) {
    console.error('Error al iniciar sesión:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
}

module.exports = {
  registerUser,
  loginUser
}
