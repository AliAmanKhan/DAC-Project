# Forgot Password - Quick Start Guide

## ✅ Implementation Complete!

The forgot password functionality has been successfully implemented for the CollabIT project.

## What's Been Added

### Backend
1. ✅ Email service with nodemailer
2. ✅ Forgot password endpoint (`POST /auth/forgot-password`)
3. ✅ Reset password endpoint (`POST /auth/reset-password`)
4. ✅ Database migration (reset_token columns added)
5. ✅ Secure token generation and validation

### Frontend
1. ✅ Forgot Password page (`/forgot-password`)
2. ✅ Reset Password page (`/reset-password`)
3. ✅ Password strength indicator
4. ✅ Updated Login page with "Forgot?" link
5. ✅ Auth service methods added

## Quick Test

### Testing in Development Mode

Since we're in development mode, emails are logged to console instead of being sent. Here's how to test:

1. **Navigate to login page**: `http://localhost:5173/login`

2. **Click "Forgot?" link** next to the password field

3. **Enter your email** on the forgot password page

4. **Check the Node-Auth console** - you'll see:
   ```
   📧 Email would be sent (dev mode):
   To: your@email.com
   Subject: Password Reset Request - CollabIT
   Content: [HTML email with reset link]
   ```

5. **Copy the reset link** from the console output (look for a URL like `http://localhost:5173/reset-password?token=...`)

6. **Paste the link** in your browser

7. **Enter your new password** (at least 6 characters)

8. **Login** with your new password!

## API Testing with curl

```bash
# 1. Request password reset
curl -X POST http://localhost:3050/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"your@email.com\"}"

# Response will include the reset token in development mode
# Copy the resetToken value from the response

# 2. Reset password
curl -X POST http://localhost:3050/auth/reset-password \
  -H "Content-Type: application/json" \
  -d "{\"token\": \"PASTE_TOKEN_HERE\", \"newPassword\": \"newPassword123\"}"
```

## Frontend Routes

- `/login` - Login page (with forgot password link)
- `/forgot-password` - Request password reset
- `/reset-password?token=XXX` - Reset password with token

## Environment Setup for Production

When ready for production, add these to your `.env` file in `Backend/Node-Auth`:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_FROM="CollabIT Support" <noreply@collabit.com>

# Frontend URL
FRONTEND_URL=https://your-production-domain.com

# Environment
NODE_ENV=production
```

### Gmail Setup (if using Gmail)
1. Enable 2-factor authentication on your Google account
2. Generate an "App Password" for nodemailer
3. Use the app password in `EMAIL_PASS`

## Security Features

✅ Tokens are hashed before storage (SHA-256)
✅ Tokens expire after 1 hour
✅ Email enumeration prevention
✅ One-time use tokens
✅ Minimum password length validation
✅ Password strength indicator on frontend

## Troubleshooting

**Issue**: Can't see reset email
- **Solution**: Check the Node-Auth console logs. In dev mode, emails are logged there.

**Issue**: Token expired error
- **Solution**: Tokens expire after 1 hour. Request a new reset link.

**Issue**: Reset link doesn't work
- **Solution**: Make sure you copied the entire token from the URL parameter.

## Files Modified/Created

**Backend (`Backend/Node-Auth/`):**
- `controller/auth.controller.js` - Added forgotPassword & resetPassword
- `router/authRoute.router.js` - Added new routes
- `services/email.service.js` - NEW
- `db/migrate-password-reset.js` - NEW

**Frontend (`collab-it/src/`):**
- `pages/ForgotPassword.jsx` - NEW
- `pages/ResetPassword.jsx` - NEW
- `pages/Login.jsx` - Added forgot password link
- `services/authService.js` - Added password reset methods
- `components/Main.jsx` - Added routes

## Next Steps

1. ✅ Test the forgot password flow
2. ⏳ Configure production email service
3. ⏳ Add rate limiting (optional)
4. ⏳ Customize email templates
5. ⏳ Set up monitoring for failed emails

## Documentation

For detailed documentation, see `FORGOT_PASSWORD_README.md`

---

**Ready to test!** 🚀

Start by going to http://localhost:5173/login and clicking the "Forgot?" link!
