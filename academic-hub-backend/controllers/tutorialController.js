// controllers/tutorialController.js
const axios = require('axios');
const Tutorial = require('../models/Tutorial');

// Helper function to extract video ID from YouTube URL
const extractVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Helper function to format duration
const formatDuration = (duration) => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 'Unknown';
  
  const hours = parseInt(match[1] || 0);
  const minutes = parseInt(match[2] || 0);
  const seconds = parseInt(match[3] || 0);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
};

// @desc    Get all tutorials for a user
// @route   GET /api/tutorials
// @access  Private
const getTutorials = async (req, res, next) => {
  try {
    const tutorials = await Tutorial.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: tutorials.length,
      data: tutorials
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single tutorial
// @route   GET /api/tutorials/:id
// @access  Private
const getTutorial = async (req, res, next) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id);

    if (!tutorial) {
      return res.status(404).json({
        success: false,
        message: 'Tutorial not found'
      });
    }

    // Make sure user owns tutorial
    if (tutorial.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this tutorial'
      });
    }

    res.status(200).json({
      success: true,
      data: tutorial
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new tutorial from YouTube URL
// @route   POST /api/tutorials
// @access  Private
const createTutorial = async (req, res, next) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a YouTube URL'
      });
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid YouTube URL'
      });
    }

    // Check if tutorial already exists for this user
    const existingTutorial = await Tutorial.findOne({ 
      url: url, 
      user: req.user.id 
    });

    if (existingTutorial) {
      return res.status(400).json({
        success: false,
        message: 'Tutorial already exists in your collection'
      });
    }

    // Fetch video details from YouTube Data API
    const youtubeApiKey = process.env.YOUTUBE_API_KEY;
    if (!youtubeApiKey) {
      return res.status(500).json({
        success: false,
        message: 'YouTube API key not configured'
      });
    }

    const youtubeResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${youtubeApiKey}&part=snippet,contentDetails`
    );

    if (youtubeResponse.data.items.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Video not found on YouTube'
      });
    }

    const videoData = youtubeResponse.data.items[0];
    const snippet = videoData.snippet;
    const contentDetails = videoData.contentDetails;

    // Create tutorial with fetched data
    const tutorialData = {
      title: snippet.title,
      channel: snippet.channelTitle,
      duration: formatDuration(contentDetails.duration),
      url: url,
      thumbnail: snippet.thumbnails.medium?.url || snippet.thumbnails.default?.url,
      description: snippet.description.substring(0, 1000), // Limit description length
      user: req.user.id
    };

    const tutorial = await Tutorial.create(tutorialData);

    res.status(201).json({
      success: true,
      data: tutorial
    });
  } catch (error) {
    if (error.response && error.response.status === 403) {
      return res.status(500).json({
        success: false,
        message: 'YouTube API quota exceeded or invalid API key'
      });
    }
    next(error);
  }
};

// @desc    Update tutorial
// @route   PUT /api/tutorials/:id
// @access  Private
const updateTutorial = async (req, res, next) => {
  try {
    let tutorial = await Tutorial.findById(req.params.id);

    if (!tutorial) {
      return res.status(404).json({
        success: false,
        message: 'Tutorial not found'
      });
    }

    // Make sure user owns tutorial
    if (tutorial.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this tutorial'
      });
    }

    tutorial = await Tutorial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: tutorial
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete tutorial
// @route   DELETE /api/tutorials/:id
// @access  Private
const deleteTutorial = async (req, res, next) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id);

    if (!tutorial) {
      return res.status(404).json({
        success: false,
        message: 'Tutorial not found'
      });
    }

    // Make sure user owns tutorial
    if (tutorial.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this tutorial'
      });
    }

    await tutorial.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Tutorial deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle tutorial watched status
// @route   PUT /api/tutorials/:id/toggle
// @access  Private
const toggleWatched = async (req, res, next) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id);

    if (!tutorial) {
      return res.status(404).json({
        success: false,
        message: 'Tutorial not found'
      });
    }

    // Make sure user owns tutorial
    if (tutorial.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this tutorial'
      });
    }

    tutorial.watched = !tutorial.watched;
    await tutorial.save();

    res.status(200).json({
      success: true,
      data: tutorial
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTutorials,
  getTutorial,
  createTutorial,
  updateTutorial,
  deleteTutorial,
  toggleWatched
};
