const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Teacher = require('../models/Teacher');

const email = process.argv[2] || 'teacher@kodeskool.com';
const password = process.argv[3] || 'Teacher@123';
const name = process.argv[4] || 'Demo Teacher';

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Kodeskool';

async function setupTeacher() {
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let teacherProfile = await Teacher.findOne({ Email: email.toLowerCase() });
        if (!teacherProfile) {
            teacherProfile = new Teacher({
                Name: name,
                Email: email.toLowerCase(),
                Department: 'Computer Science',
                AssignedClasses: ['Class 9', 'Class 10', 'Class 11']
            });
            await teacherProfile.save();
            console.log(`Created Teacher profile for: ${name}`);
        }

        let user = await User.findOne({ Email: email.toLowerCase() });
        if (user) {
            user.Password = hashedPassword;
            user.User_Type = 'Faculty';
            user.User_Data = teacherProfile._id;
            await user.save();
            console.log(`Updated user ${email} to Faculty/Teacher.`);
        } else {
            user = new User({
                Email: email.toLowerCase(),
                Password: hashedPassword,
                User_Type: 'Faculty',
                User_Data: teacherProfile._id
            });
            await user.save();
            console.log(`Created new Faculty/Teacher user: ${email}`);
        }

        await mongoose.disconnect();
        console.log(`\nTeacher account ready!`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        process.exit(0);
    } catch (err) {
        console.error('Error creating teacher account:', err.message);
        process.exit(1);
    }
}

setupTeacher();
