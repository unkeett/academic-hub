// routes/tutorials.js
const express = require('express');
const router = express.Router();
const {
  getTutorials,
  getTutorial,
  createTutorial,
  updateTutorial,
  deleteTutorial,
  toggleWatched
} = require('../controllers/tutorialController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.route('/')
  .get(getTutorials)
  .post(createTutorial);

router.route('/:id')
  .get(getTutorial)
  .put(updateTutorial)
  .delete(deleteTutorial);

router.route('/:id/toggle')
  .put(toggleWatched);

module.exports = router;
