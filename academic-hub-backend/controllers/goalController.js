// controllers/goalController.js
const Goal = require('../models/Goal');

// @desc    Get all goals
// @route   GET /api/goals
const getGoals = async (req, res) => {
  const goals = await Goal.find();
  res.status(200).json(goals);
};

// @desc    Create a goal
// @route   POST /api/goals
const createGoal = async (req, res) => {
  const goal = await Goal.create({ text: req.body.text });
  res.status(201).json(goal);
};

// @desc    Update a goal
// @route   PUT /api/goals/:id
const updateGoal = async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  if (!goal) {
    return res.status(404).json({ message: 'Goal not found' });
  }
  // We'll primarily use this to toggle the 'completed' status
  goal.completed = req.body.completed;
  const updatedGoal = await goal.save();
  res.status(200).json(updatedGoal);
};

module.exports = { getGoals, createGoal, updateGoal };