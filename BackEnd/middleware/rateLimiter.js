const rateLimit = require("express-rate-limit");

const isTest = process.env.NODE_ENV === 'test';

// Auth Limiter: protects /api/login and /api/register from brute-force & credential stuffing
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: isTest ? 1000 : 30, // 30 requests per 15 min window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        msg: "Too many attempts from this IP. Please try again after 15 minutes."
    }
});

// Chat Limiter: protects /api/chat from high concurrency & abuse
const chatLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: isTest ? 1000 : 30, // 30 messages per minute
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        msg: "Too many chat requests sent. Please wait a moment and try again."
    }
});

module.exports = {
    authLimiter,
    chatLimiter
};
