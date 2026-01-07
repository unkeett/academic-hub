# GitHub Issues for Academic Hub

This document contains all identified issues organized by difficulty level for contributors.

---

## 1. 🐞 Beginner-Friendly Bugs (Good First Issue)

### Issue #1: Remove unused `bcrypt` dependency from package.json

**Title:** Remove unused `bcrypt` package dependency

**Description:**
The backend `package.json` includes both `bcrypt` and `bcryptjs`, but only `bcryptjs` is actually used in the codebase. The `bcrypt` package is unused and should be removed to reduce bundle size and avoid confusion.

**Steps to reproduce:**
1. Check `academic-hub-backend/package.json` - both `bcrypt` and `bcryptjs` are listed
2. Search codebase - only `bcryptjs` is imported in `models/User.js`

**Expected behavior:**
Only `bcryptjs` should be in dependencies.

**Files involved:**
- `academic-hub-backend/package.json`

**Why this is beginner-friendly:**
Simple dependency cleanup, no code changes needed, just remove one line from package.json.

---

### Issue #2: Replace console.error with proper error logging in production

**Title:** Replace console.error statements with proper logging

**Description:**
Multiple `console.error()` calls exist throughout the codebase. In production, these should use a proper logging library (like `winston` or `morgan`) instead of console methods.

**Steps to reproduce:**
1. Search for `console.error` in backend code
2. Found in: `middleware/auth.js`, `middleware/error.js`, `server.js`

**Expected behavior:**
Use a logging library that can be configured for different environments (dev vs production).

**Files involved:**
- `academic-hub-backend/middleware/auth.js` (line 29)
- `academic-hub-backend/middleware/error.js` (line 7)
- `academic-hub-backend/server.js` (multiple lines)

**Why this is beginner-friendly:**
Straightforward replacement of console methods with a logging library. Good introduction to production best practices.

---

### Issue #3: Remove console.error from frontend error handlers

**Title:** Remove or replace console.error in frontend components

**Description:**
Frontend components use `console.error()` for error handling. These should either be removed (errors are already handled) or replaced with user-friendly error notifications.

**Steps to reproduce:**
1. Check any page component (SubjectsPage, GoalsPage, etc.)
2. All catch blocks have `console.error()` calls

**Expected behavior:**
Errors should be shown to users via UI notifications, not just console.

**Files involved:**
- `academic-hub-frontend/src/pages/SubjectsPage.js`
- `academic-hub-frontend/src/pages/GoalsPage.js`
- `academic-hub-frontend/src/pages/TutorialsPage.js`
- `academic-hub-frontend/src/pages/IdeasPage.js`
- `academic-hub-frontend/src/components/DashboardSubjects.js`
- `academic-hub-frontend/src/components/DashboardGoals.js`
- `academic-hub-frontend/src/pages/HomePage.js`

**Why this is beginner-friendly:**
Simple find-and-replace or removal of console statements. Can optionally add toast notifications.

---

### Issue #4: Missing error message when password confirmation fails in Register

**Title:** Register form doesn't show error when passwords don't match

**Description:**
In `Register.js`, when passwords don't match, the form just returns early without showing an error message to the user. The error message exists in the JSX but the form submission is prevented silently.

**Steps to reproduce:**
1. Go to `/register`
2. Enter different passwords in password and confirm password fields
3. Submit form
4. No error message appears (though one exists in the code)

**Expected behavior:**
When passwords don't match, show an error message and prevent submission.

**Files involved:**
- `academic-hub-frontend/src/components/Register.js` (line 37-38)

**Why this is beginner-friendly:**
Simple fix - add error state and display it when passwords don't match.

---

### Issue #5: Test script in package.json just echoes error

**Title:** Backend test script doesn't actually run tests

**Description:**
The `test` script in `academic-hub-backend/package.json` just echoes an error message instead of running actual tests. This should either run tests or be removed.

