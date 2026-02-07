// controllers/statsController.js
const Goal = require('../models/Goal');
const Subject = require('../models/Subject');
const Tutorial = require('../models/Tutorial');
const Idea = require('../models/Idea');

/**
 * @desc    Get summary statistics for user dashboard
 * @route   GET /api/stats/summary
 * @access  Private
 */
exports.getSummary = async (req, res) => {
    try {
        const userId = req.user.id;
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        // Fetch all data in parallel
        const [goals, subjects, tutorials, ideas] = await Promise.all([
            Goal.find({ user: userId }),
            Subject.find({ user: userId }),
            Tutorial.find({ user: userId }),
            Idea.find({ user: userId })
        ]);

        // Calculate goal completion stats
        const totalGoals = goals.length;
        const completedGoals = goals.filter(g => g.completed).length;
        const pendingGoals = totalGoals - completedGoals;
        const completionPercentage = totalGoals > 0
            ? Math.round((completedGoals / totalGoals) * 100)
            : 0;

        // Goal priority breakdown
        const goalsByPriority = {
            high: goals.filter(g => g.priority === 'high').length,
            medium: goals.filter(g => g.priority === 'medium').length,
            low: goals.filter(g => g.priority === 'low').length
        };

        // Subject distribution for charts
        const subjectDistribution = subjects.map(subject => ({
            name: subject.name,
            topicCount: subject.topics ? subject.topics.length : 0,
            completedTopics: subject.completedTopics || 0,
            color: subject.color || '#3B82F6'
        }));

        // Recent activity (items created/updated in last 7 days)
        const recentActivity = {
            goals: goals.filter(g => new Date(g.updatedAt) >= sevenDaysAgo).length,
            subjects: subjects.filter(s => new Date(s.updatedAt) >= sevenDaysAgo).length,
            tutorials: tutorials.filter(t => new Date(t.updatedAt) >= sevenDaysAgo).length,
            ideas: ideas.filter(i => new Date(i.updatedAt) >= sevenDaysAgo).length
        };

        // Tutorial watch stats
        const watchedTutorials = tutorials.filter(t => t.watched).length;
        const unwatchedTutorials = tutorials.length - watchedTutorials;

        // Ideas by category
        const ideasByCategory = {
            study: ideas.filter(i => i.category === 'study').length,
            project: ideas.filter(i => i.category === 'project').length,
            research: ideas.filter(i => i.category === 'research').length,
            general: ideas.filter(i => i.category === 'general').length
        };

        res.status(200).json({
            success: true,
            data: {
                totalSubjects: subjects.length,
                goalsStats: {
                    total: totalGoals,
                    completed: completedGoals,
                    pending: pendingGoals,
                    completionPercentage,
                    byPriority: goalsByPriority
                },
                tutorialsStats: {
                    total: tutorials.length,
                    watched: watchedTutorials,
                    unwatched: unwatchedTutorials
                },
                ideasStats: {
                    total: ideas.length,
                    byCategory: ideasByCategory
                },
                subjectDistribution,
                recentActivity
            }
        });
    } catch (error) {
        console.error('Error fetching stats summary:', error);
        res.status(500).json({
            success: false,
            error: 'Server error while fetching statistics'
        });
    }
};
