<h1 align="center">
  Academic Hub
</h1> 

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Maintained](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/unkeett/academic-hub/graphs/commit-activity)
[![Issues](https://img.shields.io/github/issues/unkeett/academic-hub)](https://github.com/unkeett/academic-hub/issues)
[![Good First Issue](https://img.shields.io/github/issues/unkeett/academic-hub/good%20first%20issue?color=purple)](https://github.com/unkeett/academic-hub/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22)

</div>

# 🚀 Academic Hub — Student Productivity Dashboard


A full-stack MERN application for students to organize and track their academic journey. Manage subjects, set goals, save tutorials, and capture ideas—all in one place.

> **Note:** This is a learning project that's actively being developed. Some features are complete, others are in progress, and there are known issues. Contributions are welcome!

---

## Project Description

**Academic Hub** helps students stay organized by providing tools to:

- **Track Subjects**: Monitor your academic subjects with topic lists and progress tracking
- **Set Goals**: Create and manage academic goals with priorities and due dates
- **Save Tutorials**: Collect YouTube tutorials with automatic metadata extraction
- **Capture Ideas**: Store and organize academic ideas and notes by category

This project is designed for:
- Students who want to organize their academic work
- Developers learning the MERN stack
- Contributors looking for beginner-friendly open source projects

**What problem does it solve?**
Many students struggle to keep track of their academic progress, goals, and resources. Academic Hub provides a centralized platform to manage all of this information in one place.

---

## Tech Stack

### Frontend
- **React 19** - UI library with functional components and hooks
- **React Router 7** - Client-side routing
- **Axios** - HTTP client for API communication
- **Context API** - State management for authentication
- **CSS3** - Styling (no CSS framework)

### Backend
- **Node.js** - Runtime environment
- **Express.js 5** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose 8** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Axios** - HTTP requests (for YouTube API)

### Tools & Libraries
- **dotenv** - Environment variable management
- **express-validator** - Input validation (installed but not fully implemented)
- **nodemon** - Development server auto-reload
- **YouTube Data API** - Tutorial metadata extraction

---

## Project Structure

```bash
📁 academic-hub/
├──📁 academic-hub-backend/          # Backend API server
│   ├──📁 controllers/               # Request handlers
│   ├──📁 middleware/                # Auth & error handling
│   ├──📁 models/                    # MongoDB schemas
│   ├──📁 routes/                    # API route definitions
│   └──📄 server.js                  # Entry point
│
├──📁 academic-hub-frontend/         # React frontend
│   ├──📁 public/                    # Static assets
│   └──📁 src/
│       ├──📁 components/            # Reusable UI components
│       ├──📁 context/               # React Context (Auth)
│       ├──📁 pages/                 # Page components
│       └──📁 utils/                 # Utilities (API config)
│
└──📄 (...Documentation files)
```

**Separation:**
- **Backend** (`academic-hub-backend/`): RESTful API server running on port 5001
- **Frontend** (`academic-hub-frontend/`): React SPA running on port 3000
- Both can run independently but frontend requires backend for full functionality

---

## System Architecture

```
graph LR
    subgraph Client [Frontend - React]
    A[User UI] --> B[React Components]
    B --> C[Axios Client]
    end

    subgraph Server [Backend - Node/Express]
    C -->|HTTP Request| D[Express API]
    D --> E[Controllers/Routes]
    E --> F[Mongoose Models]
    end

    subgraph Database [Storage]
    F --> G[(MongoDB)]
    end

    style Client fill:#61dbfb,stroke:#333,stroke-width:2px
    style Server fill:#68a063,stroke:#333,stroke-width:2px
    style Database fill:#47a248,stroke:#333,stroke-width:2px
```

---

## Features

### ✅ Implemented & Working
- User registration and login with JWT authentication
- Subject management (create, read, update, delete)
- Goal tracking with completion status and priorities
- Tutorial collection from YouTube URLs (with metadata extraction)
- Idea capture with categories and search
- Dashboard with statistics overview
- Responsive UI design
- Protected API routes (authentication required)

### ⚠️ Partially Working / Needs Improvement
- Error handling (errors logged to console, not always shown to users)
- Form validation (basic HTML5 validation, backend validation incomplete)
- Loading states (some forms don't show loading indicators)
- Route protection (ProtectedRoute component exists but not fully implemented)

### ❌ Missing / Planned
- Password reset functionality
- Email verification
- User profile management UI
- API documentation (Swagger/OpenAPI)
- Unit and integration tests
- Pagination for lists
- Advanced search and filtering
- Export/import functionality
- Mobile app
- Real-time collaboration features

---

## Getting Started (Local Setup)

### Prerequisites

Before you begin, ensure you have:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local installation or MongoDB Atlas account) - [Download](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/cloud/atlas)
- **YouTube Data API Key** (optional, for tutorial features) - [Get API Key](https://developers.google.com/youtube/v3/getting-started)
- **Git** - [Download](https://git-scm.com/)

### Clone the Repository

```bash
git clone https://github.com/yourusername/academic-hub.git
cd academic-hub
```

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd academic-hub-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   # Create .env file in academic-hub-backend/
   touch .env
   ```

4. **Add environment variables** (see [Environment Variables](#environment-variables) section below)

5. **Start MongoDB:**
   ```bash
   # If using local MongoDB:
   mongod
   
   # Or use MongoDB Atlas (cloud) - no local setup needed
   ```

6. **Start the backend server:**
   ```bash
   npm run dev    # Development mode with auto-reload
   # or
   npm start      # Production mode
   ```

   Backend will run on `http://localhost:5001`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd academic-hub-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   # Create .env file in academic-hub-frontend/
   touch .env
   ```

4. **Add environment variables** (see [Environment Variables](#environment-variables) section below)

5. **Start the development server:**
   ```bash
   npm start
   ```

   Frontend will run on `http://localhost:3000` and automatically open in your browser.

### Verify Installation

1. Open `http://localhost:3000` in your browser
2. You should see the Academic Hub homepage
3. Click "Login" or "Register" to create an account
4. Once logged in, you can start adding subjects, goals, tutorials, and ideas

---

## Environment Variables

### Backend (`.env` in `academic-hub-backend/`)

Create a `.env` file with the following variables:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/academic-hub
# For MongoDB Atlas, use: mongodb+srv://username:password@cluster.mongodb.net/academic-hub

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_COOKIE_EXPIRE=30

# Server Configuration
PORT=5001
NODE_ENV=development

# YouTube API (Optional - required for tutorial features)
YOUTUBE_API_KEY=your_youtube_data_api_key_here
```

**Variable Explanations:**
- `MONGO_URI`: MongoDB connection string (local or Atlas)
- `JWT_SECRET`: Secret key for signing JWT tokens (use a long, random string)
- `JWT_COOKIE_EXPIRE`: Token expiration in days
- `PORT`: Backend server port (default: 5001)
- `NODE_ENV`: Environment mode (development/production)
- `YOUTUBE_API_KEY`: Required for adding YouTube tutorials (get from [Google Cloud Console](https://console.cloud.google.com/))

**⚠️ Important:** Never commit `.env` files to version control. They contain sensitive information.

### Frontend (`.env` in `academic-hub-frontend/`)

Create a `.env` file with:

```env
REACT_APP_API_URL=http://localhost:5001
```

**Variable Explanations:**
- `REACT_APP_API_URL`: Backend API base URL (change if backend runs on different port)

---

## API Overview

The backend provides a RESTful API with the following main endpoints:

### Authentication Endpoints

All authentication endpoints are public (no token required).

- `POST /api/auth/register` - Register a new user
  - Body: `{ name, email, password }`
  - Returns: `{ success: true, token: "...", data: { user } }`

- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: `{ success: true, token: "...", data: { user } }`

- `GET /api/auth/me` - Get current user (requires authentication)
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ success: true, data: { user } }`

- `PUT /api/auth/updatedetails` - Update user details (requires authentication)
- `PUT /api/auth/updatepassword` - Update password (requires authentication)

### Resource Endpoints

All resource endpoints require authentication. Include `Authorization: Bearer <token>` header.

**Subjects:**
- `GET /api/subjects` - Get all user's subjects
- `POST /api/subjects` - Create subject
- `GET /api/subjects/:id` - Get single subject
- `PUT /api/subjects/:id` - Update subject
- `DELETE /api/subjects/:id` - Delete subject
- `PUT /api/subjects/:id/progress` - Update progress

**Goals:**
- `GET /api/goals` - Get all user's goals
- `POST /api/goals` - Create goal
- `PUT /api/goals/:id/toggle` - Toggle completion status
- `DELETE /api/goals/:id` - Delete goal

**Tutorials:**
- `GET /api/tutorials` - Get all user's tutorials
- `POST /api/tutorials` - Create tutorial (requires YouTube URL)
- `PUT /api/tutorials/:id/toggle` - Toggle watched status
- `DELETE /api/tutorials/:id` - Delete tutorial

**Ideas:**
- `GET /api/ideas` - Get all user's ideas (supports `?category=` and `?search=` query params)
- `POST /api/ideas` - Create idea
- `GET /api/ideas/category/:category` - Get ideas by category
- `GET /api/ideas/search/:searchTerm` - Search ideas
- `DELETE /api/ideas/:id` - Delete idea

**Response Format:**
- Success: `{ success: true, data: {...}, count?: number }`
- Error: `{ success: false, message: "error message" }`

---

## Known Issues / Limitations

This project is actively being developed. Here are known issues and limitations:

### 🐛 Known Bugs
> [!IMPORTANT]
> Some error messages only appear in the browser console. We are working on a Toast notification system to show these to users.

### ⚠️ Security Considerations
> [!WARNING]
> This project currently has no rate limiting on authentication. It is intended for **local learning use only** and should not be deployed to production without adding security headers and input sanitization.

### 💡 Note for Contributors
> [!NOTE]
> We follow a "separation of concerns" logic. If you are touching the database, look at the `models/` folder in the backend first.

**For a complete list of issues, see [GITHUB_ISSUES.md](./GITHUB_ISSUES.md)**

---

## Contributing

Contributions are welcome! This project is beginner-friendly and great for learning.

### How to Contribute

1. **Find an issue to work on:**
   - Check [GITHUB_ISSUES.md](./GITHUB_ISSUES.md) for a list of issues
   - Look for issues labeled `good first issue` or `beginner-friendly`
   - Or suggest improvements by opening a new issue

2. **Fork and clone:**
   ```bash
   git clone https://github.com/yourusername/academic-hub.git
   cd academic-hub
   ```

3. **Create a branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes:**
   - Write clean, readable code
   - Follow existing code style
   - Test your changes locally

5. **Commit and push:**
   ```bash
   git add .
   git commit -m "Description of your changes"
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request:**
   - Describe what you changed and why
   - Reference any related issues
   - Be open to feedback

### Contribution Guidelines

- **Be respectful** - Follow the [Code of Conduct](./CODE_OF_CONDUCT.md)
- **Start small** - Pick beginner-friendly issues first
- **Ask questions** - Open an issue if you need help
- **Test your changes** - Make sure everything works before submitting
- **Write clear commit messages** - Help others understand your changes

### Good First Issues

Looking for your first contribution? Check out these beginner-friendly issues:
- Remove unused dependencies
- Fix console.error statements
- Add loading states to forms
- Improve error messages
- Add input validation

See [GITHUB_ISSUES.md](./GITHUB_ISSUES.md) for the complete list.

---

## Future Improvements

The project roadmap includes:

### Short-term
- [ ] Implement password reset functionality
- [ ] Add user-friendly error notifications (toast messages)
- [ ] Complete input validation and sanitization
- [ ] Add loading states to all forms
- [ ] Implement proper route protection
- [ ] Add API documentation (Swagger)

### Medium-term
- [ ] Write unit and integration tests
- [ ] Add pagination for list endpoints
- [ ] Implement rate limiting
- [ ] Add email verification
- [ ] Improve security headers and HTTPS enforcement
- [ ] Add database indexes for performance

### Long-term
- [ ] API versioning strategy
- [ ] Advanced search and filtering
- [ ] Export/import functionality
- [ ] Mobile app (React Native)
- [ ] Real-time collaboration features
- [ ] Analytics dashboard

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support

- **Issues**:** Open an issue on [GitHub Issues](https://github.com/yourusername/academic-hub/issues)
- **Questions**: Check existing issues or open a new one with the `question` label
- **Security**: See [SECURITY.md](./SECURITY.md) for security-related concerns

---

## Acknowledgments

- Built with the MERN stack
- Inspired by the need for better academic organization tools
- Thanks to all contributors who help improve this project

---

**Happy coding! 🚀**