**Steps to reproduce:**
1. Run `npm test` in backend directory
2. Script outputs "Error: no test specified" and exits

**Expected behavior:**
Either implement basic tests or remove the script.

**Files involved:**
- `academic-hub-backend/package.json` (line 9)

**Why this is beginner-friendly:**
Simple script update - either remove it or add a basic test setup.

---

### Issue #6: Missing email validation feedback in Register form

**Title:** Register form doesn't validate email format on frontend

**Description:**
The Register form uses HTML5 `type="email"` but doesn't provide custom validation feedback. Should add proper email format validation with user-friendly messages.

**Steps to reproduce:**
1. Go to `/register`
2. Enter invalid email format
3. HTML5 validation shows browser default message

**Expected behavior:**
Custom validation message for email format.

**Files involved:**
- `academic-hub-frontend/src/components/Register.js`

**Why this is beginner-friendly:**
Simple form validation addition using React state.

---

### Issue #7: Empty author field in package.json

**Title:** Backend package.json has empty author field

**Description:**
The `author` field in `academic-hub-backend/package.json` is empty. Should be filled with project maintainer info or removed.

**Steps to reproduce:**
1. Check `academic-hub-backend/package.json`
2. Line 17 shows `"author": ""`

**Expected behavior:**
Either fill with author info or remove the field.

**Files involved:**
- `academic-hub-backend/package.json`

**Why this is beginner-friendly:**
One-line change in JSON file.

---

---

## 2. 🟢 Level 1 Problems (Easy)

### Issue #8: Improve error handling in frontend - show user-friendly messages

**Title:** Replace console.error with user-visible error messages

**Description:**
All frontend error handlers currently only log to console. Users never see what went wrong. Should implement a toast notification system or error banner to show errors to users.

**What needs to be changed:**
- Create a toast/notification component
- Replace all `console.error()` calls with user-facing error messages
- Show errors for API failures, network issues, etc.

**Files/modules involved:**
- All page components (SubjectsPage, GoalsPage, TutorialsPage, IdeasPage)
- Dashboard components
- Create a new `ErrorNotification` or `Toast` component

**Skills required:**
- React component creation
- State management for notifications
- Basic CSS for toast styling

---

### Issue #9: Add loading states to all form submissions

**Title:** Add loading indicators during form submissions

**Description:**
When users submit forms (create/edit subjects, goals, etc.), there's no visual feedback that the request is processing. Buttons should show loading state and be disabled during submission.

**What needs to be changed:**
- Add `loading` state to all form components
- Disable submit buttons during API calls
- Show spinner or "Loading..." text on buttons

**Files/modules involved:**
- `academic-hub-frontend/src/components/SubjectForm.js`
- `academic-hub-frontend/src/components/GoalForm.js`
- `academic-hub-frontend/src/components/TutorialForm.js`
- `academic-hub-frontend/src/components/IdeaForm.js`
- `academic-hub-frontend/src/components/Login.js`
- `academic-hub-frontend/src/components/Register.js`

**Skills required:**
- React state management
- Conditional rendering
- Basic UX understanding

---

### Issue #10: Standardize API error response format

**Title:** Ensure all API endpoints return consistent error format

**Description:**
Some endpoints return errors with `message` field, others might return different structures. Need to audit and standardize all error responses to match the format: `{ success: false, message: "..." }`.

**What needs to be changed:**
- Review all controller error responses
- Ensure errorHandler middleware formats all errors consistently
- Test all error scenarios

**Files/modules involved:**
- All controller files in `academic-hub-backend/controllers/`
- `academic-hub-backend/middleware/error.js`

**Skills required:**
- Understanding of Express error handling
- API response structure knowledge

---

### Issue #11: Add input validation for subject progress update

**Title:** Validate completedTopics doesn't exceed topics array length

**Description:**
In `subjectController.js`, the `updateSubjectProgress` function checks if `completedTopics` is valid, but the validation happens after fetching the subject. Should validate earlier and provide better error messages.

