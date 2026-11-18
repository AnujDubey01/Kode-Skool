const bcrypt = require("bcrypt");
const User = require("../models/User");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const School = require("../models/School");
const Course = require("../models/Course");
const CourseEnroll = require("../models/CourseEnroll");
const Result = require("../models/Result");

// 1. Consolidated Admin Dashboard Stats
const getAdminStats = async (req, res) => {
    try {
        const [
            totalStudents,
            totalTeachers,
            totalSchools,
            totalCourses,
            totalEnrollments,
            totalResults
        ] = await Promise.all([
            User.countDocuments({ User_Type: 'Student' }),
            User.countDocuments({ User_Type: 'Faculty' }),
            School.countDocuments(),
            Course.countDocuments(),
            CourseEnroll.countDocuments(),
            Result.countDocuments()
        ]);

        const passCount = await Result.countDocuments({ Score: { $gte: 40 } });
        const passPercentage = totalResults > 0 ? Math.round((passCount / totalResults) * 100) : 0;

        return res.status(200).json({
            success: true,
            stats: {
                totalStudents,
                totalTeachers,
                totalSchools,
                totalCourses,
                totalEnrollments,
                totalResults,
                passPercentage,
                totalCertifications: passCount
            }
        });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err.message });
    }
};

// 2. School Setup (Get & Update)
const getSchoolDetails = async (req, res) => {
    try {
        let school = await School.findOne();
        if (!school) {
            school = new School({
                name: 'Kode-Skool Academy',
                code: 'KODE-01',
                board: 'CBSE',
                classes: ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12']
            });
            await school.save();
        }
        return res.status(200).json({ success: true, school });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err.message });
    }
};

const updateSchoolDetails = async (req, res) => {
    try {
        const { name, code, board, email, phone, address, academicYear, classes } = req.body;
        let school = await School.findOne();

        const schoolData = {
            name: name || 'Kode-Skool Academy',
            code,
            board: board || 'CBSE',
            email,
            phone,
            address,
            academicYear: academicYear || '2024-2025',
            classes: Array.isArray(classes) ? classes : ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10']
        };

        if (school) {
            school = await School.findByIdAndUpdate(school._id, { $set: schoolData }, { new: true });
        } else {
            school = new School(schoolData);
            await school.save();
        }

        return res.status(200).json({ success: true, msg: "School details saved.", school });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err.message });
    }
};

// 3. User Management (List Users)
const getUsersList = async (req, res) => {
    try {
        const { role, search } = req.query;
        const filter = {};
        if (role && role !== 'All') {
            filter.User_Type = role;
        }

        let users = await User.find(filter).select('-Password').sort({ createdAt: -1 });

        // Enrich with Student or Teacher profile data
        const enrichedUsers = await Promise.all(users.map(async (u) => {
            let profile = null;
            if (u.User_Type === 'Student' && u.User_Data) {
                profile = await Student.findById(u.User_Data).select('Name Email Phone Education ClassSection Address');
            } else if (u.User_Type === 'Faculty' && u.User_Data) {
                profile = await Teacher.findById(u.User_Data).select('Name Email Phone Department AssignedClasses');
            }

            return {
                _id: u._id,
                email: u.Email,
                role: u.User_Type,
                createdAt: u.createdAt,
                name: profile?.Name || u.Email.split('@')[0],
                phone: profile?.Phone || '',
                classSection: profile?.ClassSection || profile?.Education?.class_year || '',
                department: profile?.Department || ''
            };
        }));

        let result = enrichedUsers;
        if (search) {
            const s = search.toLowerCase();
            result = enrichedUsers.filter(u =>
                u.name.toLowerCase().includes(s) ||
                u.email.toLowerCase().includes(s) ||
                u.role.toLowerCase().includes(s)
            );
        }

        return res.status(200).json({ success: true, count: result.length, users: result });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err.message });
    }
};

// 4. Create Individual User (Student / Teacher)
const createSingleUser = async (req, res) => {
    try {
        const { name, email, password, role, classSection, department, phone } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({ success: false, msg: "Name, email, password, and role are required." });
        }

        const existing = await User.findOne({ Email: email.toLowerCase() });
        if (existing) {
            return res.status(400).json({ success: false, msg: "A user with this email already exists." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let profileId = null;
        if (role === 'Student') {
            const student = new Student({
                Email: email.toLowerCase(),
                Name: name.trim(),
                Phone: phone || undefined,
                ClassSection: classSection || '',
                Education: { class_year: parseInt(classSection) || undefined }
            });
            await student.save();
            profileId = student._id;
        } else if (role === 'Faculty' || role === 'Teacher') {
            const teacher = new Teacher({
                Email: email.toLowerCase(),
                Name: name.trim(),
                Phone: phone || undefined,
                Department: department || 'Computer Science',
                AssignedClasses: classSection ? [classSection] : []
            });
            await teacher.save();
            profileId = teacher._id;
        }

        const newUser = new User({
            Email: email.toLowerCase(),
            Password: hashedPassword,
            User_Type: role === 'Teacher' ? 'Faculty' : role,
            User_Data: profileId
        });
        await newUser.save();

        return res.status(201).json({
            success: true,
            msg: `${role} account created successfully.`,
            user: { _id: newUser._id, email: newUser.Email, role: newUser.User_Type, name }
        });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err.message });
    }
};

