const connection = require("../config/dbconfig.config");
const bcrypt = require("bcrypt");
const SECRET_KEY = process.env.SECRET_KEY || "jwt-secret";
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("../services/email.service");

// Helper to run queries with promises
const query = (sql, params) => connection.promise().query(sql, params);

exports.signup = async (req, res) => {
  try {
    // Frontend sends a form object with many fields; we only need email and password here
    const {
      fullName,
      email,
      password,
      headline,
      bio,
      skills,
      interests,
      experience,
      avatar,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Ensure username and full name exist. Derive defaults from email if missing.
    const usernameFromEmail = email.split("@")[0];
    const usernameToUse = req.body.username || usernameFromEmail;
    const fullNameToUse = fullName || usernameFromEmail;

    // Check if user exists by email or username
    const [existing] = await query(
      "SELECT user_id FROM user_profiles WHERE email = ? OR username = ?",
      [email, usernameToUse]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    // Insert user. Include required columns: full_name, username, email, password, dob
    const [result] = await query(
      "INSERT INTO user_profiles (full_name, username, email, password, dob) VALUES (?, ?, ?, ?, ?)",
      [fullNameToUse, usernameToUse, email, hashed, null]
    );

    const userId = result.insertId;
    const token = jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: "7d" });

    // Note: additional profile fields are stored partially here (full_name, username). User service can add more later.

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: userId, username: usernameToUse, fullName: fullNameToUse },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const [rows] = await query("SELECT * FROM user_profiles WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.user_id }, SECRET_KEY, { expiresIn: "7d" });

    return res.status(200).json({
      message: "User logged in successfully",
      token,
      user: { id: user.user_id, username: user.username || user.email },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.verifyToken = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return res.status(200).json({ valid: true, decoded });
  } catch (err) {
    return res.status(401).json({ valid: false, message: "Invalid token" });
  }
};

exports.logout = (req, res) => {
  // For stateless JWT, logout is handled on client by removing token.
  return res.status(200).json({ message: "Logged out" });
};

// Forgot Password - Send reset email
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if user exists
    const [rows] = await query("SELECT user_id, full_name, email FROM user_profiles WHERE email = ?", [email]);
    
    if (rows.length === 0) {
      // For security, don't reveal if email exists or not
      return res.status(200).json({ 
        message: "If an account with that email exists, a password reset link has been sent." 
      });
    }

    const user = rows[0];

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // Token expires in 1 hour
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Store token in database (you need to create this table first)
    // We'll store it in the user_profiles table with new columns
    await query(
      "UPDATE user_profiles SET reset_token = ?, reset_token_expires = ? WHERE user_id = ?",
      [hashedToken, expiresAt, user.user_id]
    );

    // Send email with reset token
    try {
      await sendPasswordResetEmail(user.email, resetToken, user.full_name);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue anyway - token is saved
    }

    return res.status(200).json({ 
      message: "If an account with that email exists, a password reset link has been sent.",
      // In development, also return the token for testing
      ...(process.env.NODE_ENV === 'development' && { resetToken })
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Reset Password - Validate token and update password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token
    const [rows] = await query(
      "SELECT user_id, full_name FROM user_profiles WHERE reset_token = ? AND reset_token_expires > NOW()",
      [hashedToken]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    const user = rows[0];

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await query(
      "UPDATE user_profiles SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE user_id = ?",
      [hashedPassword, user.user_id]
    );

    return res.status(200).json({ 
      message: "Password has been reset successfully. You can now login with your new password." 
    });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

