const { registerUser, loginUser } = require('../../services/authService')
const { handleError } = require('../../utils/errorHandler')

const register = async (req, res) => {
  const { username, email, password } = req.body
  try {
    const token = await registerUser(username, email, password)
    res.status(201).json({ message: 'Usuario creado y autenticado', token })
  } catch (error) {
    handleError(res, error, 'Error en el registro')
  }
}

const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const token = await loginUser(email, password)
    res.status(200).json({ token })
  } catch (error) {
    handleError(res, error, 'Error en el inicio de sesión')
  }
}

module.exports = { register, login }
