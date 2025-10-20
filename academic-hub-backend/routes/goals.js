// routes/goals.js
const express = require('express');
const router = express.Router();
const { 
  getGoals, 
  getGoal,
  createGoal, 
  updateGoal, 
  deleteGoal,
  toggleGoal
} = require('../controllers/goalController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.route('/')
  .get(getGoals)
  .post(createGoal);

router.route('/:id')
  .get(getGoal)
  .put(updateGoal)
  .delete(deleteGoal);

router.route('/:id/toggle')
  .put(toggleGoal);

module.exports = router;