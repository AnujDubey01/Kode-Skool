const mongoose = require('mongoose');

// Define the Subdocument Schema for Address
const addressSchema = new mongoose.Schema({
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    pin: { type: String, trim: true, match: [/^\d{6}$/, 'Pin code must be 6 digits'] },
});

// Define the Subdocument Schema for Education
const educationSchema = new mongoose.Schema({
    university_type: {
        type: String,
        enum: ['School', 'College']
    },
    school_clg_name: {
        type: String,
        trim: true
    },
    class_year: {
        type: Number,
        min: 1
    }
})

// Subdocument for social handle
const socialHandle = new mongoose.Schema({
    handle_name: {
        type: String,
        trim: true
    },
    handle_link: {
        type: String,
        trim: true
    }
})

// Define the Main Schema for Student
const studentSchema = new mongoose.Schema({
    Email: {
        type: String, 
        required: true, 
        unique: true, 
        trim: true, 
        lowercase: true,
        validate: {
            validator: function (value) {
                // Using a simple regular expression for email validation
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    Name: { type: String, required: true, trim: true },
    Address: addressSchema, // Subdocument
    Phone: { type: String, trim: true, match: [/^\d{10}$/, 'Phone number must be 10 digits'] },
    Education: educationSchema, // Subdocument
    DOB: { type: Date },
    Social_Handles: [socialHandle]
}, {
    timestamps: true,
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