**What needs to be changed:**
- Improve validation logic in `updateSubjectProgress`
- Add frontend validation to prevent invalid submissions
- Better error messages

**Files/modules involved:**
- `academic-hub-backend/controllers/subjectController.js` (line 162)
- `academic-hub-frontend/src/pages/SubjectsPage.js`

**Skills required:**
- Backend validation
- Frontend form validation

---

### Issue #12: Add pagination or limit to API responses

**Title:** Implement pagination for list endpoints

**Description:**
All list endpoints (GET /api/subjects, /api/goals, etc.) return all records without pagination. This will cause performance issues as data grows. Should add pagination or at least a limit.

**What needs to be changed:**
- Add `limit` and `skip` query parameters to list endpoints
- Update controllers to support pagination
- Update frontend to handle paginated responses
- Add "Load More" or page numbers in UI

**Files/modules involved:**
- All controller files with `get*` functions (plural)
- All frontend pages that fetch lists
- Frontend pagination components

**Skills required:**
- MongoDB querying (skip/limit)
- API design
- Frontend pagination UI

---

### Issue #13: Improve password validation feedback

**Title:** Add real-time password validation in Register form

**Description:**
The Register form only validates password length on submit. Should show real-time feedback as user types (minimum 6 characters, strength indicator, etc.).

**What needs to be changed:**
- Add password validation state
- Show validation messages as user types
- Optional: Add password strength indicator

**Files/modules involved:**
- `academic-hub-frontend/src/components/Register.js`

**Skills required:**
- React form handling
- Real-time validation logic

---

### Issue #14: Add request timeout handling

**Title:** Handle API request timeouts gracefully

**Description:**
No timeout handling for API requests. If backend is slow or unresponsive, frontend waits indefinitely. Should add timeout configuration and show appropriate errors.

**What needs to be changed:**
- Configure axios timeout
- Handle timeout errors in interceptors
- Show user-friendly timeout messages

**Files/modules involved:**
- `academic-hub-frontend/src/utils/axiosConfig.js`

**Skills required:**
- Axios configuration
- Error handling

---

---

## 3. 🟡 Level 2 Problems (Intermediate)

### Issue #15: Fix authentication state persistence issue

**Title:** AuthContext doesn't properly sync token from localStorage on mount

**Description:**
The `AuthContext` reads token from localStorage in initial state, but if the token is invalid/expired, it doesn't clear it until an API call fails. Should validate token on app start and clear if invalid.

**Current behavior:**
- Token in localStorage but expired → App thinks user is authenticated until API call fails
- User sees authenticated UI briefly before redirect

**Correct/ideal behavior:**
- On app start, validate token with backend
- If invalid, clear localStorage and set unauthenticated state immediately
- No brief flash of authenticated UI

**High-level solution approach:**
- Call `/api/auth/me` on app initialization
- Handle 401 response to clear invalid tokens
- Update AuthContext to handle this flow

**Files/modules affected:**
- `academic-hub-frontend/src/context/AuthContext.js`
- `academic-hub-frontend/src/App.js`

---

### Issue #16: Implement proper route protection

**Title:** Add ProtectedRoute wrapper for authenticated pages

**Description:**
Currently all routes are public. Pages like Subjects, Goals, etc. should be protected and redirect to login if user is not authenticated. There's a `ProtectedRoute.js` component but it's not being used.

**Current behavior:**
- All routes accessible without authentication
- Pages show empty states when not logged in
- Users can navigate to protected pages

**Correct/ideal behavior:**
- Protected routes redirect to `/login` if not authenticated
- Public routes (login, register) redirect to `/` if already authenticated
- Proper loading states during auth check

**High-level solution approach:**
- Wrap protected routes with `<ProtectedRoute>` component
- Update App.js routing
- Add redirect logic for authenticated users on login/register pages

