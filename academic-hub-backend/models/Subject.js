// models/Subject.js
const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a subject name'],
    trim: true,
    maxlength: [100, 'Subject name cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  topics: {
    type: [String],
    default: [],
  },
  completedTopics: {
    type: Number,
    default: 0,
  },
  
  lastStudiedAt: {
  type: Date,
  default: null,
  index: true
},
  color: {
    type: String,
    default: '#3B82F6'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Subject', SubjectSchema);