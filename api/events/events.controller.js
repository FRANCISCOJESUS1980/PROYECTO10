const Event = require('../../models/Event')

const createEvent = async (req, res) => {
  const { title, date, location, description } = req.body
  try {
    const newEvent = new Event({ title, date, location, description })
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

module.exports = { createEvent, getEvents, getEventById, confirmAttendance }
