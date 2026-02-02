# Changelog

All notable changes to the Academic Hub project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Password Reset Functionality** (2026-02-02)
  - Implemented secure password reset via email verification
  - Added forgot password endpoint (`POST /api/auth/forgotpassword`)
  - Added reset password endpoint (`PUT /api/auth/resetpassword/:resettoken`)
  - Created email utility with nodemailer for sending reset emails
  - Added ForgotPassword component for requesting password resets
  - Added ResetPassword component for setting new passwords
  - Added "Forgot Password?" link to login page
  - Enhanced User model with reset token fields and methods
  - Tokens expire after 10 minutes for security
  - Tokens are hashed using SHA256 before storage
  - Added comprehensive documentation (PASSWORD_RESET_DOCUMENTATION.md)
  - Added quick start guide (PASSWORD_RESET_QUICKSTART.md)
  - Added implementation summary (PASSWORD_RESET_SUMMARY.md)
  - Added .env.example with email configuration
  - Added success message styling in Auth.css
  - Added routes for /forgot-password and /reset-password/:resettoken
  
- **Structured Logging System** (2026-02-02)
  - Created logger utility using Winston
  - Replaced console.log/error with structured logging
  - Added log levels (info, warn, error, debug)
  - Added file logging (error.log, combined.log, exceptions.log)
  - Integrated logger in all controllers and middleware
  - Added logger to server.js and error handler

### Changed
- Updated package.json to include nodemailer dependency
- Enhanced authController.js with crypto import for token hashing
- Updated App.js to recognize password reset pages as auth pages
- Improved Auth.css with better styling for form links and messages

### Fixed
- Fixed test script in backend package.json (changed from error to info message)

### Security
- Implemented secure token generation using crypto.randomBytes
- Added SHA256 hashing for password reset tokens
- Set token expiration to 10 minutes
- Tokens are single-use and cleared after successful reset
- No password exposure in password reset flow

## [1.0.0] - Initial Release

### Added
- User authentication with JWT
- Subject management (CRUD operations)
- Goal tracking with completion status
- Tutorial collection from YouTube URLs
- Idea capture with categories and search
- Dashboard with statistics
- Responsive UI design
- Protected API routes
- MongoDB integration
- React frontend with routing
- Express backend API

---

## Contributing

When adding entries to this changelog:
1. Add new entries under [Unreleased] section
2. Use categories: Added, Changed, Deprecated, Removed, Fixed, Security
3. Include the date for major features
4. Be descriptive but concise
5. Link to issues/PRs when applicable
