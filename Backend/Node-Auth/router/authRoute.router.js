const controller = require("../controller/auth.controller");
const { verifyToken } = require("../middleware/jwtAuth");
const express = require("express");
const router = express.Router();

router.post("/signup", verifyToken, controller.signup);

module.export = router;
