const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: string, required: true },
  password: { type: string, required: true, minlength: 5 },
  displayName: { type: string },
});

module.exports = User = mongoose.model('user', userSchema);
