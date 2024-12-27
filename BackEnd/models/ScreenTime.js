const mongoose = require('mongoose');

const screenTimeSchema = new mongoose.Schema({
    St_ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    Start_Date: {
        type: Date, // Date and Time when user starts watching a component or page
        required: true
    },
    Duration: {
        type: Number, // IN Seconds
        required: true,
        validate: {
            validator: function (value) {
                return value > 0;
            },
            message: 'Duration must be a positive number.',
        },min: 0
    },
    Purpose: {
        type: String,
        trim: true
    }
})

const ScreenTime = mongoose.model("ScreenTime",screenTimeSchema);

module.exports = ScreenTime;