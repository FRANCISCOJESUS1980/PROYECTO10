const jwt = require('jsonwebtoken')
const secretKey = process.env.JWT_SECRET || 'defaultSecretKey'

const generateToken = (userId) => {
  const payload = { id: userId }
  return jwt.sign(payload, secretKey, { expiresIn: '2h' })
}

const verifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey)
  } catch (error) {
    throw new Error('Token inválido o ha expirado.')
  }
}

module.exports = { verifyToken, generateToken }