**Files/modules affected:**
- `academic-hub-frontend/src/App.js`
- `academic-hub-frontend/src/components/ProtectedRoute.js`
- `academic-hub-frontend/src/components/Login.js`
- `academic-hub-frontend/src/components/Register.js`

---

### Issue #17: Fix duplicate password hashing libraries

**Title:** Remove bcrypt dependency, standardize on bcryptjs

**Description:**
Both `bcrypt` (native) and `bcryptjs` (JS) are in dependencies, but only `bcryptjs` is used. However, `bcrypt` (native) is faster. Should either use `bcrypt` (remove bcryptjs) or remove unused `bcrypt`. Also need to ensure consistent usage.

**Current behavior:**
- Two password hashing libraries in package.json
- Only bcryptjs is used
- Potential confusion for contributors

**Correct/ideal behavior:**
- Single password hashing library
- Consistent usage throughout codebase
- Better performance (use native bcrypt if possible)

**High-level solution approach:**
- Decide on one library (recommend native `bcrypt` for performance)
- Update User model to use chosen library
- Remove unused dependency
- Test password hashing/verification still works

**Files/modules affected:**
- `academic-hub-backend/package.json`
- `academic-hub-backend/models/User.js`

---

### Issue #18: Add input sanitization and validation middleware

**Title:** Implement request validation and sanitization

**Description:**
The project has `express-validator` installed but it's not being used. All input validation is done manually in controllers. Should use express-validator middleware for consistent validation and sanitization.

**Current behavior:**
- Manual validation in each controller
- No input sanitization
- Inconsistent validation patterns
- Potential security issues (XSS, injection)

**Correct/ideal behavior:**
- Centralized validation middleware
- Input sanitization on all user inputs
- Consistent error responses
- Protection against common attacks

**High-level solution approach:**
- Create validation middleware using express-validator
- Add validation rules for all endpoints
- Sanitize all string inputs
- Update controllers to use validation middleware

**Files/modules affected:**
- Create `academic-hub-backend/middleware/validator.js`
- Update all route files
- Update all controllers (remove manual validation)

---

### Issue #19: Fix CORS configuration for production

**Title:** CORS is too permissive - allows all origins

**Description:**
Current CORS setup allows all origins (`app.use(cors())`). This is fine for development but insecure for production. Should configure CORS to only allow specific origins.

**Current behavior:**
- All origins allowed
- No credentials configuration
- Works in dev but insecure in production

**Correct/ideal behavior:**
- Environment-based CORS configuration
- Whitelist specific origins in production
- Proper credentials handling

**High-level solution approach:**
- Configure CORS with origin whitelist
- Use environment variables for allowed origins
- Add credentials: true for cookie-based auth
- Test with different origins

**Files/modules affected:**
- `academic-hub-backend/server.js`
- `.env` file (add CORS_ORIGIN variable)

---

### Issue #20: Implement proper error logging system

**Title:** Replace console.log with structured logging

**Description:**
All logging uses `console.log/error`. Should implement a proper logging library (winston, pino) with different log levels, file rotation, and structured logging for production debugging.

**Current behavior:**
- Console.log for all logs
- No log levels
- No log persistence
- Hard to debug production issues

**Correct/ideal behavior:**
- Structured logging with levels (info, warn, error, debug)
- File logging in production
- Log rotation
- Request ID tracking

**High-level solution approach:**
- Install winston or pino
- Create logger utility
- Replace all console statements
- Configure for different environments
- Add request ID middleware

**Files/modules affected:**
- Create `academic-hub-backend/utils/logger.js`
- Update `server.js`
- Update all middleware files
- Update all controllers

---

### Issue #21: Add database indexes for performance

**Title:** Add MongoDB indexes for frequently queried fields

**Description:**
No database indexes are defined. Queries on `user` field (used in all models) and email (User model) will be slow as data grows. Should add indexes for performance.

**Current behavior:**
- No indexes defined
- Full collection scans on queries
- Slow queries as data grows

