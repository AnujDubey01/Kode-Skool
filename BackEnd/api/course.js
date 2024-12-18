const express = require("express")
const router = express.router()

const Course = require('../models/Course')

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
                msg: 'Course added successfully'
            });
        }).catch((err) => {
            res.status(400).send({msg: 'Error while adding course.', err: err});
        });

    } catch (error) {
        res.status(400).json({
            message: 'Error saving course',
            error: error.message,
        });
    }
});

module.exports = router;
