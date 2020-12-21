const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  organizer: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true },
  eventImage: { type: String, required: true },
});

module.exports = EventBadge = mongoose.model('event', eventSchema);
