const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.token;
    // const t = JSON.stringify(token);
    if (!token) {
      return res.status(404).json({
        success: false,
        message: "token not found, login again",
      });
    }
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return next(
          res.json({ success: false, message: "Please Login First" })
        );
      } else {
        req.user = user;
        next();
      }
    });
  } catch (error) {
    console.error(error);
  }
};

exports.module = verifyToken;
