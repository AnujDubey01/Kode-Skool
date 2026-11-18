const User = require('../models/User');
const Course = require('../models/Course');
const Rating = require('../models/CourseRating');
const CourseEnroll = require('../models/CourseEnroll');
const CourseStruct = require('../models/CourseStruct');

const addCourse = async (req, res) => {
    try {
        const { course_name, faculty_name, price, duration, description } = req.body;

        const newCourse = new Course({
            Course_Name: course_name,
            Faculty_Name: faculty_name,
            Price: price,
            Duration: duration,
            Description: description,
        });

        await newCourse.save();
        return res.status(200).send({
            success: true,
            msg: 'Course added successfully'
        });
    } catch (error) {
        return res.status(500).send({ success: false, err: error.message });
    }
};

const addCourseStruct = async (req, res) => {
    try {
        const { course_id, unit_list } = req.body;

        let courseStruct = await CourseStruct.findOne({ Course_ID: course_id });

        if (!courseStruct) {
            courseStruct = new CourseStruct({
                Course_ID: course_id,
                Unit_List: unit_list
            });
        } else {
            courseStruct.Unit_List = unit_list;
        }

        await courseStruct.save();
        return res.status(200).send({
            success: true,
            msg: 'Course structure saved successfully'
        });
    } catch (error) {
        return res.status(500).send({ success: false, err: error.message });
    }
};

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        return res.status(200).json(courses);
    } catch (error) {
        return res.status(500).send({ err: error.message });
    }
};

const getCourse = async (req, res) => {
    try {
        const { course_id } = req.query;

        if (!course_id) {
            const courses = await Course.find();
            return res.status(200).json(courses);
        }

        const course = await Course.findById(course_id);
        if (course) {
            return res.status(200).json(course);
        } else {
            return res.status(400).send({ msg: "Unable to fetch course." });
        }
    } catch (error) {
        return res.status(500).send({ err: error.message });
    }
};

const getCourseStruct = async (req, res) => {
    try {
        const { course_id } = req.query;

        const structure = await CourseStruct.findOne({ Course_ID: course_id });
        if (structure) {
            return res.status(200).json(structure);
        } else {
            return res.status(400).send({ msg: "Enable fetch course structure." });
        }
    } catch (error) {
        return res.status(500).send({ err: error.message });
    }
};

const getCourseTopic = async (req, res) => {
    try {
        const { topic_id } = req.query;

        const course = await CourseStruct.findOne(
            { 'Unit_List.Topic_List._id': topic_id }
        );

        if (course && course.Unit_List.length > 0) {
            let topic = null;
            for (const i in course.Unit_List) {
                topic = course.Unit_List[i].Topic_List.find(doc => doc._id.equals(topic_id));
                if (topic) {
                    topic = topic.toJSON();
                    topic.Course_ID = course.Course_ID;
                    break;
                }
            }
            return res.status(200).json(topic);
        } else {
            return res.status(400).send({ msg: "Enable find topic details." });
        }
    } catch (error) {
        return res.status(500).send({ err: error.message });
    }
};

const rateCourse = async (req, res) => {
    const user_id = req.user.id;
    try {
        const user = await User.findById(user_id).select("-Password");
        if (!user) {
            return res.status(400).send({ msg: "User not logged in properly." });
        }

        const { course_id, rating, feedback } = req.body;

        if (!user_id || !course_id || rating === undefined) {
            return res.status(400).json({ success: false, error: 'User_ID, Course_ID, and Rating are required.' });
        }

        const rateExists = await Rating.findOne({ User_ID: user_id, Course_ID: course_id });
        if (rateExists) {
            return res.status(400).json({ success: false, msg: "Already rated by you!" });
        }

        const newRating = new Rating({
            User_ID: user_id,
            Course_ID: course_id,
            Rating: rating,
            Feedback: feedback
        });

        const savedRating = await newRating.save();
        if (savedRating) {
            return res.status(200).json({ success: true, msg: 'Rating saved successfully.' });
        } else {
            return res.status(200).json({ success: false, msg: 'Unable to add rating.' });
        }
    } catch (error) {
        return res.status(500).send({ success: false, err: error.message, msg: "Internal server error!" });
    }
};

const enrollCourse = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId).select("-Password");
        if (!user) {
            return res.status(400).send({ msg: "User not logged in properly." });
        }

        const course_id = req.body.course_id;
        const enrollExits = await CourseEnroll.findOne({ Std_ID: userId, Course_ID: course_id });
        if (enrollExits) {
            return res.status(400).json({ success: false, msg: "Course enrolled already." });
        }

        const newEnroll = new CourseEnroll({
            Std_ID: userId,
            Course_ID: course_id,
            Status: []
        });

        await newEnroll.save();
        return res.status(200).json({ success: true, msg: "Course Enrolled Successfully." });
    } catch (error) {
        return res.status(500).send({ success: false, err: error.message });
    }
};

const getMyCourses = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId).select("-Password");
        if (!user) {
            return res.status(400).send({ msg: "User not logged in properly." });
        }

        const userEnrolls = await CourseEnroll.find({ Std_ID: userId });
        return res.status(200).json(userEnrolls);
    } catch (error) {
        return res.status(500).send({ success: false, err: error.message });
    }
};

const updateCourseStatus = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId).select("-Password");
        if (!user) {
            return res.status(400).send({ msg: "User not logged in properly." });
        }

        const { course_id, topic_id } = req.body;
        const enrollExits = await CourseEnroll.findOne({ Std_ID: userId, Course_ID: course_id });
        if (!enrollExits) {
            return res.status(400).json({ success: false, msg: "Course not enrolled." });
        }

        const course = await CourseStruct.findOne({ Course_ID: course_id });
        if (!course) {
            return res.status(400).send({ success: false, msg: 'Course structure not found.' });
        }

        let topic_name = null;
        for (const unit of course.Unit_List) {
            for (const topic of unit.Topic_List) {
                if (topic._id.toString() === topic_id) {
                    topic_name = topic.Topic_Name;
                }
            }
        }

        if (topic_name) {
            if (!enrollExits.Status.includes(topic_id)) {
                enrollExits.Status.push(topic_id);
                await enrollExits.save();
                return res.status(200).send({
                    success: true,
                    msg: `Topic: ${topic_name} is Completed`
                });
            } else {
                return res.status(200).send({
                    success: false,
                    msg: `Topic: ${topic_name} is Completed`
                });
            }
        } else {
            return res.status(400).send({
                success: false,
                msg: 'Topic does not exists in main course.'
            });
        }
    } catch (error) {
        return res.status(500).send({ success: false, err: error.message });
    }
};

module.exports = {
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
};
