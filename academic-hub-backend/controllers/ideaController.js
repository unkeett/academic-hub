// controllers/ideaController.js
const Idea = require('../models/Idea');

// @desc    Get all ideas for a user
// @route   GET /api/ideas
// @access  Private
const getIdeas = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = { user: req.user.id };

    // Filter by category if provided
    if (category && category !== 'all') {
      query.category = category;
    }

    // Search in title and content if search term provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const ideas = await Idea.find(query).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: ideas.length,
      data: ideas
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single idea
// @route   GET /api/ideas/:id
// @access  Private
const getIdea = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found'
      });
    }

    // Make sure user owns idea
    if (idea.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this idea'
      });
    }

    res.status(200).json({
      success: true,
      data: idea
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new idea
// @route   POST /api/ideas
// @access  Private
const createIdea = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const idea = await Idea.create(req.body);
    res.status(201).json({
      success: true,
      data: idea
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update idea
// @route   PUT /api/ideas/:id
// @access  Private
const updateIdea = async (req, res, next) => {
  try {
    let idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found'
      });
    }

    // Make sure user owns idea
    if (idea.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this idea'
      });
    }

    idea = await Idea.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: idea
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete idea
// @route   DELETE /api/ideas/:id
// @access  Private
const deleteIdea = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found'
      });
    }

    // Make sure user owns idea
    if (idea.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this idea'
      });
    }

    await idea.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Idea deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get ideas by category
// @route   GET /api/ideas/category/:category
// @access  Private
const getIdeasByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const ideas = await Idea.find({ 
      user: req.user.id, 
      category: category 
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: ideas.length,
      data: ideas
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search ideas
// @route   GET /api/ideas/search/:searchTerm
// @access  Private
const searchIdeas = async (req, res, next) => {
  try {
    const { searchTerm } = req.params;
    const ideas = await Idea.find({
      user: req.user.id,
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { content: { $regex: searchTerm, $options: 'i' } },
        { tags: { $in: [new RegExp(searchTerm, 'i')] } }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: ideas.length,
      data: ideas
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getIdeas,
  getIdea,
  createIdea,
  updateIdea,
  deleteIdea,
  getIdeasByCategory,
  searchIdeas
};
