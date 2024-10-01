const User = require('../../models/User')
const bcrypt = require('bcrypt')
const { generateToken } = require('../../utils/tokenUtils')

const register = async (req, res) => {
  const { username, email, password } = req.body
  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({ username, email, password: hashedPassword })
    await newUser.save()

    const token = generateToken(newUser._id)

    res.status(201).json({ message: 'Usuario creado y autenticado', token })
  } catch (error) {
    console.error('Error en el registro:', error)
    res.status(500).json({ message: 'Error en el registro' })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
      return res.status(400).json({ message: 'Credenciales incorrectas' })

    const token = generateToken(user._id)
    res.status(200).json({ token })
  } catch (error) {
    console.error('Error en el inicio de sesión:', error)
    res.status(500).json({ message: 'Error en el inicio de sesión' })
  }
}

module.exports = { register, login }
