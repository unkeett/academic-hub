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

/**
 * @swagger
 * tags:
 *   name: Subjects
 *   description: Subject management APIs
 */

// All routes are protected
router.use(protect);

/**
 * @swagger
 * /api/subjects:
 *   get:
 *     summary: Get all subjects
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of subjects
 *
 *   post:
 *     summary: Create a new subject
 *     tags: [Subjects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Subject created successfully
 */

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