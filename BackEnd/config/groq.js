const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const GroqSDK = require("groq-sdk");
const Groq = GroqSDK.default || GroqSDK;

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

module.exports = groq;