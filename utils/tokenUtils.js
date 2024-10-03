const jwt = require('jsonwebtoken')
const secretKey = process.env.JWT_SECRET || 'defaultSecretKey'

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, secretKey, { expiresIn: '2h' })
}

const verifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey)
  } catch (error) {
    throw new Error('Token inválido o ha expirado.')
  }
}

module.exports = { generateToken, verifyToken }
