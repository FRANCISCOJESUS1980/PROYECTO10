const jwt = require('jsonwebtoken')
const secretKey = process.env.JWT_SECRET || 'defaultSecretKey'

const generateToken = (userId) => {
  const payload = {
    id: userId
  }
  const options = {
    expiresIn: '1h'
  }
  return jwt.sign(payload, secretKey, options)
}

const verifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey)
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Token inválido.')
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token ha expirado.')
    }
    throw new Error('Error al verificar el token.')
  }
}

module.exports = { generateToken, verifyToken }
