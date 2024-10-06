const { generateToken } = require('../../utils/tokenUtils')
const { registerUser, loginUser } = require('../../services/authService')
const { handleError } = require('../../utils/errorHandler')
const { validationResult } = require('express-validator')
const User = require('../../models/User')
/*
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    res.status(500).json({ message: 'Error al obtener usuarios' })
  }
}*/

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user and return a token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created and authenticated
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
const register = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const { username, email, password } = req.body
  try {
    const user = await registerUser(username, email, password)
    console.log('Usuario registrado:', user)
    const token = generateToken(user._id)
    res.status(201).json({ message: 'Usuario creado y autenticado', token })
  } catch (error) {
    console.error('Error al registrar usuario:', error)
    handleError(res, error, 'Error en el registro')
  }
}

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     description: Login and return a token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token returned
 *       404:
 *         description: User not found
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
const login = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { email, password } = req.body
  try {
    const user = await loginUser(email, password)
    const token = generateToken(user._id)
    res.status(201).json({ message: 'Usuario creado y autenticado', token })
  } catch (error) {
    console.error('Error al registrar usuario:', error)
    handleError(res, error, 'Error en el registro')
  }
}

module.exports = { register, login }
