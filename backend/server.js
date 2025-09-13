// --- CONFIGURATION & IMPORTS ---

// Loads environment variables from a .env file into `process.env`.
// This is crucial for keeping sensitive data like API keys and database URIs out of the source code.
require('dotenv').config();

// Imports the Express framework, the backbone of our Node.js web application.
// It simplifies handling HTTP requests, routing, and middleware.
const express = require('express');

// Imports the CORS (Cross-Origin Resource Sharing) middleware.
// This is essential for allowing our React frontend (running on a different port/origin) to make requests to this backend.
const cors = require('cors');

// Imports Mongoose, an Object Data Modeling (ODM) library for MongoDB and Node.js.
// It helps us define schemas for our data and interact with the MongoDB database in a more structured way.
const mongoose = require('mongoose');

// Imports Axios, a promise-based HTTP client.
// We use it to make requests from our server to external APIs, specifically the YouTube Data API.
const axios = require('axios');


// --- INITIALIZATION ---

// Creates an instance of an Express application.
const app = express();

// Defines the port number our server will listen on.
// It's good practice to use an environment variable for this in production, but 5000 is fine for development.
const PORT = 5000;


// --- MIDDLEWARE SETUP ---

// Tells the Express app to use the CORS middleware. This adds the necessary headers
// to server responses to let browsers know that requests from other origins are permitted.
app.use(cors());

// Tells the Express app to use middleware that automatically parses incoming request bodies as JSON.
// This is what allows us to access data sent from the frontend via `req.body`.
app.use(express.json());


// --- DATABASE CONNECTION ---

// Connects to the MongoDB database using the connection string (URI) stored in the .env file.
// `useNewUrlParser` and `useUnifiedTopology` are standard options for the MongoDB driver.
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    // `.then()` is a Promise handler that runs if the connection is successful.
    .then(() => console.log('Successfully connected to MongoDB.'))
    // `.catch()` runs if there is an error during the connection attempt.
    .catch(err => console.error('MongoDB connection error:', err));


// --- DATABASE SCHEMAS & MODELS ---
// Mongoose Schemas define the structure of the documents within a collection in MongoDB.

// Schema for the 'subjects' collection.
const subjectSchema = new mongoose.Schema({
    name: String,
    topics: Number,
    progress: Number
});

// Schema for the 'goals' collection.
const goalSchema = new mongoose.Schema({
    text: String,
    completed: Boolean
});

// Schema for the 'ideas' collection.
const ideaSchema = new mongoose.Schema({
    text: String
});

// A more detailed schema for the 'tutorials' collection.
const tutorialSchema = new mongoose.Schema({
    videoId: { type: String, required: true, unique: true }, // The unique ID from the YouTube URL.
    url: { type: String, required: true },
    title: { type: String, required: true },
    channelName: { type: String, required: true },
    durationInMinutes: { type: Number, required: true },
    progressInMinutes: { type: Number, default: 0 }, // Defaults to 0 when a new tutorial is created.
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed'], // Ensures the status can only be one of these values.
        default: 'Not Started' // The default status for a new tutorial.
    }
}, { timestamps: true }); // `timestamps: true` automatically adds `createdAt` and `updatedAt` fields.

// Mongoose Models are constructors compiled from Schema definitions.
// An instance of a model represents a MongoDB document. We use these models to interact with the database.
const Subject = mongoose.model('Subject', subjectSchema);
const Goal = mongoose.model('Goal', goalSchema);
const Idea = mongoose.model('Idea', ideaSchema);
const Tutorial = mongoose.model('Tutorial', tutorialSchema);


// --- UTILITY FUNCTION ---

// A helper function to parse the ISO 8601 duration format returned by the YouTube API (e.g., "PT1H30M5S")
// and convert it into a total number of minutes.
function parseYouTubeDuration(isoDuration) {
    // This regular expression captures the numbers associated with Days (D), Hours (H), Minutes (M), and Seconds (S).
    const regex = /P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = isoDuration.match(regex);

    if (!matches) return 0; // Return 0 if the format is unexpected.

    // Extract and parse each part, defaulting to 0 if not present.
    const days = parseInt(matches[1] || 0, 10);
    const hours = parseInt(matches[2] || 0, 10) + days * 24; // Convert days to hours.
    const minutes = parseInt(matches[3] || 0, 10);
    const seconds = parseInt(matches[4] || 0, 10);

    // Calculate the total duration in minutes, rounding up to the nearest whole number.
    return Math.ceil(hours * 60 + minutes + seconds / 60);
}


// --- API ENDPOINTS (ROUTES) ---
// This is where we define how the server responds to different requests from the frontend.

// --- Subjects Resource ---

// GET /api/subjects: Fetches all documents from the 'subjects' collection.
app.get('/api/subjects', async (req, res) => res.json(await Subject.find()));

// POST /api/subjects: Creates a new subject document.
// The data for the new subject is in the request body (`req.body`).
app.post('/api/subjects', async (req, res) => res.status(201).json(await new Subject(req.body).save()));

// DELETE /api/subjects/:id: Deletes a subject by its unique ID.
// The `:id` in the URL is a parameter, accessible via `req.params.id`.
app.delete('/api/subjects/:id', async (req, res) => {
    try {
        const result = await Subject.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: 'Subject not found' }); // If no document matches the ID.
        res.status(200).json({ message: 'Subject deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting subject', error });
    }
});

// PUT /api/subjects/:id: Updates a subject by its ID.
// The new data is in `req.body`. `{ new: true }` ensures the updated document is returned.
app.put('/api/subjects/:id', async (req, res) => {
    try {
        const updatedSubject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSubject) return res.status(404).json({ message: 'Subject not found' });
        res.json(updatedSubject);
    } catch (error) {
        res.status(500).json({ message: 'Error updating subject', error });
    }
});


