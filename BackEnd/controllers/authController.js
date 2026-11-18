const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const User = require("../models/User");
const Student = require("../models/Student");

const JWT_SECRET = process.env.JWT_SECRET || 'JWT_SECRET_KEY';

const registerStudent = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ success: false, msg: errors.array()[0] });
    }

    try {
        let user = await User.findOne({ Email: req.body.email });
        if (user) {
            return res.status(400).send({ success: false, msg: "User already exists with this email." });
        }

        const { email, password, name } = req.body;

        const newStudent = new Student({
            Email: email,
            Name: name
        });

        let stdId;
        try {
            const savedStudent = await newStudent.save();
            stdId = savedStudent._id;
        } catch (err) {
            return res.status(404).send({ success: false, msg: "Unable to create user." });
        }

        // Creating Hash of password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = new User({
            Email: email,
            Password: hash,
            User_Type: "Student",
            User_Data: stdId
        });

        let savedUser;
        try {
            savedUser = await newUser.save();
        } catch (err) {
            return res.status(404).send({ success: false, err: err, msg: "Unable to create user." });
        }

        if (!savedUser) return;

        const Auth_token = jwt.sign({ user: { id: savedUser._id, role: savedUser.User_Type } }, JWT_SECRET, { expiresIn: '7d' });

        return res.status(200).send({
            success: true,
            msg: "User registered successfully.",
            auth_token: Auth_token,
            userType: savedUser.User_Type,
            userName: name || email.split('@')[0],
            email: email
        });

    } catch (error) {
        return res.status(500).send({ success: false, err: error.message });
    }
};

const loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ success: false, msg: errors.array()[0] });
    }

    try {
        const user = await User.findOne({ Email: req.body.email }).select('+Password');
        if (!user) {
            return res.status(400).send({ success: false, msg: "User doesn't exists." });
        }

        const hash = user.Password;
        const result = await bcrypt.compare(req.body.password, hash);

        if (!result) {
            return res.status(400).send({ success: false, msg: "Wrong Password!" });
        }

        const Auth_token = jwt.sign({ user: { id: user._id, role: user.User_Type } }, JWT_SECRET, { expiresIn: '7d' });

        let userName = user.Email ? user.Email.split('@')[0] : 'Student';
        try {
            if (user.User_Type === 'Student') {
                const student = await Student.findById(user.User_Data);
                if (student && student.Name) userName = student.Name;
            } else if (user.User_Type === 'Faculty' || user.User_Type === 'Teacher') {
                const Teacher = require("../models/Teacher");
                const teacher = await Teacher.findById(user.User_Data);
                if (teacher && teacher.Name) userName = teacher.Name;
            }
        } catch (e) {
            // fallback to email prefix
        }

        return res.status(200).send({
            success: true,
            msg: "User login successful.",
            auth_token: Auth_token,
            userType: user.User_Type,
            userName: userName,
            email: user.Email
        });

    } catch (error) {
        return res.status(500).send({ success: false, err: error.message });
    }
};

module.exports = {
    registerStudent,
    loginUser
};
