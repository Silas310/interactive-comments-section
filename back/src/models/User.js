const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  image: {
    png: { type: String, required: true },
    webp: { type: String, required: true }
  }
});

module.exports = mongoose.model('User', userSchema);