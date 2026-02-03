const jwt = require("jsonwebtoken");

const SECRET_KEY = "jwt-secret";

const verifyToken = (req, res, next) => {
  try {
    console.log(`[Auth Middleware] Invoked for ${req.method} ${req.originalUrl}`);
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log('[Auth Middleware] No Authorization header received');
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1]; // Bearer <token>
    console.log('[Auth Middleware] Extracted token present:', !!token, 'authHeader=', authHeader);
    
    if (!token) {
      console.log('[Auth Middleware] Authorization header present but token missing or malformed');
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        console.log('[Auth Middleware] Token verification failed:', err && err.message);
        return res.status(403).json({ success: false, message: "Invalid or expired token" });
      } else {
        console.log('[Auth Middleware] Token verified, setting req.user:', user);
        req.user = user;
        next();
      }
    });
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(500).json({ success: false, message: "Internal server error during auth" });
  }
};

module.exports = verifyToken;
