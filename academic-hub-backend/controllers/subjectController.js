// controllers/subjectController.js
const Subject = require('../models/Subject');

// @desc    Get all subjects for a user
// @route   GET /api/subjects
// @access  Private
const getSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: subjects.length,
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

    // Make sure user owns subject
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
    // Add user to req.body
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

    // Make sure user owns subject
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

    // Make sure user owns subject
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
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    // Make sure user owns subject
    if (subject.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this subject'
      });
    }

    const { completedTopics } = req.body;
    
    if (completedTopics < 0 || completedTopics > subject.topics.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid completed topics count'
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