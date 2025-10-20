// controllers/goalController.js
const Goal = require('../models/Goal');

// @desc    Get all goals for a user
// @route   GET /api/goals
// @access  Private
const getGoals = async (req, res, next) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: goals.length,
      data: goals
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single goal
// @route   GET /api/goals/:id
// @access  Private
const getGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    // Make sure user owns goal
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this goal'
      });
    }

    res.status(200).json({
      success: true,
      data: goal
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a goal
// @route   POST /api/goals
// @access  Private
const createGoal = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const goal = await Goal.create(req.body);
    res.status(201).json({
      success: true,
      data: goal
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a goal
// @route   PUT /api/goals/:id
// @access  Private
const updateGoal = async (req, res, next) => {
  try {
    let goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    // Make sure user owns goal
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this goal'
      });
    }

    goal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: goal
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
const deleteGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    // Make sure user owns goal
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this goal'
      });
    }

    await goal.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Goal deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle goal completion
// @route   PUT /api/goals/:id/toggle
// @access  Private
const toggleGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    // Make sure user owns goal
    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this goal'
      });
    }

    goal.completed = !goal.completed;
    await goal.save();

    res.status(200).json({
      success: true,
      data: goal
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { 
  getGoals, 
  getGoal,
  createGoal, 
  updateGoal, 
  deleteGoal,
  toggleGoal
};