**Correct/ideal behavior:**
- Index on `user` field in all models (subjects, goals, tutorials, ideas)
- Unique index on `email` in User model (already unique but should be explicit)
- Compound indexes for common query patterns

**High-level solution approach:**
- Add index definitions to all model schemas
- Index `user` field (most common query)
- Ensure email has unique index
- Consider compound indexes for filtered queries

**Files/modules affected:**
- `academic-hub-backend/models/User.js`
- `academic-hub-backend/models/Subject.js`
- `academic-hub-backend/models/Goal.js`
- `academic-hub-backend/models/Tutorial.js`
- `academic-hub-backend/models/Idea.js`

---

### Issue #22: Fix JWT token expiration handling

**Title:** Improve JWT token refresh and expiration handling

**Description:**
JWT tokens expire after 30 days, but there's no refresh token mechanism. When token expires, user is logged out. Should implement token refresh or better expiration handling.

**Current behavior:**
- Token expires after 30 days
- No refresh mechanism
- User must re-login when token expires
- No warning before expiration

**Correct/ideal behavior:**
- Refresh token mechanism
- Automatic token refresh before expiration
- Graceful handling of expired tokens
- Optional: Warn user before token expires

**High-level solution approach:**
- Implement refresh token endpoint
- Store refresh token in httpOnly cookie
- Auto-refresh access token before expiration
- Update frontend to handle token refresh
- Update axios interceptor to refresh on 401

**Files/modules affected:**
- `academic-hub-backend/controllers/authController.js`
- `academic-hub-backend/routes/auth.js`
- `academic-hub-backend/models/User.js` (add refreshToken field)
- `academic-hub-frontend/src/context/AuthContext.js`
- `academic-hub-frontend/src/utils/axiosConfig.js`

---

---

## 4. 🔴 Level 3 Problems (Advanced)

### Issue #23: Security vulnerability - No rate limiting on authentication endpoints

**Title:** Implement rate limiting to prevent brute force attacks

**Description:**
Authentication endpoints (`/api/auth/login`, `/api/auth/register`) have no rate limiting. This allows brute force attacks and credential stuffing. Should implement rate limiting middleware.

**Why this is a serious issue:**
- Vulnerable to brute force attacks
- Can be used for DDoS
- No protection against credential stuffing
- Potential account enumeration

**Impact on system:**
- Security risk
- Server resource abuse
- Poor user experience if attacked
- Potential data breach

**Suggested architectural improvements:**
- Install `express-rate-limit` or `express-slow-down`
- Add rate limiting middleware
- Different limits for different endpoints
- IP-based and user-based limiting
- Store rate limit data in Redis for distributed systems
- Implement CAPTCHA after failed attempts

**Skills required:**
- Security best practices
- Express middleware
- Redis (optional, for distributed rate limiting)
- DDoS mitigation understanding

---

### Issue #24: Security vulnerability - Password reset functionality missing

**Title:** No password reset/forgot password feature

**Description:**
Users cannot reset forgotten passwords. This is a critical security and UX issue. Should implement secure password reset flow with email verification and time-limited tokens.

**Why this is a serious issue:**
- Users locked out if they forget password
- No way to recover accounts
- Security best practice missing
- Poor user experience

**Impact on system:**
- User support burden
- Account abandonment
- Security risk (users might reuse passwords)
- Missing standard feature

**Suggested architectural improvements:**
- Add "Forgot Password" endpoint
- Generate secure, time-limited reset tokens
- Store reset tokens in database with expiration
- Send reset email with secure link
- Implement "Reset Password" endpoint
- Invalidate reset token after use
- Add rate limiting to reset endpoints
- Log password reset attempts for security

**Skills required:**
- Email service integration (SendGrid, AWS SES, etc.)
- Secure token generation
- Database schema design
- Security best practices
- Frontend form handling

---

### Issue #25: Security vulnerability - No input sanitization against XSS

**Title:** Implement input sanitization to prevent XSS attacks

