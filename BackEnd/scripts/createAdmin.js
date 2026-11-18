const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
    console.error('Usage: node backend/scripts/createAdmin.js <email> <password>');
    process.exit(1);
}

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Kodeskool';

async function setupAdmin() {
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let user = await User.findOne({ Email: email.toLowerCase() });

        if (user) {
            user.Password = hashedPassword;
            user.User_Type = 'Admin';
            await user.save();
            console.log(`Updated existing user (${email}) to Admin with new password.`);
        } else {
            user = new User({
                Email: email.toLowerCase(),
                Password: hashedPassword,
                User_Type: 'Admin'
            });
            await user.save();
            console.log(`Created new Admin account for: ${email}`);
        }

        await mongoose.disconnect();
        console.log('Admin account ready.');
        process.exit(0);
    } catch (err) {
        console.error('Error creating admin account:', err.message);
        process.exit(1);
    }
}

setupAdmin();
