const Event = require('../../models/Event')
const Joi = require('joi')

const eventSchema = Joi.object({
  title: Joi.string().min(3).required(),
  date: Joi.date().iso().required(),
  location: Joi.string().required(),
  description: Joi.string().optional()
})

const createEvent = async (req, res) => {
  const { error } = eventSchema.validate(req.body)
  if (error) return res.status(400).json({ message: error.details[0].message })

  const { title, date, location, description } = req.body
  const userId = req.userId

  try {
    const newEvent = new Event({
      title,
      date,
      location,
      description,
      creator: userId
    })
    await newEvent.save()
    res.status(201).json({ message: 'Evento creado', event: newEvent })
  } catch (error) {
    console.error('Error al crear el evento:', error)
    res.status(500).json({ message: 'Error al crear el evento' })
  }
}

const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
    res.status(200).json(events)
  } catch (error) {
    console.error('Error al obtener eventos:', error)
    res.status(500).json({ message: 'Error al obtener eventos' })
  }
}

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

const confirmAttendance = async (req, res) => {
  const { eventId } = req.params
  const userId = req.userId

  try {
    const event = await Event.findById(eventId)
    if (!event) return res.status(404).json({ message: 'Evento no encontrado' })

    if (!event.attendees.includes(userId)) {
      event.attendees.push(userId)
      await event.save()
    }

    res.status(200).json({ message: 'Asistencia confirmada', event })
  } catch (error) {
    console.error('Error al confirmar asistencia:', error)
    res.status(500).json({ message: 'Error al confirmar asistencia' })
  }
}

const deleteEvent = async (req, res) => {
  const { id } = req.params
  const userId = req.userId

  try {
    const event = await Event.findById(id)
    if (!event) return res.status(404).json({ message: 'Evento no encontrado' })

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
  deleteEvent
}
