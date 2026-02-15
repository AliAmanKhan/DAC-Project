const nodemailer = require('nodemailer');
require("dotenv").config();
// Create reusable transporter
// For development, using a test account or configure with real SMTP
const createTransporter = () => {
  // For production, use environment variables
//   if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
    //   host: process.env.EMAIL_HOST,
    //   port: process.env.EMAIL_PORT || 587,
    //   secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS,
    //   },
      host: "smtp.gmail.com", // Correct SMTP host for Gmail
      port: 587, // Use 465 for SSL, or 587 for TLS
      secure: false, // Use true for port 465, false for port 587
      auth: {
        user: "aliamankhan96@gmail.com",
        pass: "opux fruf xuli xluz",
      },
    });
//   }
  
  // For development - log to console instead
//   return {
//     sendMail: async (mailOptions) => {
//       console.log('📧 Email would be sent (dev mode):');
//       console.log('To:', mailOptions.to);
//       console.log('Subject:', mailOptions.subject);
//       console.log('Content:', mailOptions.html || mailOptions.text);
//       return { messageId: 'dev-' + Date.now() };
//     }
//   };
};

const sendPasswordResetEmail = async (to, resetToken, fullName) => {
  const transporter = createTransporter();
  
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"CollabIT Support" <noreply@collabit.com>',
    to,
    subject: 'Password Reset Request - CollabIT',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .content {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #3b82f6;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <h2>Password Reset Request</h2>
            <p>Hi ${fullName || 'there'},</p>
            <p>We received a request to reset your password for your CollabIT account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #3b82f6;">${resetUrl}</p>
            <p><strong>This link will expire in 1 hour.</strong></p>
            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
            <div class="footer">
              <p>Best regards,<br>The CollabIT Team</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Hi ${fullName || 'there'},
      
      We received a request to reset your password for your CollabIT account.
      
      Click the link below to reset your password:
      ${resetUrl}
      
      This link will expire in 1 hour.
      
      If you didn't request a password reset, please ignore this email.
      
      Best regards,
      The CollabIT Team
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

module.exports = {
  sendPasswordResetEmail
};
