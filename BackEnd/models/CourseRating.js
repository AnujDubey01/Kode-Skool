const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
    User_ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    Course_ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    Rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    Feedback: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Ensure the combination of User_ID and Course_ID is unique
ratingSchema.index({ User_ID: 1, Course_ID: 1 }, { unique: true });

// Update Course Rating on Save/Update/Delete
courseRatingSchema.post("save", async function () {
    const Course = mongoose.model("Course");
    await Course.updateRating(this.Course_ID);
});

courseRatingSchema.post("findOneAndUpdate", async function (doc) {
    const Course = mongoose.model("Course");
    if (doc) {
        await Course.updateRating(doc.Course_ID);
    }
});

courseRatingSchema.post("findOneAndDelete", async function (doc) {
    const Course = mongoose.model("Course");
    if (doc) {
        await Course.updateRating(doc.Course_ID);
    }
});

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
