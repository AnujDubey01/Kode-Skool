const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
    Email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    Name: {
        type: String,
        required: true,
        trim: true
    },
    Phone: {
        type: String,
        trim: true
    },
    Department: {
        type: String,
        default: 'Computer Science'
    },
    School: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School'
    },
    AssignedClasses: [{
        type: String,
        trim: true
    }],
    AssignedCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
}, {
    timestamps: true
});

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
