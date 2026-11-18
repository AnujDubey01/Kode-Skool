const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
    addCourse,
    addCourseStruct,
    getCourse,
    getAllCourses,
    getCourseStruct,
    getCourseTopic,
    rateCourse,
    enrollCourse,
    getMyCourses,
    updateCourseStatus
} = require("../controllers/courseController");

router.post('/add-course', addCourse);
router.post('/add-course-struct', addCourseStruct);
router.get('/get-course', getCourse);
router.get('/all-courses', getAllCourses);
router.get('/get-course-struct', getCourseStruct);
router.get('/get-course-topic', getCourseTopic);
router.post('/rate-course', authMiddleware, rateCourse);
router.post('/enroll-course', authMiddleware, enrollCourse);
router.get('/my-courses', authMiddleware, getMyCourses);
router.post('/update-course-status', authMiddleware, updateCourseStatus);

module.exports = router;
