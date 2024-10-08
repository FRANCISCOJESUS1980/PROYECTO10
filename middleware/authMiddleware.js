const jwt = require('jsonwebtoken')
const User = require('../models/User')

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ message: 'Acceso no autorizado, falta token.' })
  }

  const token = authHeader.split(' ')[1]
  console.log('Token recibido en el middleware:', token)

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Acceso no autorizado, token no proporcionado.' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log('Datos decodificados del token:', decoded)

    const user = await User.findById(decoded.id)

    if (!user) {
      return res
        .status(401)
        .json({
          message: 'Usuario no autorizado, no se encontró en la base de datos.'
        })
    }

    req.user = user
    req.userId = user.id
    console.log('ID de usuario asignado por el middleware:', user.id)

    next()
  } catch (error) {
    console.error('Error en authMiddleware:', error.message)
    return res.status(401).json({ message: 'Token inválido o ha expirado.' })
  }
}

module.exports = authMiddleware
