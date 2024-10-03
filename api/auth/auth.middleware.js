const { verifyToken } = require('../../utils/tokenUtils')
const { handleError } = require('../../utils/errorHandler')

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: 'Acceso no autorizado, falta token.' })
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Acceso no autorizado, token no proporcionado.' })
  }

  try {
    const decoded = verifyToken(token)
    req.userId = decoded.id
    next()
  } catch (error) {
    console.error('Error en authMiddleware:', error.message)
    return handleError(res, error, 'Token inválido o ha expirado.')
  }
}

module.exports = authMiddleware
