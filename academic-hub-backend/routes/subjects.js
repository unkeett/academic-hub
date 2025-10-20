// routes/subjects.js
const express = require('express');
const router = express.Router();
const { 
  getSubjects, 
  getSubject,
  createSubject, 
  updateSubject, 
  deleteSubject,
  updateSubjectProgress
} = require('../controllers/subjectController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.route('/')
  .get(getSubjects)
  .post(createSubject);

router.route('/:id')
  .get(getSubject)
  .put(updateSubject)
  .delete(deleteSubject);

router.route('/:id/progress')
  .put(updateSubjectProgress);

module.exports = router;