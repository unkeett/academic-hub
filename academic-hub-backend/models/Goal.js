// models/Goal.js
const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please add goal text'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Goal', GoalSchema);