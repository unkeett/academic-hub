// controllers/subjectController.js
const Subject = require('../models/Subject');

// @desc    Get all subjects
// @route   GET /api/subjects
const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new subject
// @route   POST /api/subjects
const createSubject = async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ message: 'Please provide a subject name' });
    }
    const subject = await Subject.create({
      name: req.body.name,
      topics: req.body.topics || [],
    });
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getSubjects,
  createSubject,
};