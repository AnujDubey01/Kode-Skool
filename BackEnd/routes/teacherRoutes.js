const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
    getTeacherDashboard,
    getStudentsProgress,
    getAssessmentOverview
} = require("../controllers/teacherController");

router.use(authMiddleware);

router.get("/dashboard", getTeacherDashboard);
router.get("/students", getStudentsProgress);
router.get("/assessments", getAssessmentOverview);

module.exports = router;
