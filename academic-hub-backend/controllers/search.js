const Subject = require('../models/Subject');
const Goal = require('../models/Goal');
const Tutorial = require('../models/Tutorial');
const Idea = require('../models/Idea');

// @desc    Search across all resources
// @route   GET /api/search
// @access  Private
exports.searchAll = async (req, res, next) => {
    try {
        const { q, type, priority, sort } = req.query;

        if (!q) {
            return res.status(400).json({ success: false, msg: 'Please provide a search query' });
        }

        const regex = new RegExp(q, 'i'); // Case-insensitive regex
        const results = [];

        // Determine which types to search
        const typesToSearch = type ? type.split(',') : ['subject', 'goal', 'tutorial', 'idea'];

        // Search Subjects
        if (typesToSearch.includes('subject')) {
            const subjects = await Subject.find({
                user: req.user.id,
                $or: [{ name: regex }, { description: regex }, { topics: regex }]
            }).lean();

            subjects.forEach(item => results.push({ ...item, type: 'subject' }));
        }

        // Search Goals
        if (typesToSearch.includes('goal')) {
            let goalQuery = {
                user: req.user.id,
                $or: [{ text: regex }, { description: regex }]
            };

            if (priority) {
                goalQuery.priority = priority;
            }

            const goals = await Goal.find(goalQuery).lean();

            goals.forEach(item => results.push({ ...item, type: 'goal', title: item.text }));
        }

        // Search Tutorials
        if (typesToSearch.includes('tutorial')) {
            const tutorials = await Tutorial.find({
                user: req.user.id,
                $or: [{ title: regex }, { channel: regex }, { description: regex }]
            }).lean();

            tutorials.forEach(item => results.push({ ...item, type: 'tutorial' }));
        }

        // Search Ideas
        if (typesToSearch.includes('idea')) {
            const ideas = await Idea.find({
                user: req.user.id,
                $or: [{ title: regex }, { content: regex }, { tags: regex }, { category: regex }]
            }).lean();

            ideas.forEach(item => results.push({ ...item, type: 'idea' }));
        }

        // Sorting
        if (sort === 'oldest') {
            results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else if (sort === 'priority') {
            // Custom sort: High > Medium > Low > others
            const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
            results.sort((a, b) => {
                const pA = priorityOrder[a.priority] || 0;
                const pB = priorityOrder[b.priority] || 0;
                return pB - pA;
            });
        } else {
            // Default: Newest first
            results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });

    } catch (error) {
        next(error);
    }
};
