// server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001; // Use a port different from your React app

// === Middleware ===
// This allows your frontend at localhost:3000 (or similar) to make requests to this backend
app.use(cors()); 
// This allows the server to understand incoming JSON data
app.use(express.json());

// === Routes ===
// A simple test route to make sure the server is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the backend! 👋' });
});

// === Start the Server ===
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});