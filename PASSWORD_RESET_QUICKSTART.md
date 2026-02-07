# Password Reset Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Configure Email Settings

1. **For Gmail (Easiest for testing)**:
   
   a. Enable 2-Factor Authentication on your Gmail account
   
   b. Generate an App Password:
      - Go to https://myaccount.google.com/security
      - Click "2-Step Verification"
      - Scroll to bottom and click "App passwords"
      - Select "Mail" and your device type
      - Copy the 16-character password (no spaces)
   
   c. Update your `.env` file:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_EMAIL=youremail@gmail.com
   SMTP_PASSWORD=your_16_char_app_password
   FROM_NAME=Academic Hub
   FROM_EMAIL=noreply@academichub.com
   ```

### Step 2: Install Dependencies

```bash
# Backend
cd academic-hub-backend
npm install

# Frontend (if not already done)
cd ../academic-hub-frontend
npm install
```

### Step 3: Start Servers

```bash
# Terminal 1 - Backend
cd academic-hub-backend
npm start

# Terminal 2 - Frontend
cd academic-hub-frontend
npm start
```

## 🧪 Testing the Feature

### Test Flow:

1. **Navigate to Login Page**
   - Go to `http://localhost:3000/login`
   - Click "Forgot Password?" link

2. **Request Password Reset**
   - Enter your email address
   - Click "Send Reset Link"
   - Check your email inbox (and spam folder)

3. **Open Reset Email**
   - Click the "Reset Password" button in the email
   - Or copy the reset link and paste in browser

4. **Set New Password**
   - Enter your new password (min 6 characters)
   - Confirm your new password
   - Click "Reset Password"

5. **Login with New Password**
   - You'll be redirected to login page
   - Enter your email and new password
   - Success! You're logged in

### Test with cURL:

```bash
# 1. Request password reset
curl -X POST http://localhost:5001/api/auth/forgotpassword \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# 2. Reset password (use token from email)
curl -X PUT http://localhost:5001/api/auth/resetpassword/YOUR_TOKEN_HERE \
  -H "Content-Type: application/json" \
  -d '{"password":"newPassword123"}'
```

## 🔧 Troubleshooting

### Email Not Sending?

**Check 1**: Verify SMTP credentials
```bash
# In backend directory
cat .env | grep SMTP
```

**Check 2**: Check backend logs
```bash
# Look for error messages when requesting password reset
tail -f logs/error.log
```

**Check 3**: Gmail-specific issues
- Ensure 2FA is enabled
- Use App Password, not your regular password
- Check "Less secure app access" is OFF (use App Password instead)
- Temporarily disable antivirus/firewall

**Check 4**: Test SMTP connection
```bash
# Install telnet if needed
telnet smtp.gmail.com 587
```

### Token Expired?

Tokens expire after 10 minutes. Simply:
1. Go back to forgot password page
2. Request a new reset link
3. Use it within 10 minutes

### Link Not Working?

1. **Copy the full URL** from the email
2. **Check the format**: Should be like `http://localhost:3000/reset-password/abc123...`
3. **Ensure backend is running** on port 5001
4. **Check browser console** for errors

### Password Requirements Not Met?

- Minimum 6 characters
- Must match confirmation field
- Cannot be empty

## 📧 Email Service Alternatives

### SendGrid (Recommended for Production)

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_EMAIL=apikey
SMTP_PASSWORD=your_sendgrid_api_key
FROM_EMAIL=noreply@yourdomain.com
```

### Mailgun

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_EMAIL=postmaster@yourdomain.com
SMTP_PASSWORD=your_mailgun_password
FROM_EMAIL=noreply@yourdomain.com
```

### Amazon SES

```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_EMAIL=your_ses_username
SMTP_PASSWORD=your_ses_password
FROM_EMAIL=verified@yourdomain.com
```

## 🎨 Customizing Email Template

Edit `academic-hub-backend/controllers/authController.js`:

```javascript
const html = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h1 style="color: #3b82f6;">Your Custom Header</h1>
    <p>Your custom message here...</p>
    <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
      Reset Password
    </a>
  </div>
`;
```

## 🔐 Security Best Practices

1. **Never commit `.env` file** to git
2. **Use App Passwords** for Gmail (not your main password)
3. **Enable 2FA** on your email account
4. **Rotate SMTP passwords** regularly in production
5. **Monitor reset attempts** for suspicious activity
6. **Use HTTPS** in production (not HTTP)
7. **Set proper CORS** settings for your domain

## ✅ Checklist for Production

- [ ] Configure production email service (SendGrid/Mailgun)
- [ ] Update reset URL to production domain
- [ ] Enable HTTPS
- [ ] Set secure cookies
- [ ] Add rate limiting
- [ ] Monitor email delivery
- [ ] Set up email domain authentication (SPF, DKIM, DMARC)
- [ ] Test with multiple email providers
- [ ] Add email logging/tracking
- [ ] Set up alerts for failures

## 📚 Additional Resources

- **Full Documentation**: See `PASSWORD_RESET_DOCUMENTATION.md`
- **Implementation Details**: See `PASSWORD_RESET_SUMMARY.md`
- **API Reference**: See README.md API section
- **Nodemailer Docs**: https://nodemailer.com/
- **Gmail App Passwords**: https://support.google.com/accounts/answer/185833

## 🆘 Need Help?

1. Check the troubleshooting section above
2. Review backend logs: `academic-hub-backend/logs/error.log`
3. Check browser console for frontend errors
4. Verify all environment variables are set
5. Ensure both servers are running
6. Test email sending separately with a simple script

## 🎉 You're All Set!

The password reset feature is now ready to use. Users can securely reset their passwords and regain access to their accounts.

Happy coding! 🚀
