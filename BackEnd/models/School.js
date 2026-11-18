const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        trim: true,
        uppercase: true
    },
    board: {
        type: String,
        enum: ['CBSE', 'ICSE', 'State Board', 'IB', 'Cambridge', 'University', 'Other'],
        default: 'CBSE'
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true
    },
    address: {
        street: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        country: { type: String, trim: true },
        pin: { type: String, trim: true }
    },
    academicYear: {
        type: String,
        default: '2024-2025'
    },
    classes: [{
        type: String,
        trim: true
    }],
    assignedCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
}, {
    timestamps: true
});

const School = mongoose.model("School", schoolSchema);

module.exports = School;
