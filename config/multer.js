const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('./cloudinary')

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'events',
    format: async (req, file) => {
      const ext = file.mimetype.split('/')[1]
      return ['jpeg', 'png', 'gif'].includes(ext) ? ext : 'jpeg'
    },
    transformation: [{ fetch_format: 'webp', quality: 'auto:good' }],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`
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
