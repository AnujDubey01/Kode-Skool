const express = require("express")
const router = express.Router()

const User = require('../models/User');
const Course = require('../models/Course');
const Rating = require('../models/CourseRating');
const CourseEnroll= require('../models/CourseEnroll');
const CourseStruct = require('../models/CourseStruct');
const fetchUser = require("./middleware/fetchuser");

router.post('/add-course', async (req, res) => {
    try {
        const { course_name, faculty_name, price, duration, description } = req.body;

        // Create a new course object
        const newCourse = new Course({
            Course_Name: course_name,
            Faculty_Name: faculty_name,
            Price: price,
            Duration: duration,
            Description: description,
        });
        // Save the new course to the database
        newCourse.save().then(() => {
            res.status(200).send({
                success: true,
                msg: 'Course added successfully'
            });
        }).catch((err) => {
            res.status(400).send({success: false, msg: 'Error while adding course.', err: err});
        });

    } catch (error) {
        res.status(500).send({ success: false, err: error.message });
    }
});

router.post('/add-course-struct', async (req, res) => {
    try {
        const { course_id, unit_list } = req.body;

        let courseStruct = await CourseStruct.findOne({Course_ID: course_id});

        if(!courseStruct){
            courseStruct = new CourseStruct({
                Course_ID: course_id,
                Unit_List: unit_list
            })
        }else{
            courseStruct.Unit_List = unit_list;
        }


        courseStruct.save().then(() => {
            res.status(200).send({
                success: true,
                msg: 'Course structure saved successfully'
            });
        }).catch((err) => {
            res.status(400).send({success: false, msg: 'Error while adding course.', err: err});
        });

    } catch (error) {     
        res.status(500).send({ success: false, err: error.message });
    }
})


router.get('/get-course', async (req, res) => {
    try {
        const courseId = req.body.course_id;

        const course  = await Course.findById(courseId);
        if(course){
            res.status(200).json(course);
        }else{
            return res.status(400).send({msg: "Enable fetch course."});
        }

    } catch (error) {
        res.status(500).send({ err: error.message });
    }
})

router.post('/rate-course', fetchUser, async (req, res) => {
    let user_id = req.user.id;
    const user = await User.findById(user_id).select("-Password");
    try {
        if (!user) {
            return res.status(400).send({msg: "User not logged in properly."});
        }

        const { course_id, rating, feedback } = req.body;

        // Validate required fields
        if (!user_id || !course_id || rating === undefined) {
            return res.status(400).json({ success: false, error: 'User_ID, Course_ID, and Rating are required.' });
        }

        const rateExists = await Rating.findOne({User_ID: user_id, Course_ID: course_id});
        if(rateExists){
            return res.status(400).json({ success: false, msg: "Already rated by you!"})
        }

        // Create and save a new rating
        const newRating = new Rating({
            User_ID: user_id,
            Course_ID: course_id,
            Rating: rating,
            Feedback: feedback
        });

        const savedRating = await newRating.save();
        if(savedRating){
            res.status(200).json({ success: true, msg: 'Rating saved successfully.'});
        }else{
            res.status(200).json({ success: false, msg: 'Unable to add rating.'});
        }
    } catch (error) {
        res.status(500).send({ success: false, err: error.message, msg: "Internal server error!" });
    }
});

router.post('/enroll-course', fetchUser, async (req, res) => {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-Password");
    try {
        if (!user) {
            return res.status(400).send({msg: "User not logged in properly."});
        }

        const course_id = req.body.course_id;
        const enrollExits = await CourseEnroll.findOne({Std_ID: userId, Course_ID: course_id});
        if(enrollExits){
            return res.status(400).json({ success: false, msg: "Course enrolled already."})
        }

        const newEnroll = new CourseEnroll({
            Std_ID: userId,
            Course_ID: course_id,
            Status: []
        })

        newEnroll.save().then(() => {
            res.status(200).json({ success: true, msg: "Course Enrolled Successfully."});
        }).catch((err) => {
            res.status(404).send({ success: false, err: err, msg: "Unable to create user." });
        })
    } catch (error) {
        res.status(500).send({ success: false, err: error.message });
    }
})

router.get('/my-courses', fetchUser, async (req, res) => {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-Password");
    try {
        if (!user) {
            return res.status(400).send({msg: "User not logged in properly."});
        }

        const userEnrolls = await CourseEnroll.find();
        
        res.status(200).json(userEnrolls)
    } catch (error) {
        res.status(500).send({ success: false, err: error.message });
    } 
})

router.post('/update-course-status', fetchUser, async (req, res) => {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-Password");
    try {
        if (!user) {
            return res.status(400).send({msg: "User not logged in properly."});
        }

        const {course_id, topic_id} = req.body;
        const enrollExits = await CourseEnroll.findOne({Std_ID: userId, Course_ID: course_id});
        if(!enrollExits){
            return res.status(400).json({ success: false, msg: "Course not enrolled."})
        }

        const course = await CourseStruct.findOne({Course_ID: course_id});

        let topic_name = null;

        for (const unit of course.Unit_List) {
            for (const topic of unit.Topic_List) {
                if (topic._id.toString() === topic_id) {
                    topic_name = topic.Topic_Name;
                }
            }
        }
        if(topic_name){
            if(!enrollExits.Status.includes(topic_id)){
                enrollExits.Status.push(topic_id);
            }
            await enrollExits.save().then(() => {
                res.status(200).send({
                    success: true,
                    msg: `Topic: ${topic_name} is Completed`
                });
            }).catch((err) => {
                res.status(400).send({success: false, msg: 'Error while updating course status.', err: err});
            });
        }else{
            res.status(400).send({
                success: false,
                msg: 'Topic does not exists in main course.'
            })
        }

    } catch (error) {
        res.status(500).send({ success: false, err: error.message });
    }
})

module.exports = router;
