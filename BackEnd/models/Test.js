const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    Course_ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    Subject: {
        type: String,
        required: true,
        trim: true,
    },
    Duration: {
        type: Number, // Duration in minutes
        required: true,
        validate: {
            validator: function (value) {
                return value > 0;
            },
            message: 'Duration must be a positive number.',
        },
    },
    Level: {
        type: String,
        enum: ['easy', 'moderate', 'hard'],
        required: true,
    },
    Test_Type: {
        type: String,
        enum: ['live', 'scheduled'], // Options for test type
        required: true,
    },
}, {
    timestamps: true,
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;