const GeminiService = require("../services/gemini.service");

class ChatbotController {
  // Main chat endpoint
  async chat(req, res) {
    try {
      const { message, conversationHistory = [] } = req.body;

      if (!message || typeof message !== "string" || message.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Message is required",
        });
      }

      const result = await GeminiService.chat(message.trim(), conversationHistory);

      return res.status(200).json({
        success: true,
        data: {
          message: result.message,
          suggestions: result.suggestions,
          context: result.context,
        },
      });
    } catch (error) {
      console.error("Chat error:", error);
      
      // Handle specific Gemini errors
      if (error.message?.includes("GEMINI_API_KEY")) {
        return res.status(500).json({
          success: false,
          message: "Chatbot service is not configured. Please contact administrator.",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to process your message. Please try again.",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Get quick suggestions based on preferences
  async getQuickSuggestions(req, res) {
    try {
      const { budget, duration, difficulty, tourType, destination } = req.query;

      const preferences = {};
      if (budget) preferences.budget = parseInt(budget);
      if (duration) preferences.duration = parseInt(duration);
      if (difficulty) preferences.difficulty = difficulty;
      if (tourType) preferences.tourType = tourType;
      if (destination) preferences.destination = destination;

      const result = await GeminiService.getQuickSuggestions(preferences);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Quick suggestions error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to get suggestions",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  // Clear cache (admin only)
  async clearCache(req, res) {
    try {
      GeminiService.clearCache();
      return res.status(200).json({
        success: true,
        message: "Cache cleared successfully",
      });
    } catch (error) {
      console.error("Clear cache error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to clear cache",
      });
    }
  }

  // Health check for chatbot
  async healthCheck(req, res) {
    try {
      return res.status(200).json({
        success: true,
        message: "Chatbot service is running",
        config: {
          geminiConfigured: !!process.env.GEMINI_API_KEY,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Chatbot service check failed",
      });
    }
  }
}

module.exports = new ChatbotController();
