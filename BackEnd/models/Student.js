const mongoose = require('mongoose');

// Define the Subdocument Schema for Address
const addressSchema = new mongoose.Schema({
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    zip: { type: String, trim: true, match: [/^\\d{5}$/, 'Zip code must be 5 digits'] },
});

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
    Phone: { type: String, trim: true, match: [/^\\d{10}$/, 'Phone number must be 10 digits'] },
    Father_Name: { type: String, trim: true },
    Mother_Name: { type: String, trim: true },
    Parents_Phone: { type: String, trim: true, match: [/^\\d{10}$/, 'Parents phone number must be 10 digits'] },
    Education: { type: String, trim: true },
    DOB: { type: Date },
}, {
    timestamps: true,
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
