const controller = require("../controller/auth.controller");
const { verifyToken } = require("../middleware/jwtAuth");
const express = require("express");
const router = express.Router();

router.post("/signup", controller.signup);
router.post("/login", controller.login);

module.exports = router;