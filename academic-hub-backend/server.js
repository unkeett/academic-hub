// server.js
require('dotenv').config(); // Load env vars FIRST
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const errorHandler = require('./middleware/error');
const logger = require('./config/logger');

// Debug: Check if JWT_SECRET is loaded
if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined in environment variables!');
} else {
  console.log('Environment Check: JWT_SECRET is loaded.'); // Do not log the actual secret
}

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/', (req, res) => res.json({ message: 'Academic Hub API is running', status: 'OK' }));
app.get('/api/test', (req, res) => res.json({ message: 'Academic Hub API is running!' }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/tutorials', require('./routes/tutorials'));
app.use('/api/ideas', require('./routes/ideas'));
app.use('/api/search', require('./routes/search'));

// Error handling middleware (must be after routes)
app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});

// --- START: IMPROVED CONNECTION LOGIC ---

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    if (!mongoUri || process.env.NODE_ENV === 'development') {
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        mongoUri = mongod.getUri();
        logger.info('Using MongoDB Memory Server for development');
      } catch (err) {
        logger.warn('Could not start MongoDB Memory Server, falling back to MONGO_URI');
      }
    }

    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined and MongoDB Memory Server failed to start');
    }

    const conn = await mongoose.connect(mongoUri);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

// Connect to DB and then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
    logger.info(`Academic Hub API ready for requests`);
  });
});

// --- END: IMPROVED CONNECTION LOGIC ---