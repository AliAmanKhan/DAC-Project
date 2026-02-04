# Forgot Password Feature - Implementation Guide

## Overview
This document describes the complete forgot password functionality implemented for the CollabIT project.

## Architecture

### Backend (Node-Auth Service)

#### Database Schema
Added to `user_profiles` table:
- `reset_token` (VARCHAR(255)) - Stores hashed reset token
- `reset_token_expires` (DATETIME) - Token expiry timestamp
- Index on `reset_token` for faster lookups

#### API Endpoints

**1. Forgot Password**
- **URL**: `POST /auth/forgot-password`
- **Payload**: 
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response**: 
  ```json
  {
    "message": "If an account with that email exists, a password reset link has been sent.",
    "resetToken": "token-here" // Only in development mode
  }
  ```
- **Security**: Returns same message whether email exists or not to prevent email enumeration

**2. Reset Password**
- **URL**: `POST /auth/reset-password`
- **Payload**: 
  ```json
  {
    "token": "reset-token-from-email",
    "newPassword": "newSecurePassword123"
  }
  ```
- **Response**: 
  ```json
  {
    "message": "Password has been reset successfully. You can now login with your new password."
  }
  ```
- **Validation**: 
  - Token must be valid and not expired (1 hour)
  - Password must be at least 6 characters

#### Email Service
- Located: `services/email.service.js`
- Uses **nodemailer** for sending emails
- **Development Mode**: Logs emails to console
- **Production Mode**: Send via SMTP (configure environment variables)

**Environment Variables for Production Email:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM="CollabIT Support" <noreply@collabit.com>
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (React)

#### New Pages

**1. ForgotPassword** (`src/pages/ForgotPassword.jsx`)
- Email input form
- Client-side email validation
- Success state with confirmation message
- Error handling

**2. ResetPassword** (`src/pages/ResetPassword.jsx`)
- Token extraction from URL query params
- New password input with show/hide toggle
- Password strength indicator:
  - Minimum 6 characters
  - Contains number (recommended)
  - Contains special character (recommended)
- Confirm password field with match validation
- Success state with auto-redirect to login (3 seconds)
- Expired token handling with link to request new reset

#### Routes
Added to `src/components/Main.jsx`:
- `/forgot-password` - ForgotPassword page
- `/reset-password` - ResetPassword page

Both routes hide the sidebar and header (same as login/signup)

#### Updated Components
**Login.jsx**: Added "Forgot Password?" link next to password field

#### Services
Updated `src/services/authService.js` with:
- `forgotPassword(email)` - Request password reset
- `resetPassword(token, newPassword)` - Reset password with token

## Security Features

1. **Token Hashing**: Reset tokens are hashed (SHA-256) before storage
2. **Token Expiry**: Tokens expire after 1 hour
3. **Email Enumeration Prevention**: Same response whether email exists or not
4. **Password Strength**: Minimum 6 characters required
5. **One-time Use**: Tokens are cleared after successful password reset
6. **Secure Token Generation**: Uses crypto.randomBytes(32) for unpredictable tokens

## User Flow

### Forgot Password Flow
1. User clicks "Forgot?" link on login page
2. User enters email address
3. System sends reset email (if account exists)
4. User sees confirmation message
5. User checks email for reset link

### Reset Password Flow
1. User clicks reset link from email
2. Link contains token: `http://localhost:5173/reset-password?token=abc123...`
3. User enters new password
4. System validates token and password strength
5. Password is updated
6. User is redirected to login page

## Testing

### Development Testing
In development mode, the reset token is returned in the API response for easy testing:

```bash
# 1. Request password reset
curl -X POST http://localhost:3050/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Response includes token:
# { "message": "...", "resetToken": "abc123..." }

# 2. Reset password using token
curl -X POST http://localhost:3050/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token": "abc123...", "newPassword": "newPassword123"}'
```

### Manual Testing Steps
1. Create a user account
2. Go to `/forgot-password`
3. Enter your email
4. Check console logs for email content (dev mode)
5. Copy the reset link from console
6. Visit the reset link
7. Enter new password
8. Verify you can login with new password

## Database Migration

Run the migration to add required columns:

```bash
cd Backend/Node-Auth
node db/migrate-password-reset.js
```

Or manually execute:
```sql
USE collabit_user_db;

ALTER TABLE user_profiles 
ADD COLUMN reset_token VARCHAR(255) NULL,
ADD COLUMN reset_token_expires DATETIME NULL;

CREATE INDEX idx_reset_token ON user_profiles(reset_token);
```

## File Structure

```
Backend/Node-Auth/
├── controller/auth.controller.js    # Added forgotPassword & resetPassword
├── router/authRoute.router.js       # Added /forgot-password & /reset-password routes
├── services/
│   └── email.service.js             # NEW: Email sending service
└── db/
    ├── migrate-password-reset.js    # NEW: Migration script
    └── migrations/
        └── add_password_reset_columns.sql  # SQL migration

collab-it/src/
├── pages/
│   ├── ForgotPassword.jsx           # NEW: Forgot password page
│   ├── ResetPassword.jsx            # NEW: Reset password page
│   └── Login.jsx                    # Updated: Added forgot password link
├── services/
│   └── authService.js               # Updated: Added password reset methods
└── components/
    └── Main.jsx                     # Updated: Added password reset routes
```

## Production Checklist

Before deploying to production:

1. ✅ Set up SMTP email service (Gmail, SendGrid, etc.)
2. ✅ Configure environment variables for email
3. ✅ Set `NODE_ENV=production` to disable token in response
4. ✅ Update `FRONTEND_URL` to production domain
5. ✅ Test email delivery
6. ✅ Set up email templates with branding
7. ✅ Monitor failed email attempts
8. ✅ Consider rate limiting on forgot-password endpoint

## Customization

### Email Template
Edit `services/email.service.js` to customize:
- Email design/styling
- Sender name and email
- Reset link URL
- Email content

### Token Expiry
Change token expiry time in `controller/auth.controller.js`:
```javascript
// Current: 1 hour
const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

// Example: 30 minutes
const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
```

### Password Requirements
Modify validation in both:
- Backend: `controller/auth.controller.js` (line ~180)
- Frontend: `pages/ResetPassword.jsx` (password strength indicator)

## Troubleshooting

**Issue**: Email not sending
- Check email service credentials
- Verify SMTP settings
- Check console logs for email service errors
- Test with a simple nodemailer test script

**Issue**: Token expired
- Token expires after 1 hour
- User must request a new reset link

**Issue**: Invalid token
- Token might be mistyped
- Token is one-time use only
- Database might have been reset

## Future Enhancements

- [ ] Rate limiting on forgot-password endpoint
- [ ] Email template system with multiple languages
- [ ] SMS-based password reset option
- [ ] 2FA integration
- [ ] Password reset history/audit log
- [ ] Account lockout after multiple failed attempts
- [ ] Custom token expiry per user role

## Support

For issues or questions, contact the development team or refer to the main project documentation.
