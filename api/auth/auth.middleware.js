const { verifyToken } = require('../../utils/tokenUtils')
const { handleError } = require('../../utils/errorHandler')

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization
  console.log('Encabezado de autorización completo:', authHeader)

  if (!authHeader) {
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
    const decoded = verifyToken(token)
    console.log('Datos decodificados del token:', decoded)
    req.userId = decoded.id

    if (!req.userId) {
      return res.status(400).json({ message: 'Usuario no válido en el token' })
    }
    console.log('ID de usuario asignado por el middleware:', req.userId)
    next()
  } catch (error) {
    console.error('Error en authMiddleware:', error.message)
    return handleError(res, error, 'Token inválido o ha expirado.')
  }
}

module.exports = authMiddleware
