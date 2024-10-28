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

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     description: Create an event with the given details
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
const createEvent = async (req, res) => {
  try {
    const { error } = eventSchema.validate(req.body)
    if (error) {
      console.log(
        'Error en la validación del esquema:',
        error.details[0].message
      )
      return res.status(400).json({ message: error.details[0].message })
    }

    const { title, date, location, description } = req.body
    const userId = req.userId

    if (!userId) {
      console.log('No hay usuario autenticado.')
      return res
        .status(400)
        .json({ message: 'Se requiere un usuario para crear el evento.' })
    }
    const currentDate = new Date()
    if (new Date(date) < currentDate) {
      console.log('La fecha del evento es anterior a la fecha actual.')
      return res
        .status(400)
        .json({ message: 'La fecha no puede ser anterior ni igual a hoy.' })
    }

    if (!req.file) {
      console.log('No se recibió archivo.')
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

    console.log('Subiendo imagen a Cloudinary...')
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image' },
      async (error, result) => {
        if (error) {
          console.error('Error al subir la imagen a Cloudinary:', error)
          return res.status(500).json({ message: 'Error al subir la imagen.' })
        }

        const newEvent = new Event({
          title: title.toLowerCase(),
          date,
          location: location.toLowerCase(),
          description,
          imageUrl: result.secure_url,
          creator: userId
        })

        await newEvent.save()

        console.log('Evento creado correctamente:', newEvent)
        return res
          .status(201)
          .json({ message: 'Evento creado correctamente', event: newEvent })
      }
    )

    stream.end(req.file.buffer)
  } catch (error) {
    console.error('Error inesperado en el servidor:', error)
    res.status(500).json({ message: 'Ocurrió un error en el servidor.' })
  }
}

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events
 *     description: Retrieve a list of all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of events
 *       500:
 *         description: Server error
 */
const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
    res.status(200).json(events)
  } catch (error) {
    console.error('Error al obtener eventos:', error)
    res.status(500).json({ message: 'Error al obtener eventos' })
  }
}

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get an event by ID
 *     description: Retrieve an event by its ID
 *     tags: [Events]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the event
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event details
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
const getEventById = async (req, res) => {
  const { id } = req.params
  try {
    const event = await Event.findById(id).populate(
      'attendees',
      'username email'
    )
    if (!event) return res.status(404).json({ message: 'Evento no encontrado' })
    res.status(200).json(event)
  } catch (error) {
    console.error('Error al obtener evento:', error)
    res.status(500).json({ message: 'Error al obtener evento' })
  }
}

/**
 * @swagger
 * /api/events/{eventId}/attend:
 *   post:
 *     summary: Confirm attendance to an event
 *     description: Add a user as an attendee to an event
 *     tags: [Events]
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         description: ID of the event
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Attendance confirmed
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
const confirmAttendance = async (req, res) => {
  try {
    const eventId = req.params.eventId
    const userId = req.userId

    console.log('ID de usuario en confirmAttendance:', userId)
    console.log('ID de evento recibido:', eventId)

    const event = await Event.findById(eventId)
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado.' })
    }

    console.log('Evento encontrado:', event)

    if (!event.attendees) {
      event.attendees = []
    }

    if (event.attendees.includes(userId)) {
      return res
        .status(400)
        .json({ message: 'Ya estás registrado en este evento.' })
    }

    event.attendees.push(userId)

    await event.save({ validateBeforeSave: false })

    res.status(200).json({ message: 'Asistencia confirmada.' })
  } catch (error) {
    console.error('Error al confirmar asistencia:', error)
    res.status(500).json({ message: 'Error al confirmar asistencia.' })
  }
}
const leaveEvent = async (req, res) => {
  const eventId = req.params.eventId
  const userId = req.userId

  try {
    const event = await Event.findById(eventId)
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado.' })
    }

    if (!event.attendees.includes(userId)) {
      return res
        .status(400)
        .json({ message: 'No estás registrado en este evento.' })
    }

    event.attendees = event.attendees.filter(
      (attendee) => attendee.toString() !== userId
    )
    await event.save()

    res.status(200).json({ message: 'Has salido del evento correctamente.' })
  } catch (error) {
    console.error('Error al salir del evento:', error)
    res.status(500).json({ message: 'Error al salir del evento.' })
  }
}

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Delete an event
 *     description: Delete an event by its ID
 *     tags: [Events]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the event
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       403:
 *         description: You do not have permission to delete this event
 *       404:
 *         description: Event not found
 *       500:
 *         description: Server error
 */
const deleteEvent = async (req, res) => {
  const { id } = req.params
  const userId = req.userId

  try {
    const event = await Event.findById(id)
    if (!event) return res.status(404).json({ message: 'Evento no encontrado' })

    if (!event.creator) {
      return res
        .status(400)
        .json({ message: 'Este evento no tiene un creador asociado.' })
    }

    if (event.creator.toString() !== userId) {
      return res
        .status(403)
        .json({ message: 'No tienes permisos para eliminar este evento' })
    }

    await Event.findByIdAndDelete(id)
    res.status(200).json({ message: 'Evento eliminado exitosamente' })
  } catch (error) {
    console.error('Error al eliminar evento:', error)
    res.status(500).json({ message: 'Error al eliminar el evento' })
  }
}

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  confirmAttendance,
  deleteEvent,
  leaveEvent
}
