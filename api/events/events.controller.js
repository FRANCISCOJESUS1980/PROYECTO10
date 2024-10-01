const Event = require('../../models/Event')

const createEvent = async (req, res) => {
  const { title, date, location, description } = req.body

  console.log('Datos recibidos para crear evento:', req.body)

  if (!title || !date || !location || !description) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' })
  }

  try {
    const newEvent = new Event({ title, date, location, description })
    await newEvent.save()
    console.log('Evento creado:', newEvent)
    res
      .status(201)
      .json({ message: 'Evento creado exitosamente', event: newEvent })
  } catch (error) {
    console.error('Error al crear el evento:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
}

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
    console.log('Eventos obtenidos:', events)
    res.status(200).json(events)
  } catch (error) {
    console.error('Error al obtener eventos:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
}

module.exports = {
  createEvent,
  getAllEvents
}
