
require("dotenv").config();

async function testGroq() {
    try {
        // Dynamically load Groq SDK (works from CommonJS)
        const { default: Groq } = await import("groq-sdk");

        // Initialize Groq client
        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });

        console.log("Connecting to Groq...");

        // Send a test message
        const response = await groq.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages: [
                {
                    role: "user",
                    content: "Explain what JavaScript is in simple words.",
                },
            ],
        });

        // Display AI response
        console.log("\nAI Response:");
        console.log(response.choices[0].message.content);

    } catch (error) {
        console.error("\nGroq API Error:", error.message);
    }
}

testGroq();
