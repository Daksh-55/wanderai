const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destination: {
    type: String,
    required: true,
    trim: true
  },
  days: {
    type: Number,
    required: true,
    min: 1,
    max: 30
  },
  budget: {
    type: String,
    required: true,
    enum: ['Budget', 'Mid-range', 'Luxury']
  },
  itinerary: {
    type: String,
    required: true
  },
  mapsLink: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Itinerary', itinerarySchema);