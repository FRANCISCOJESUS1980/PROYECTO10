const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  attendees: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
})

module.exports = mongoose.model('Event', eventSchema)