**Description:**
User inputs (subjects, goals, ideas, etc.) are stored and displayed without sanitization. Malicious scripts in user input could execute in other users' browsers (if multi-user features added) or cause issues.

**Why this is a serious issue:**
- XSS vulnerability
- Potential script injection
- Data integrity risk
- Security compliance issue

**Impact on system:**
- Security vulnerability
- Potential data corruption
- User trust issues
- Legal/compliance risks

**Suggested architectural improvements:**
- Install and configure `express-validator` for sanitization
- Sanitize all user inputs on backend
- Use `DOMPurify` or similar on frontend before rendering
- Implement Content Security Policy (CSP) headers
- Validate and sanitize all text fields
- Escape HTML in user-generated content
- Add input length limits (already partially done)

**Skills required:**
- Security expertise (XSS prevention)
- Input validation and sanitization
- Express middleware
- Frontend security (CSP, DOMPurify)

---

### Issue #26: Architecture issue - No environment-based configuration management

**Title:** Implement proper configuration management for different environments

**Description:**
Configuration is scattered and hardcoded. No proper config management for dev/staging/production. Environment variables are used but not validated. Missing configuration validation on startup.

**Why this is a serious issue:**
- Hard to deploy to different environments
- Configuration errors only discovered at runtime
- No validation of required env vars
- Potential security issues (missing secrets)

**Impact on system:**
- Deployment difficulties
- Runtime errors from missing config
- Security risks
- Poor developer experience

**Suggested architectural improvements:**
- Create `config/` directory with environment-specific configs
- Use `dotenv` with validation (or `envalid`)
- Validate all required environment variables on startup
- Provide default values where appropriate
- Separate configs for dev/staging/production
- Document all required environment variables
- Fail fast on missing critical config

**Skills required:**
- Configuration management patterns
- Environment variable handling
- Application architecture
- DevOps understanding

---

### Issue #27: Architecture issue - No API versioning strategy

**Title:** Implement API versioning for future compatibility

**Description:**
API endpoints have no versioning (`/api/subjects` instead of `/api/v1/subjects`). When API changes are needed, existing clients will break. Should implement versioning strategy.

**Why this is a serious issue:**
- Breaking changes affect all clients
- No way to deprecate old endpoints
- Difficult to maintain backward compatibility
- Poor API design practice

**Impact on system:**
- Breaking changes break existing integrations
- Can't evolve API safely
- Poor developer experience for API consumers
- Maintenance burden

**Suggested architectural improvements:**
- Implement `/api/v1/` prefix for all routes
- Create version routing structure
- Document versioning strategy
- Add deprecation headers for old versions
- Plan migration path for v2
- Update all route definitions
- Update frontend to use versioned endpoints

**Skills required:**
- API design principles
- RESTful API best practices
- Express routing architecture
- Versioning strategies

---

### Issue #28: Security vulnerability - No HTTPS enforcement in production

**Title:** Add HTTPS enforcement and security headers

**Description:**
No HTTPS enforcement, security headers (HSTS, CSP, etc.), or helmet middleware. Application is vulnerable to various attacks when deployed to production.

**Why this is a serious issue:**
- Data transmitted in plain text
- Vulnerable to man-in-the-middle attacks
- Missing security headers
- Not production-ready

**Impact on system:**
- Security vulnerability
- Data breach risk
- Compliance issues
- User trust problems

