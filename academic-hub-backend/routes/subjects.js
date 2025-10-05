// routes/subjects.js
const express = require('express');
const router = express.Router();
const { getSubjects, createSubject } = require('../controllers/subjectController');

// Route for getting all subjects and creating a new one
router.route('/').get(getSubjects).post(createSubject);

// We will add routes for updating and deleting later
// router.route('/:id').put(updateSubject).delete(deleteSubject);

module.exports = router;