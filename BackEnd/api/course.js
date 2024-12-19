const express = require("express")
const router = express.Router()

const Course = require('../models/Course')
const Rating = require('../models/CourseRating')

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
        res.status(500).send({ success: false, err: error });
    }
});


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
        res.status(500).send({ err: error });
    }
})

router.post('/rate-course', async (req, res) => {
    try {
        const { user_id, course_id, rating, feedback } = req.body;

        // Validate required fields
        if (!user_id || !course_id || rating === undefined) {
            return res.status(400).json({ success: false, error: 'User_ID, Course_ID, and Rating are required.' });
        }

        // Create and save a new rating
        const newRating = new Rating({
            User_ID: user_id,
            Course_ID: course_id,
            Rating: rating,
            Feedback: feedback
        });

        const savedRating = await newRating.save();
        res.status(201).json({ success: true, msg: 'Rating saved successfully.'});
    } catch (error) {
        console.error('Error saving rating:', error);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
});

module.exports = router;