// 5. Bulk User Onboarding (CSV Import)
const bulkImportUsers = async (req, res) => {
    try {
        const { users } = req.body;
        if (!Array.isArray(users) || users.length === 0) {
            return res.status(400).json({ success: false, msg: "Please provide an array of users to import." });
        }

        const results = {
            successCount: 0,
            failedCount: 0,
            errors: []
        };

        const defaultSalt = await bcrypt.genSalt(10);

        for (const item of users) {
            try {
                const email = (item.email || item.Email || '').trim().toLowerCase();
                const name = (item.name || item.Name || '').trim();
                const role = (item.role || item.Role || 'Student').trim();
                const rawPassword = item.password || item.Password || 'KodeSkool@2024';
                const classSection = (item.class || item.Class || item.classSection || '').trim();
                const phone = (item.phone || item.Phone || '').trim();

                if (!email || !name) {
                    results.failedCount++;
                    results.errors.push(`Row missing email or name: ${JSON.stringify(item)}`);
                    continue;
                }

                const existing = await User.findOne({ Email: email });
                if (existing) {
                    results.failedCount++;
                    results.errors.push(`User already exists: ${email}`);
                    continue;
                }

                const hashedPassword = await bcrypt.hash(rawPassword, defaultSalt);
                let profileId = null;

                if (role.toLowerCase() === 'faculty' || role.toLowerCase() === 'teacher') {
                    const teacher = new Teacher({
                        Email: email,
                        Name: name,
                        Phone: phone || undefined,
                        AssignedClasses: classSection ? [classSection] : []
                    });
                    await teacher.save();
                    profileId = teacher._id;
                } else {
                    const student = new Student({
                        Email: email,
                        Name: name,
                        Phone: phone || undefined,
                        ClassSection: classSection
                    });
                    await student.save();
                    profileId = student._id;
                }

                const newUser = new User({
                    Email: email,
                    Password: hashedPassword,
                    User_Type: (role.toLowerCase() === 'teacher' || role.toLowerCase() === 'faculty') ? 'Faculty' : 'Student',
                    User_Data: profileId
                });
                await newUser.save();
                results.successCount++;
            } catch (err) {
                results.failedCount++;
                results.errors.push(`Error on ${item.email || 'row'}: ${err.message}`);
            }
        }

        return res.status(200).json({
            success: true,
            msg: `Import complete: ${results.successCount} users created, ${results.failedCount} skipped.`,
            results
        });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err.message });
    }
};

// 6. Course Assignment
const assignCourse = async (req, res) => {
    try {
        const { courseId, classSection, userEmail } = req.body;
        if (!courseId) {
            return res.status(400).json({ success: false, msg: "Course ID is required." });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, msg: "Course not found." });
        }

        let targetUsers = [];
        if (userEmail) {
            const user = await User.findOne({ Email: userEmail.toLowerCase() });
            if (user) targetUsers.push(user);
        } else if (classSection) {
            const students = await Student.find({ ClassSection: classSection });
            const studentIds = students.map(s => s._id);
            targetUsers = await User.find({ User_Data: { $in: studentIds } });
        } else {
            // Assign to all students
            targetUsers = await User.find({ User_Type: 'Student' });
        }

        let enrolledCount = 0;
        for (const u of targetUsers) {
            const stdId = u.User_Data || u._id;
            const exists = await CourseEnroll.findOne({ Std_ID: stdId, Course_ID: courseId });
            if (!exists) {
                const enrollment = new CourseEnroll({
                    Std_ID: stdId,
                    Course_ID: courseId,
                    Status: []
                });
                await enrollment.save();
                enrolledCount++;
            }
        }

        return res.status(200).json({
            success: true,
            msg: `Course "${course.Course_Name}" assigned. ${enrolledCount} new student(s) enrolled.`
        });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err.message });
    }
};

// 7. Academic & Certification Reports
const getAcademicReports = async (req, res) => {
    try {
        const enrollments = await CourseEnroll.find()
            .populate('Std_ID', 'Name Email ClassSection')
            .populate('Course_ID', 'Course_Name Course_Rating')
            .sort({ createdAt: -1 });

        const results = await Result.find()
            .populate('Std_ID', 'Name Email')
            .populate('Test_ID')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            enrollments,
            results
        });
    } catch (err) {
        return res.status(500).json({ success: false, msg: err.message });
    }
};

module.exports = {
    getAdminStats,
    getSchoolDetails,
    updateSchoolDetails,
    getUsersList,
    createSingleUser,
    bulkImportUsers,
    assignCourse,
    getAcademicReports
};
