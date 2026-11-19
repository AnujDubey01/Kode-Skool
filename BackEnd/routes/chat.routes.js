
const express = require("express");

const router = express.Router();

const { sendMessage } = require("../controllers/chat.controller");
const { chatLimiter } = require("../middleware/rateLimiter");

// POST /message or POST /
router.post("/message", chatLimiter, sendMessage);
router.post("/", chatLimiter, sendMessage);

module.exports = router;
