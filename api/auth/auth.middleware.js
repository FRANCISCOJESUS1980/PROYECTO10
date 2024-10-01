const jwt = require('jsonwebtoken')

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token)
    return res.status(401).json({ message: 'Acceso denegado, token requerido' })

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Token no válido' })
    req.userId = decoded.userId
    next()
  })
}