**Suggested architectural improvements:**
- Install and configure `helmet` middleware
- Add security headers (HSTS, CSP, X-Frame-Options, etc.)
- Enforce HTTPS in production
- Configure CORS properly (already identified in Issue #19)
- Add security.txt file
- Implement proper cookie security (httpOnly, secure, sameSite)

**Skills required:**
- Web security expertise
- HTTP security headers knowledge
- Production deployment security
- OWASP Top 10 awareness

---

### Issue #29: Architecture issue - No database connection pooling configuration

**Title:** Configure MongoDB connection pooling for production

**Description:**
Mongoose connection uses default settings. No connection pooling configuration, retry logic, or connection management. Will cause issues under load.

**Why this is a serious issue:**
- Default connection limits may be insufficient
- No retry logic for connection failures
- Poor performance under load
- Potential connection exhaustion

**Impact on system:**
- Performance degradation
- Connection errors under load
- Poor scalability
- Production stability issues

**Suggested architectural improvements:**
- Configure connection pool size
- Add connection retry logic
- Implement connection health checks
- Add connection event handlers
- Configure connection timeout
- Monitor connection pool metrics
- Implement graceful connection closing

**Skills required:**
- MongoDB/Mongoose expertise
- Database connection management
- Performance optimization
- Production system design

---

### Issue #30: Architecture issue - No request validation for MongoDB ObjectIds

**Title:** Add validation middleware for MongoDB ObjectId parameters

**Description:**
Route parameters like `:id` are used directly in `findById()` without validation. Invalid ObjectIds cause Mongoose CastErrors. Should validate before database queries.

**Why this is a serious issue:**
- Unnecessary database queries with invalid IDs
- Inconsistent error responses
- Potential information leakage
- Poor error handling

**Impact on system:**
- Wasted database resources
- Inconsistent API responses
- Poor developer experience
- Security considerations (ID enumeration)

**Suggested architectural improvements:**
- Create ObjectId validation middleware
- Validate all `:id` parameters before controllers
- Return consistent 400 errors for invalid IDs
- Add to all routes with ID parameters
- Consider using express-validator for this

**Skills required:**
- Express middleware development
- MongoDB ObjectId validation
- API design
- Error handling patterns

---

### Issue #31: Security vulnerability - JWT secret not validated on startup

**Title:** Validate JWT_SECRET exists and meets security requirements on startup

**Description:**
Server starts even if JWT_SECRET is missing or weak. Should validate JWT_SECRET on startup and fail fast if invalid. Also should check for default/weak secrets.

**Why this is a serious issue:**
- Server can start with missing JWT_SECRET (crashes on first auth)
- Weak secrets are security risk
- No validation of secret strength
- Runtime failures instead of startup failures

**Impact on system:**
- Security vulnerability
- Runtime crashes
- Poor developer experience
- Production deployment issues

**Suggested architectural improvements:**
- Validate JWT_SECRET exists on startup
- Check minimum length (recommend 32+ characters)
- Warn about weak secrets
- Fail fast if missing or invalid
- Add to configuration validation (see Issue #26)
- Document secret generation requirements

**Skills required:**
- Security best practices
- Application startup validation
- Configuration management
- JWT security understanding

---

### Issue #32: Architecture issue - No API documentation

**Title:** Implement API documentation (Swagger/OpenAPI)

**Description:**
No API documentation exists. Developers must read code to understand endpoints. Should implement Swagger/OpenAPI documentation for better developer experience and API discoverability.

**Why this is a serious issue:**
- Poor developer experience
- Hard to onboard new developers
- No API contract documentation
- Difficult for frontend/backend coordination
- Missing industry standard

**Impact on system:**
- Slower development
- Integration difficulties
- Onboarding challenges
- Missing feature for API consumers

**Suggested architectural improvements:**
- Install `swagger-jsdoc` and `swagger-ui-express`
- Document all API endpoints
- Add request/response schemas
- Include authentication requirements
- Add example requests/responses
- Host at `/api-docs` endpoint
- Keep documentation in sync with code

**Skills required:**
- API documentation standards
- OpenAPI/Swagger specification
- Express middleware integration
- API design documentation

---

---

## Summary

- **Beginner-Friendly (Good First Issue):** 7 issues
- **Level 1 (Easy):** 7 issues  
- **Level 2 (Intermediate):** 8 issues
- **Level 3 (Advanced):** 10 issues

**Total: 32 issues**

All issues are real problems found in the codebase. Each issue is actionable and can be worked on independently.
