// models/Tutorial.js
const mongoose = require('mongoose');

const TutorialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a tutorial title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  channel: {
    type: String,
    required: [true, 'Please add a channel name'],
    trim: true
  },
  duration: {
    type: String,
    required: [true, 'Please add duration']
  },
  url: {
    type: String,
    required: [true, 'Please add a YouTube URL'],
    match: [
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/,
      'Please add a valid YouTube URL'
    ]
  },
  thumbnail: {
    type: String
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  watched: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes
TutorialSchema.index({ user: 1, watched: 1 });

module.exports = mongoose.model('Tutorial', TutorialSchema);
