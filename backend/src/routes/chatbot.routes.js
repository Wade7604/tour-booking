const express = require("express");
const router = express.Router();
const ChatbotController = require("../controllers/chatbot.controller");
const { authenticateUser } = require("../middlewares/auth.middleware");
const { adminOnly } = require("../middlewares/permission.middleware");

// Public routes
router.post("/chat", ChatbotController.chat);
router.get("/suggestions", ChatbotController.getQuickSuggestions);
router.get("/health", ChatbotController.healthCheck);

// Admin only routes
router.post("/clear-cache", authenticateUser, adminOnly, ChatbotController.clearCache);

module.exports = router;
