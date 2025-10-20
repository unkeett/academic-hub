// models/Goal.js
const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please add goal text'],
    maxlength: [200, 'Goal text cannot be more than 200 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  completed: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Goal', GoalSchema);