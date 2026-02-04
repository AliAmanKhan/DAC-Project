const controller = require("../controller/auth.controller");
const { verifyToken } = require("../middleware/jwtAuth");
const express = require("express");
const router = express.Router();

router.post("/signup", controller.signup);
router.post("/login", controller.login);
router.post("/forgot-password", controller.forgotPassword);
router.post("/reset-password", controller.resetPassword);

module.exports = router;