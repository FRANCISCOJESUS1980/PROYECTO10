const Event = require('../../models/Event')
const Joi = require('joi')
const cloudinary = require('../../config/cloudinary')
const { handleError } = require('../../utils/errorHandler')

const eventSchema = Joi.object({
  title: Joi.string().min(3).required(),
  date: Joi.date().iso().required(),
  location: Joi.string().required(),
  description: Joi.string().optional()
})

const validateInput = (schema, data) => {
  const { error } = schema.validate(data)
  if (error) {
    return error.details[0].message
  }
  return null
}

const createEvent = async (req, res) => {
  try {
    const validationError = validateInput(eventSchema, req.body)
    if (validationError) {
      return res.status(400).json({ message: validationError })
    }

    const { title, date, location, description } = req.body
    const userId = req.userId

    if (!userId) {
      return res.status(400).json({
        message: 'Se requiere un usuario autenticado para crear el evento.'
      })
    }

    if (new Date(date) <= new Date()) {
      return res.status(400).json({
        message: 'La fecha no puede ser posterior ni igual a la actual.'
      })
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Se requiere una imagen.' })
    }

    const existingEvent = await Event.findOne({
      title: title.toLowerCase(),
      date: new Date(date),
      location: location.toLowerCase()
    })
    if (existingEvent) {
      return res.status(400).json({
        message: 'Ya existe un evento con el mismo título, fecha y ubicación.'
      })
    }

    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image' },
      async (error, result) => {
        if (error)
          return res.status(500).json({ message: 'Error al subir la imagen.' })

        const newEvent = new Event({
          title: title.toLowerCase(),
          date,
          location: location.toLowerCase(),
          description,
          imageUrl: result.secure_url,
          creator: userId
        })
        await newEvent.save()
        res
          .status(201)
          .json({ message: 'Evento creado correctamente', event: newEvent })
      }
    )

    stream.end(req.file.buffer)
  } catch (error) {
    handleError(res, error, 'Error al crear el evento.')
  }
}

const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
    res.status(200).json(events)
  } catch (error) {
    handleError(res, error, 'Error al obtener los eventos.')
  }
}

const getEventById = async (req, res) => {
  try {
    const { id } = req.params
    const event = await Event.findById(id).populate(
      'attendees',
      'username email'
    )
    if (!event)
      return res.status(404).json({ message: 'Evento no encontrado.' })
    res.status(200).json(event)
  } catch (error) {
    handleError(res, error, 'Error al obtener el evento.')
  }
}

const confirmAttendance = async (req, res) => {
  try {
    const { eventId } = req.params
    const userId = req.userId

    const event = await Event.findById(eventId)

    if (!event)
      return res.status(404).json({ message: 'Evento no encontrado.' })

    if (event.attendees.includes(userId)) {
      return res
        .status(400)
        .json({ message: 'Ya estás registrado en este evento.' })
    }

    event.attendees.push(userId)
    await event.save({ validateBeforeSave: false })

    res.status(200).json({ message: 'Asistencia confirmada.' })
  } catch (error) {
    handleError(res, error, 'Error al confirmar asistencia.')
  }
}

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.userId

    const event = await Event.findById(id)
    if (!event)
      return res.status(404).json({ message: 'Evento no encontrado.' })

    if (event.creator.toString() !== userId) {
      return res
        .status(403)
        .json({ message: 'No tienes permisos para eliminar este evento.' })
    }

    await Event.findByIdAndDelete(id)
    res.status(200).json({ message: 'Evento eliminado correctamente.' })
  } catch (error) {
    handleError(res, error, 'Error al eliminar el evento.')
  }
}

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.userId
    const { title, date, location, description } = req.body

    const event = await Event.findById(id)
    if (!event)
      return res.status(404).json({ message: 'Evento no encontrado.' })

    if (event.creator.toString() !== userId) {
      return res
        .status(403)
        .json({ message: 'No tienes permisos para modificar este evento.' })
    }

    if (title) event.title = title.toLowerCase()
    if (date && new Date(date) <= new Date()) {
      return res
        .status(400)
        .json({ message: 'La fecha debe ser posterior a la actual.' })
    }
    if (date) event.date = new Date(date)
    if (location) event.location = location.toLowerCase()
    if (description) event.description = description

    if (req.file) {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        async (error, result) => {
          if (error)
            return res
              .status(500)
              .json({ message: 'Error al subir la imagen.' })

          event.imageUrl = result.secure_url
          await event.save()
          res
            .status(200)
            .json({ message: 'Evento actualizado correctamente.', event })
        }
      )
      stream.end(req.file.buffer)
    } else {
      await event.save()
      res
        .status(200)
        .json({ message: 'Evento actualizado correctamente.', event })
    }
  } catch (error) {
    handleError(res, error, 'Error al actualizar el evento.')
  }
}

const leaveEvent = async (req, res) => {
  try {
    const { eventId } = req.params
    const userId = req.userId

    const event = await Event.findById(eventId)

    if (!event)
      return res.status(404).json({ message: 'Evento no encontrado.' })

    event.attendees = event.attendees.filter(
      (attendee) => attendee.toString() !== userId
    )
    await event.save()

    res.status(200).json({ message: 'Has salido del evento correctamente.' })
  } catch (error) {
    handleError(res, error, 'Error al salir del evento.')
  }
}

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  confirmAttendance,
  deleteEvent,
  leaveEvent,
  updateEvent
}
