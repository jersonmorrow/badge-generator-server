const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  organizer: { type: String, required: true },
  location: { type: String, required: true },
  time: { type: Date, default: Date.now, required: true },
  img: { data: Buffer, contentType: String },
});

module.exports = EventBadge = mongoose.model('event', eventSchema);
