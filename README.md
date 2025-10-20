# Academic Hub

A comprehensive MERN stack application for students to manage their academic journey, including subjects, goals, tutorials, and ideas.

## Features

- **User Authentication**: Secure registration and login with JWT
- **Subject Management**: Track academic subjects with progress monitoring
- **Goal Setting**: Create and manage academic goals with priority levels
- **Tutorial Collection**: Save YouTube tutorials with automatic metadata extraction
- **Idea Capture**: Store and organize academic ideas and notes
- **Responsive Design**: Modern, mobile-friendly interface
- **Real-time Updates**: Live progress tracking and status updates

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **YouTube Data API** for tutorial metadata
- **Axios** for HTTP requests

### Frontend
- **React 19** with functional components and hooks
- **React Router** for navigation
- **Axios** for API communication
- **Context API** for state management
- **CSS3** with modern styling and animations

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- YouTube Data API key (for tutorial features)

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd academic-hub-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
MONGO_URI=mongodb://localhost:27017/academic-hub
JWT_SECRET=your_jwt_secret_key_here
JWT_COOKIE_EXPIRE=30
YOUTUBE_API_KEY=your_youtube_api_key_here
NODE_ENV=development
PORT=5001
```

4. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

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

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password

### Subjects
- `GET /api/subjects` - Get all subjects
- `POST /api/subjects` - Create subject
- `GET /api/subjects/:id` - Get single subject
- `PUT /api/subjects/:id` - Update subject
- `DELETE /api/subjects/:id` - Delete subject
- `PUT /api/subjects/:id/progress` - Update progress

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create goal
- `GET /api/goals/:id` - Get single goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal
- `PUT /api/goals/:id/toggle` - Toggle completion

### Tutorials
- `GET /api/tutorials` - Get all tutorials
- `POST /api/tutorials` - Create tutorial (YouTube URL)
- `GET /api/tutorials/:id` - Get single tutorial
- `PUT /api/tutorials/:id` - Update tutorial
- `DELETE /api/tutorials/:id` - Delete tutorial
- `PUT /api/tutorials/:id/toggle` - Toggle watched status

### Ideas
- `GET /api/ideas` - Get all ideas
- `POST /api/ideas` - Create idea
- `GET /api/ideas/:id` - Get single idea
- `PUT /api/ideas/:id` - Update idea
- `DELETE /api/ideas/:id` - Delete idea
- `GET /api/ideas/category/:category` - Get ideas by category
- `GET /api/ideas/search/:searchTerm` - Search ideas

## Usage

1. **Register/Login**: Create an account or login to access the application
2. **Dashboard**: View your academic overview with statistics and quick actions
3. **Subjects**: Add subjects, track topics, and monitor progress
4. **Goals**: Set academic goals with priorities and due dates
5. **Tutorials**: Save YouTube tutorials by pasting URLs
6. **Ideas**: Capture and organize academic ideas and notes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@academichub.com or create an issue in the repository.