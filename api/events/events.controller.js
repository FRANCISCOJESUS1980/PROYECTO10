const Event = require('../../models/Event')

exports.createEvent = async (req, res) => {
  const { title, description, date, location } = req.body

  try {
    const newEvent = new Event({ title, description, date, location })
    await newEvent.save()
    return res.status(201).json(newEvent)
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear el evento' })
  }
}

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
    return res.status(200).json(events)
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener eventos' })
  }
}
