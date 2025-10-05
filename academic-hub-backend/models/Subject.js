// models/Subject.js
const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a subject name'],
    trim: true,
  },
  topics: {
    type: [String],
    default: [],
  },
  completedTopics: {
    type: Number,
    default: 0,
  },
  // Progress will be a derived value, but you can store it if you prefer
  // progress: {
  //   type: Number,
  //   default: 0,
  // }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Subject', SubjectSchema);