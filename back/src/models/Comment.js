const mongoose = require('mongoose');

const commonStructure = { // DRY: Don't Repeat Yourself
  user: { 
    username: { type: String, required: true },
    image: { type: String },
  },
  date: { type: Date, default: Date.now },
  content: { type: String, required: true }, 
  score: { type: Number, default: 0 },
};

const replySchema = new mongoose.Schema({
  ...commonStructure,
  replyingTo: { type: String, required: true },
});

const commentSchema = new mongoose.Schema({
  ...commonStructure,
  replies: [replySchema],
});

module.exports = mongoose.model('Comment', commentSchema);