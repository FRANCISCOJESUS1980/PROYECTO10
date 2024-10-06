const multer = require('multer')
const path = require('path')
const dotenv = require('dotenv')

dotenv.config()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadFolder = process.env.UPLOAD_FOLDER || 'uploads/'
    cb(null, uploadFolder)
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error(
      'Tipo de archivo no permitido. Solo se permiten imágenes JPEG, PNG o GIF.'
    )
    error.status = 400
    return cb(error, false)
  }
  cb(null, true)
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
})

module.exports = upload
