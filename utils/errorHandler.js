const errorHandler = (err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send({ message: 'Error interno del servidor' })
}

module.exports = errorHandler