// --- Goals Resource ---

// GET /api/goals: Fetches all goals.
app.get('/api/goals', async (req, res) => res.json(await Goal.find()));

// POST /api/goals: Creates a new goal.
app.post('/api/goals', async (req, res) => res.status(201).json(await new Goal({ ...req.body, completed: false }).save()));

// PUT /api/goals/:id: Updates a goal (either its text or its completed status).
app.put('/api/goals/:id', async (req, res) => {
    const { text, completed } = req.body;
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal) return res.status(404).json({ message: 'Goal not found' });

        // This logic allows for both toggling and direct setting of the 'completed' status.
        goal.completed = (typeof completed === 'boolean') ? completed : !goal.completed;
        // If new text is provided in the request body, update the goal's text.
        if (text) goal.text = text;

        await goal.save(); // Save the changes to the database.
        res.json(goal);
    } catch (error) {
        res.status(500).json({ message: 'Error updating goal', error });
    }
});

// DELETE /api/goals/:id: Deletes a goal by its ID.
app.delete('/api/goals/:id', async (req, res) => {
    try {
        const result = await Goal.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: 'Goal not found' });
        res.status(200).json({ message: 'Goal deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting goal', error });
    }
});


// --- Ideas Resource ---

// GET /api/ideas: Fetches all ideas.
app.get('/api/ideas', async (req, res) => res.json(await Idea.find()));

// POST /api/ideas: Creates a new idea.
app.post('/api/ideas', async (req, res) => res.status(201).json(await new Idea(req.body).save()));

// DELETE /api/ideas/:id: Deletes an idea by its ID.
app.delete('/api/ideas/:id', async (req, res) => {
    try {
        const result = await Idea.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: 'Idea not found' });
        res.status(200).json({ message: 'Idea deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting idea', error });
    }
});

// PUT /api/ideas/:id: Updates an idea by its ID.
app.put('/api/ideas/:id', async (req, res) => {
    try {
        const updatedIdea = await Idea.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedIdea) return res.status(404).json({ message: 'Idea not found' });
        res.json(updatedIdea);
    } catch (error) {
        res.status(500).json({ message: 'Error updating idea', error });
    }
});


// --- Tutorials Resource ---

// GET /api/tutorials: Fetches all tutorials, sorted by most recently created.
app.get('/api/tutorials', async (req, res) => {
    try {
        const tutorials = await Tutorial.find().sort({ createdAt: -1 });
        res.json(tutorials);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tutorials', error });
    }
});

// POST /api/tutorials: The most complex endpoint. It adds a new tutorial by:
// 1. Getting a URL from the request body.
// 2. Extracting the video ID.
// 3. Calling the YouTube API to get video details.
// 4. Saving those details to our database.
app.post('/api/tutorials', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ message: 'YouTube URL is required' });

    try {
        // Extract the 'v' query parameter (the video ID) from the YouTube URL.
        const videoId = new URL(url).searchParams.get('v');
        if (!videoId) return res.status(400).json({ message: 'Invalid YouTube URL' });

        // Check if a tutorial with this video ID already exists to prevent duplicates.
        const existingTutorial = await Tutorial.findOne({ videoId });
        if (existingTutorial) return res.status(409).json({ message: 'This tutorial has already been added' });

        // Construct the URL for the YouTube Data API request.
        const YOUTUBE_API_URL = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails&key=${process.env.YOUTUBE_API_KEY}`;
        
        // Use Axios to make a GET request to the YouTube API.
        const response = await axios.get(YOUTUBE_API_URL);
        const videoData = response.data.items[0];
        
        if (!videoData) return res.status(404).json({ message: 'Video not found on YouTube' });

        // Use our utility function to parse the duration.
        const totalMinutes = parseYouTubeDuration(videoData.contentDetails.duration);

        // Create a new Tutorial document with the fetched data.
        const newTutorial = new Tutorial({
            videoId,
            url,
            title: videoData.snippet.title,
            channelName: videoData.snippet.channelTitle,
            durationInMinutes: totalMinutes,
        });

        // Save the new tutorial to the database.
        await newTutorial.save();
        res.status(201).json(newTutorial);

    } catch (error) {
        // Log a more detailed error on the server for debugging.
        console.error('Error adding tutorial:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Failed to add tutorial' });
    }
});

// PUT /api/tutorials/:id: Updates the progress of a tutorial.
app.put('/api/tutorials/:id', async (req, res) => {
    try {
        const { progressInMinutes } = req.body;
        const tutorial = await Tutorial.findById(req.params.id);
        
        if (!tutorial) return res.status(404).json({ message: 'Tutorial not found' });

        // Update the progress.
        tutorial.progressInMinutes = progressInMinutes;

        // Automatically update the status based on the progress.
        if (progressInMinutes >= tutorial.durationInMinutes) {
            tutorial.status = 'Completed';
        } else if (progressInMinutes > 0) {
            tutorial.status = 'In Progress';
        } else {
            tutorial.status = 'Not Started';
        }

        await tutorial.save();
        res.json(tutorial);
    } catch (error) {
        res.status(500).json({ message: 'Error updating progress', error });
    }
});

// DELETE /api/tutorials/:id: Deletes a tutorial by its ID.
app.delete('/api/tutorials/:id', async (req, res) => {
    try {
        const result = await Tutorial.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: 'Tutorial not found' });
        res.status(200).json({ message: 'Tutorial deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting tutorial', error });
    }
});


// --- SERVER STARTUP ---

// Binds and listens for connections on the specified port.
// The callback function is executed once the server starts successfully.
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

