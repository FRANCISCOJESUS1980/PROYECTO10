const User = require('../../models/User')
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
  const { email, password, name } = req.body

  try {
    let user = await User.findOne({ email })
    if (user) return res.status(400).json({ message: 'Usuario ya registrado' })

    user = new User({ name, email, password })
    await user.save()

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    })
    return res.status(201).json({ token })
  } catch (error) {
    return res.status(500).json({ message: 'Error en el registro' })
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' })

    const isMatch = await user.matchPassword(password)
    if (!isMatch)
      return res.status(400).json({ message: 'Contraseña incorrecta' })

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    })
    return res.status(200).json({ token })
  } catch (error) {
    return res.status(500).json({ message: 'Error en el inicio de sesión' })
  }
}
