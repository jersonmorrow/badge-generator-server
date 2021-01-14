const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  eventId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  jobTitle: { type: String, required: true },
  categorie: { type: String, required: true },
  badgeImage: { type: String },
});

module.exports = Badge = mongoose.model('badge', badgeSchema);
