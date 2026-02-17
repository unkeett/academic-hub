// routes/stats.js
const express = require('express');
const router = express.Router();
const { getSummary } = require('../controllers/statsController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

/**
 * @swagger
 * /api/stats/summary:
 *   get:
 *     summary: Get dashboard analytics summary
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Summary statistics for the authenticated user
 *       401:
 *         description: Unauthorized
 */
router.get('/summary', getSummary);

module.exports = router;
