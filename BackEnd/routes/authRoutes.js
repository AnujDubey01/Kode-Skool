const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { registerStudent, loginUser } = require("../controllers/authController");
const { authLimiter } = require("../middleware/rateLimiter");

router.post('/register/student', authLimiter, [
    body("email", "Enter a valid Email").isEmail(),
    body("password")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
        .custom(value => {
            if (!/[A-Z]/.test(value)) {
                throw new Error('Password must contain at least one uppercase letter');
            }
            if (!/[0-9]/.test(value)) {
                throw new Error('Password must contain at least one number');
            }
            if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                throw new Error('Password must contain at least one special character');
            }
            return true;
        }),
], registerStudent);

router.post("/login", authLimiter, [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists()
], loginUser);

module.exports = router;
