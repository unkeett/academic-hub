// routes/goals.js
const express = require('express');
const router = express.Router();
const { getGoals, createGoal, updateGoal } = require('../controllers/goalController');

router.route('/').get(getGoals).post(createGoal);
router.route('/:id').put(updateGoal);

module.exports = router;