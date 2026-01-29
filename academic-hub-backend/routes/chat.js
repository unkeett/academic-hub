const express = require('express');
const axios = require('axios');
const router = express.Router();

// @route   POST /api/chat
// @desc    Send message to AI chatbot
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    if (!process.env.GROK_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'AI service is not configured'
      });
    }

    // Prepare messages array with conversation history
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful AI assistant for Academic Hub, a student productivity platform. Help users with academic questions, study tips, organization advice, and general academic support. Be friendly, concise, and encouraging.'
      },
      ...history.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    // Call Grok xAI API
    const response = await axios.post(
      'https://api.x.ai/v1/chat/completions',
      {
        model: 'grok-beta',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const aiReply = response.data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    res.json({
      success: true,
      response: aiReply
    });

  } catch (error) {
    console.error('Chat API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      return res.status(500).json({
        success: false,
        error: 'AI service authentication failed'
      });
    }

    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please try again later.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to get AI response. Please try again.'
    });
  }
});

module.exports = router;