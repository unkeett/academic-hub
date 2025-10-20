// models/Idea.js
const mongoose = require('mongoose');

const IdeaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Please add content'],
    maxlength: [2000, 'Content cannot be more than 2000 characters']
  },
  tags: {
    type: [String],
    default: []
  },
  category: {
    type: String,
    enum: ['study', 'project', 'research', 'general'],
    default: 'general'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Idea', IdeaSchema);
