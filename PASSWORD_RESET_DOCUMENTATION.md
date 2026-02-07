# Password Reset Feature Documentation

## Overview
The password reset functionality allows users to securely reset their password via email verification. This feature has been fully implemented for both backend and frontend.

## Backend Implementation

### Files Added/Modified

1. **`models/User.js`**
   - Added `resetPasswordToken` field (String)
   - Added `resetPasswordExpire` field (Date)
   - Added `getResetPasswordToken()` method to generate and hash reset tokens

2. **`controllers/authController.js`**
   - Implemented `forgotPassword` controller
   - Implemented `resetPassword` controller

3. **`routes/auth.js`**
   - Added `POST /api/auth/forgotpassword` route
   - Added `PUT /api/auth/resetpassword/:resettoken` route

4. **`utils/sendEmail.js`** (NEW)
   - Email utility using nodemailer
   - Handles sending password reset emails

5. **`package.json`**
   - Added `nodemailer` dependency

### API Endpoints

#### Forgot Password
```
POST /api/auth/forgotpassword
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "There is no user with that email"
}
```

#### Reset Password
```
PUT /api/auth/resetpassword/:resettoken
```

**Request Body:**
```json
{
  "password": "newPassword123"
}
```

**Success Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "data": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "user"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Invalid or expired reset token"
}
```

## Frontend Implementation

### Files Added/Modified

1. **`components/ForgotPassword.js`** (NEW)
   - Form to request password reset
   - Sends email to user with reset link

2. **`components/ResetPassword.js`** (NEW)
   - Form to enter new password
   - Validates password and confirmation match
   - Uses reset token from URL parameter

3. **`components/Login.js`**
   - Added "Forgot Password?" link

4. **`App.js`**
   - Added route for `/forgot-password`
   - Added route for `/reset-password/:resettoken`
   - Updated auth page detection logic

5. **`components/Auth.css`**
   - Added styling for success messages
   - Added styling for forgot password link
   - Added styling for link buttons

### Routes

- `/forgot-password` - Request password reset page
- `/reset-password/:resettoken` - Reset password with token page

## Configuration

### Environment Variables

Add these variables to your `.env` file:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_specific_password
FROM_NAME=Academic Hub
FROM_EMAIL=noreply@academichub.com
```

### Gmail Setup (Recommended)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security > 2-Step Verification > App Passwords
   - Select "Mail" and your device
   - Copy the generated password
3. Use the App Password as `SMTP_PASSWORD` in your `.env` file

### Alternative Email Services

You can use other email services by changing the SMTP configuration:

**SendGrid:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_EMAIL=apikey
SMTP_PASSWORD=your_sendgrid_api_key
```

**Mailgun:**
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_EMAIL=your_mailgun_email
SMTP_PASSWORD=your_mailgun_password
```

## Security Features

1. **Token Expiration**: Reset tokens expire after 10 minutes
2. **Token Hashing**: Tokens are hashed using SHA256 before storage
3. **Single Use**: Tokens are cleared after successful password reset
4. **No Password Exposure**: Old password not required for reset

## User Flow

1. User clicks "Forgot Password?" on login page
2. User enters their email address
3. System sends email with reset link (if email exists)
4. User clicks link in email (redirects to `/reset-password/:token`)
5. User enters new password and confirms it
6. System validates token and updates password
7. User is automatically logged in (or redirected to login)

## Testing

### Test Forgot Password
```bash
curl -X POST http://localhost:5001/api/auth/forgotpassword \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Test Reset Password
```bash
curl -X PUT http://localhost:5001/api/auth/resetpassword/YOUR_TOKEN_HERE \
  -H "Content-Type: application/json" \
  -d '{"password":"newPassword123"}'
```

## Installation

1. Install backend dependency:
```bash
cd academic-hub-backend
npm install nodemailer
```

2. Configure email settings in `.env`

3. Start the backend server:
```bash
npm start
```

4. Frontend components are ready to use (no additional installation needed)

## Error Handling

The feature includes comprehensive error handling:
- Invalid email address
- Expired reset token
- Invalid reset token
- Password validation errors
- Email sending failures

## Future Enhancements

- [ ] Add email templates with better styling
- [ ] Add rate limiting for forgot password requests
- [ ] Add email verification before allowing password reset
- [ ] Add password strength indicator
- [ ] Add security questions as additional verification
- [ ] Log password reset attempts for security monitoring

## Troubleshooting

### Email not sending
1. Check SMTP credentials in `.env`
2. Verify 2FA and App Password for Gmail
3. Check firewall/network settings
4. Review backend logs for error messages

### Token invalid/expired
1. Tokens expire after 10 minutes
2. Request a new reset link
3. Check system time synchronization

### Cannot find user
1. Verify email address is correct
2. Check if user exists in database
3. Email lookup is case-insensitive

## Contributing

When contributing to this feature:
1. Maintain security best practices
2. Add appropriate error handling
3. Update documentation for any changes
4. Test thoroughly before submitting PR
