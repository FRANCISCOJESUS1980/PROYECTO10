const handleError = (res, error, customMessage) => {
  const statusCode = error.statusCode || 500
  const message = customMessage || 'Error interno del servidor'

  res.status(statusCode).json({
    message,
    error: error.message
  })
}

module.exports = { handleError }
