
const groq = require("../config/groq");

const generateAIResponse = async (userMessage) => {
    const completion = await groq.chat.completions.create({
        // Use the same model that worked in your connection test
        model: "openai/gpt-oss-20b",

        messages: [
            {
                role: "system",
                content: `
                    You are Kode Skool's AI Programming Tutor.

                    Your job is to help students learn programming.
                    Explain concepts in simple language.
                    Provide practical examples.
                    Help students understand errors and debug code.
                    Keep answers structured and beginner-friendly.
                    Encourage students to understand the logic.
                `
            },
            {
                role: "user",
                content: userMessage
            }
        ]
    });

    return completion.choices[0].message.content;
};

module.exports = { generateAIResponse };
