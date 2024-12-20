const mongoose = require("mongoose");

const enrollSchema = new mongoose.Schema({
    Std_ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    Course_ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    Status: {
        type: [mongoose.Schema.Types.ObjectId], // List of the topics.
        ref: "CourseStruct.Unit_List.Topic_List"
    }
},{
    timestamps: true
});

enrollSchema.index({ Std_ID: 1, Course_ID: 1 }, { unique: true });

const Enroll = mongoose.model('Enroll',enrollSchema);

module.exports = Enroll;
