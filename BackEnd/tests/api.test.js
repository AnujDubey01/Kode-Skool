const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const Course = require('../models/Course');

jest.setTimeout(60000);

let mongoServer;
let authToken = '';
let courseId = '';
let topicId = '';

beforeAll(async () => {
    process.env.JWT_SECRET = 'test_jwt_secret_key';
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
}, 60000);

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('KodeSkool Backend End-to-End API Test Suite', () => {

    test('1. Root Health Check GET /', async () => {
        const res = await request(app).get('/');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('success');
    });

    test('2. Auth - Register Student validation failure (weak password)', async () => {
        const res = await request(app)
            .post('/api/register/student')
            .send({
                email: 'teststudent@example.com',
                password: 'weak',
                name: 'Test Student'
            });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
    });

    test('3. Auth - Register Student success (password meets uppercase, number, symbol)', async () => {
        const res = await request(app)
            .post('/api/register/student')
            .send({
                email: 'teststudent@example.com',
                password: 'Password123!',
                name: 'Test Student'
            });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.auth_token).toBeDefined();
        authToken = res.body.auth_token;
    });

    test('4. Auth - Register duplicate email failure', async () => {
        const res = await request(app)
            .post('/api/register/student')
            .send({
                email: 'teststudent@example.com',
                password: 'Password123!',
                name: 'Test Student'
            });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.msg).toContain('already exists');
    });

    test('5. Auth - Login User wrong password', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({
                email: 'teststudent@example.com',
                password: 'WrongPassword123!'
            });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe('Wrong Password!');
    });

    test('6. Auth - Login User success', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({
                email: 'teststudent@example.com',
                password: 'Password123!'
            });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.auth_token).toBeDefined();
    });

    test('7. Profile - GET /api/profile/student without auth-token fails', async () => {
        const res = await request(app).get('/api/profile/student');
        expect(res.status).toBe(400);
        expect(res.body.msg).toBe('User not logged in properly!');
    });

    test('8. Profile - GET /api/profile/student with auth-token succeeds', async () => {
        const res = await request(app)
            .get('/api/profile/student')
            .set('auth-token', authToken);
        expect(res.status).toBe(200);
        expect(res.body.Email).toBe('teststudent@example.com');
        expect(res.body.Name).toBe('Test Student');
    });

    test('9. Profile - POST /api/profile/student/update updates details', async () => {
        const res = await request(app)
            .post('/api/profile/student/update')
            .set('auth-token', authToken)
            .send({
                name: 'Updated Student Name',
                phone: '9876543210',
                street: '123 Tech Park',
                city: 'Bengaluru',
                state: 'Karnataka',
                country: 'India',
                pin: '560001',
                university_type: 'School',
                school_clg_name: 'National High School',
                class_year: 10,
                dob: '2008-05-15',
                hacker_rank: 'https://hackerrank.com/test',
                linkedin: 'https://linkedin.com/in/test',
                codechef: 'https://codechef.com/test',
                instagram: 'https://instagram.com/test'
            });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.msg).toBe('Updated details successfully.');

        // Verify update persisted
        const getRes = await request(app)
            .get('/api/profile/student')
            .set('auth-token', authToken);
        expect(getRes.body.Name).toBe('Updated Student Name');
        expect(getRes.body.Phone).toBe('9876543210');
        expect(getRes.body.Address.city).toBe('Bengaluru');
        expect(getRes.body.Education.school_clg_name).toBe('National High School');
    });

    test('10. Course - POST /api/add-course creates course', async () => {
        const res = await request(app)
            .post('/api/add-course')
            .send({
                course_name: 'Complete C Programming',
                faculty_name: 'Dr. Jane Smith',
                price: 0,
                duration: 20,
                description: 'Comprehensive C language course from basics to pointers'
            });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);

        const course = await Course.findOne({ Course_Name: 'Complete C Programming' });
        expect(course).not.toBeNull();
        courseId = course._id.toString();
    });

    test('11. Course - GET /api/get-course fetches course', async () => {
        const res = await request(app).get(`/api/get-course?course_id=${courseId}`);
        expect(res.status).toBe(200);
        expect(res.body.Course_Name).toBe('Complete C Programming');
        expect(res.body.Faculty_Name).toBe('Dr. Jane Smith');
    });

    test('12. Course - POST /api/add-course-struct creates syllabus structure', async () => {
        const res = await request(app)
            .post('/api/add-course-struct')
            .send({
                course_id: courseId,
                unit_list: [
                    {
                        Unit_No: 1,
                        Unit_Name: 'Introduction to C',
                        Topic_List: [
                            {
                                Topic_Name: 'Variables and Data Types',
                                Video_Link: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                                Notes_Link: 'https://example.com/notes1.pdf'
                            }
                        ]
                    }
                ]
            });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    test('13. Course - GET /api/get-course-struct and topic', async () => {
        const res = await request(app).get(`/api/get-course-struct?course_id=${courseId}`);
        expect(res.status).toBe(200);
        expect(res.body.Unit_List.length).toBe(1);
        expect(res.body.Unit_List[0].Topic_List.length).toBe(1);

        topicId = res.body.Unit_List[0].Topic_List[0]._id.toString();

        const topicRes = await request(app).get(`/api/get-course-topic?topic_id=${topicId}`);
        expect(topicRes.status).toBe(200);
        expect(topicRes.body.Topic_Name).toBe('Variables and Data Types');
        expect(topicRes.body.Course_ID).toBe(courseId);
    });

    test('14. Course - POST /api/enroll-course enrolls student in course', async () => {
        const res = await request(app)
            .post('/api/enroll-course')
            .set('auth-token', authToken)
            .send({ course_id: courseId });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.msg).toBe('Course Enrolled Successfully.');
    });

    test('15. Course - POST /api/enroll-course prevents duplicate enrollment', async () => {
        const res = await request(app)
            .post('/api/enroll-course')
            .set('auth-token', authToken)
            .send({ course_id: courseId });
        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe('Course enrolled already.');
    });

    test('16. Course - GET /api/my-courses lists user enrolled courses', async () => {
        const res = await request(app)
            .get('/api/my-courses')
            .set('auth-token', authToken);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);
        expect(res.body[0].Course_ID).toBe(courseId);
    });

    test('17. Course - POST /api/update-course-status marks topic complete', async () => {
        const res = await request(app)
            .post('/api/update-course-status')
            .set('auth-token', authToken)
            .send({
                course_id: courseId,
                topic_id: topicId
            });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.msg).toContain('Completed');

        // Verify status in my-courses
        const myRes = await request(app)
            .get('/api/my-courses')
            .set('auth-token', authToken);
        expect(myRes.body[0].Status).toContain(topicId);
    });

    test('18. Course - POST /api/rate-course saves rating & updates course average rating', async () => {
        const res = await request(app)
            .post('/api/rate-course')
            .set('auth-token', authToken)
            .send({
                course_id: courseId,
                rating: 5,
                feedback: 'Outstanding course, very engaging!'
            });
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);

        // Verify Course model auto-updates average Rating via post-hook
        const updatedCourse = await Course.findById(courseId);
        expect(updatedCourse.Rating).toBe(5);
    });

    test('19. Admin - Non-admin user gets 403 Forbidden accessing /api/admin/stats', async () => {
        const res = await request(app)
            .get('/api/admin/stats')
            .set('auth-token', authToken); // student token
        expect(res.status).toBe(403);
        expect(res.body.success).toBe(false);
    });

    test('20. Admin - Admin user successfully accesses stats and school endpoints', async () => {
        const User = require('../models/User');
        const bcrypt = require('bcrypt');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('AdminPass@123', salt);

        const adminUser = new User({
            Email: 'admin@kodeskool.com',
            Password: hashedPassword,
            User_Type: 'Admin'
        });
        await adminUser.save();

        // Real login test for Admin
        const loginRes = await request(app)
            .post('/api/login')
            .send({
                email: 'admin@kodeskool.com',
                password: 'AdminPass@123'
            });
        expect(loginRes.status).toBe(200);
        expect(loginRes.body.userType).toBe('Admin');
        const adminToken = loginRes.body.auth_token;

        const statsRes = await request(app)
            .get('/api/admin/stats')
            .set('auth-token', adminToken);
        expect(statsRes.status).toBe(200);
        expect(statsRes.body.success).toBe(true);
        expect(statsRes.body.stats.totalStudents).toBeGreaterThanOrEqual(1);

        const schoolRes = await request(app)
            .get('/api/admin/school')
            .set('auth-token', adminToken);
        expect(schoolRes.status).toBe(200);
        expect(schoolRes.body.success).toBe(true);
        expect(schoolRes.body.school.name).toBeDefined();
    });

    test('21. Teacher - Teacher accesses /api/teacher/dashboard & students list', async () => {
        const User = require('../models/User');
        const Teacher = require('../models/Teacher');
        const bcrypt = require('bcrypt');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('TeacherPass@123', salt);

        const teacherDoc = new Teacher({
            Email: 'teacher@kodeskool.com',
            Name: 'Prof. Sharma',
            Department: 'Computer Science',
            AssignedClasses: ['Class 9', 'Class 10']
        });
        await teacherDoc.save();

        const teacherUser = new User({
            Email: 'teacher@kodeskool.com',
            Password: hashedPassword,
            User_Type: 'Faculty',
            User_Data: teacherDoc._id
        });
        await teacherUser.save();

        const loginRes = await request(app)
            .post('/api/login')
            .send({
                email: 'teacher@kodeskool.com',
                password: 'TeacherPass@123'
            });
        expect(loginRes.status).toBe(200);
        expect(loginRes.body.userType).toBe('Faculty');
        const teacherToken = loginRes.body.auth_token;

        const dashRes = await request(app)
            .get('/api/teacher/dashboard')
            .set('auth-token', teacherToken);
        expect(dashRes.status).toBe(200);
        expect(dashRes.body.success).toBe(true);
        expect(dashRes.body.teacher.name).toBe('Prof. Sharma');

        const stdRes = await request(app)
            .get('/api/teacher/students')
            .set('auth-token', teacherToken);
        expect(stdRes.status).toBe(200);
        expect(stdRes.body.success).toBe(true);
        expect(Array.isArray(stdRes.body.students)).toBe(true);
    });
});
