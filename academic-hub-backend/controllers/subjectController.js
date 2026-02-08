const Subject = require('../models/Subject');

// @desc    Get all subjects for a user (with pagination)
// @route   GET /api/subjects?page=1&limit=5
// @access  Private
const getSubjects = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const skip = (page - 1) * limit;

    const totalSubjects = await Subject.countDocuments({
      user: req.user.id
    });

    const subjects = await Subject.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: subjects.length,
      total: totalSubjects,
      page,
      pages: Math.ceil(totalSubjects / limit),
      data: subjects
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single subject
// @route   GET /api/subjects/:id
// @access  Private
const getSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    if (subject.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this subject'
      });
    }

    res.status(200).json({
      success: true,
      data: subject
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new subject
// @route   POST /api/subjects
// @access  Private
const createSubject = async (req, res, next) => {
  try {
    req.body.user = req.user.id;

    const subject = await Subject.create(req.body);

    res.status(201).json({
      success: true,
      data: subject
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update subject
// @route   PUT /api/subjects/:id
// @access  Private
const updateSubject = async (req, res, next) => {
  try {
    let subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    if (subject.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this subject'
      });
    }

    subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: subject
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete subject
// @route   DELETE /api/subjects/:id
// @access  Private
const deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    if (subject.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this subject'
      });
    }

    await subject.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Subject deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update subject progress
// @route   PUT /api/subjects/:id/progress
// @access  Private
const updateSubjectProgress = async (req, res, next) => {
  try {
    const { completedTopics } = req.body;

    if (completedTopics === undefined) {
      return res.status(400).json({
        success: false,
        message: 'completedTopics is required'
      });
    }

    if (typeof completedTopics !== 'number' || Number.isNaN(completedTopics)) {
      return res.status(400).json({
        success: false,
        message: 'completedTopics must be a valid number'
      });
    }

    if (completedTopics < 0) {
      return res.status(400).json({
        success: false,
        message: 'completedTopics cannot be negative'
      });
    }

    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    if (subject.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this subject'
      });
    }

    if (completedTopics > subject.topics.length) {
      return res.status(400).json({
        success: false,
        message: 'completedTopics cannot exceed total topics'
      });
    }

    subject.completedTopics = completedTopics;
    await subject.save();

    res.status(200).json({
      success: true,
      data: subject
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
  updateSubjectProgress
};
