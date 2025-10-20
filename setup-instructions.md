# Academic Hub Setup Instructions

## Backend Setup

1. Navigate to the backend directory:
```bash
cd academic-hub-backend
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following content:
```env
MONGO_URI=mongodb://localhost:27017/academic-hub
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
JWT_COOKIE_EXPIRE=30
YOUTUBE_API_KEY=your_youtube_api_key_here
NODE_ENV=development
PORT=5001
```

4. Start the backend server:
```bash
npm run dev
# or
node server.js
```

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd academic-hub-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5001
```

4. Start the frontend development server:
```bash
npm start
```

## Database Setup

Make sure MongoDB is running on your system:
- Local MongoDB: `mongod`
- MongoDB Atlas: Use the connection string in your `.env` file

## Common Issues and Solutions

### 1. "axios is not defined" errors
- Make sure you've restarted the development server after making changes
- Clear browser cache and restart the dev server

### 2. MongoDB connection errors
- Ensure MongoDB is running
- Check the MONGO_URI in your .env file

### 3. JWT errors
- Make sure JWT_SECRET is set in your .env file
- Use a long, secure secret key

### 4. YouTube API errors
- Get a YouTube Data API key from Google Cloud Console
- Add it to your .env file as YOUTUBE_API_KEY

## Testing the Application

1. Open http://localhost:3000 in your browser
2. Register a new account
3. Start adding subjects, goals, tutorials, and ideas!

## Troubleshooting

If you encounter any issues:
1. Check the browser console for errors
2. Check the terminal for backend errors
3. Ensure all dependencies are installed
4. Restart both frontend and backend servers


