const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { updateStudentProfile, getStudentProfile } = require("../controllers/userController");

router.post('/profile/student/update', authMiddleware, updateStudentProfile);
router.get('/profile/student', authMiddleware, getStudentProfile);

module.exports = router;
