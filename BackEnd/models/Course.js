const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    Course_Name: {
        type: String,
        required: true,
        trim: true,
    },
    Faculty_Name: {
        type: String,
        required: true,
        trim: true,
    },
    Price: {
        type: Number,
        required: true,
        min: 0,
    },
    Rating: {
        type: Number,
        default: 0
    },
    Duration: {
        type: Number, // Duration in hours
        required: true,
        validate: {
            validator: function (value) {
                return value > 0;
            },
            message: 'Duration must be a positive number.',
        },
    },
    Description: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});

// Update Course Rating Automatically
courseSchema.statics.updateRating = async function (courseId) {
    const CourseRating = require("./CourseRating");
    const courseRatings = await CourseRating.find({ Course_ID: courseId });

    const averageRating = courseRatings.length
        ? courseRatings.reduce((sum, rating) => sum + rating.Rating, 0) / courseRatings.length
        : 0;

    await this.findByIdAndUpdate(courseId, { Rating: averageRating });
};

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;