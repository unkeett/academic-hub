const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Subject = require('../models/Subject');
const Goal = require('../models/Goal');
const Tutorial = require('../models/Tutorial');
const Idea = require('../models/Idea');

// @desc    Get dashboard summary statistics
// @route   GET /api/stats/summary
// @access  Private
router.get('/summary', protect, async (req, res) => {
    try {
        // 1. Fetch all subjects for the user
        const subjects = await Subject.find({ user: req.user.id });

        // 2. Fetch all goals for the user
        const goals = await Goal.find({ user: req.user.id });

        // 3. Fetch count of tutorials and ideas
        const totalTutorials = await Tutorial.countDocuments({ user: req.user.id });
        const totalIdeas = await Idea.countDocuments({ user: req.user.id });

        // 4. Calculate Aggregates
        const totalSubjects = subjects.length;
        const totalGoals = goals.length;

        const completedGoals = goals.filter(g => g.completed).length;
        const goalCompletionRate = totalGoals > 0
            ? Math.round((completedGoals / totalGoals) * 100)
            : 0;

        // 5. Prepare Subject Distribution Data
        const subjectStats = subjects.map(sub => ({
            name: sub.name,
            totalTopics: sub.topics.length,
            completedTopics: sub.completedTopics,
            completionRate: sub.topics.length > 0
                ? Math.round((sub.completedTopics / sub.topics.length) * 100)
                : 0
        }));

        // 6. Recent Activity (last 5 updated goals)
        const recentGoals = await Goal.find({ user: req.user.id })
            .sort({ updatedAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            data: {
                totalSubjects,
                totalGoals,
                totalTutorials,
                totalIdeas,
                completedGoals,
                goalCompletionRate,
                subjectStats,
                recentActivity: recentGoals
            }
        });
    } catch (error) {
        console.error('Error fetching stats summary:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
});

module.exports = router;
