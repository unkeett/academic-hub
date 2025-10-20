// routes/ideas.js
const express = require('express');
const router = express.Router();
const {
  getIdeas,
  getIdea,
  createIdea,
  updateIdea,
  deleteIdea,
  getIdeasByCategory,
  searchIdeas
} = require('../controllers/ideaController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.route('/')
  .get(getIdeas)
  .post(createIdea);

router.route('/search/:searchTerm')
  .get(searchIdeas);

router.route('/category/:category')
  .get(getIdeasByCategory);

router.route('/:id')
  .get(getIdea)
  .put(updateIdea)
  .delete(deleteIdea);

module.exports = router;
