
const { generateAIResponse } = require("../services/ai.service");

const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;

        // Validate incoming message
        if (!message || typeof message !== "string" || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid message."
            });
        }

        // Generate AI response
        const aiResponse = await generateAIResponse(message.trim());


        // Send response to frontend
        return res.status(200).json({
            success: true,
            message: "AI response generated successfully",
            data: {
                userMessage: message,
                aiResponse: aiResponse
            }
        });

    } catch (error) {
        console.error("Chat Controller Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to generate AI response."
        });
    }
};

module.exports = { sendMessage };
