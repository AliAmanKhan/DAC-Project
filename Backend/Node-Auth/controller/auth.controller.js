const connection = require("../config/dbconfig.config");
const bcrypt = require("bcrypt");
const SECRET_KEY = process.env.SECRET_KEY || "jwt-secret";
const jwt = require("jsonwebtoken");

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
