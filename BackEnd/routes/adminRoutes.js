const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
    getAdminStats,
    getSchoolDetails,
    updateSchoolDetails,
    getUsersList,
    createSingleUser,
    bulkImportUsers,
    assignCourse,
    getAcademicReports
} = require("../controllers/adminController");

// All admin routes require valid JWT auth + Admin role
router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/stats", getAdminStats);
router.get("/school", getSchoolDetails);
router.post("/school", updateSchoolDetails);
router.get("/users", getUsersList);
router.post("/users/create", createSingleUser);
router.post("/users/bulk-import", bulkImportUsers);
router.post("/courses/assign", assignCourse);
router.get("/reports", getAcademicReports);

module.exports = router;
