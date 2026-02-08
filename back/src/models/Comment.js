const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  user: { 
    username: { type: String, required: true },
    image: {
      png: { type: String, required: true },
      webp: { type: String, required: true },
    },
  },
  content: { type: String, required: true }, 
  score: { type: Number, default: 0 },
  replyingTo: { type: String, required: true },
  createdAt: { type: String, default: "Today" }
}, { _id: true });

const commentSchema = new mongoose.Schema({
  user: { 
    username: { type: String, required: true },
    image: {
      png: { type: String, required: true },
      webp: { type: String, required: true },
    },
  },
  content: { type: String, required: true },
  score: { type: Number, default: 0 },
  createdAt: { type: String },
  replies: [replySchema],
});

module.exports = mongoose.model('Comment', commentSchema);