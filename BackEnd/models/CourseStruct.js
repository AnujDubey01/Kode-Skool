const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
    Topic_Name: {
        type: String,
        trim: true
    },
    Video_Link: {
        type: String,
        trim: true
    },
    Notes_Link: {
        type: String,
        trim: true
    }
});

const unitSchema = new mongoose.Schema({
    Unit_No: {
        type: Number,
        min: 1
    },
    Unit_Name: {
        type: String,
        trim: true
    },
    Topic_List: {
        type: [topicSchema]
    }
});

const courseStructSchema = new mongoose.Schema({
    Course_ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    Unit_List: {
        type: [unitSchema]
    }
})

const CourseStruct = mongoose.model("CourseStruct", courseStructSchema);

module.exports = CourseStruct;