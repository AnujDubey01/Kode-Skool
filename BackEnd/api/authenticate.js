const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const User = require("../models/User");
const Student = require("../models/Student");

const JWT_SECRET = 'JWT_SECRET_KEY';

router.post('/register/student', [
    body("email", "Enter a valid Email").isEmail(),
    body("password")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
        .custom(value => {
            if (!/[A-Z]/.test(value)) {
                throw new Error('Password must contain at least one uppercase letter');
            }
            if (!/[0-9]/.test(value)) {
                throw new Error('Password must contain at least one number');
            }
            if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                throw new Error('Password must contain at least one special character');
            }
            return true;
        }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({success: false, msg: errors.array()[0]});
    }

    try {
        let user = await User.findOne({ Email: req.body.email })
        if (user) {
            return res.status(400).send({ success: false, msg: "User already exists with this email." })
        }

        const { email, password, name } = req.body;

        const newStudent = new Student({
            Email: email,
            Name: name
        })

        const stdId = await newStudent.save()
            .then((savedStudent) => {
                return savedStudent._id;
            })
            .catch((err) => {
                res.status(404).send({ success: false, msg: "Unable to create user." });
            });

        // Creating Hash of password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = new User({
            Email: email,
            Password: hash,
            User_Type: "Student",
            User_Data: stdId
        })

        const userId = newUser.save()
            .then((savedUser) => {
                return savedUser._id;
            })
            .catch((err) => {
                res.status(404).send({ success: false, err: err, msg: "Unable to create user." });
            })

        const Auth_token = jwt.sign({user: {id: userId}},JWT_SECRET)
        
        res.status(200).send({
            success: true,
            msg: "User registered successfully.",
            auth_token: Auth_token
        })

    } catch (error) {
        res.status(500).send({ success: false, err: error.message });
    }
})

router.post("/login",[
    body("email","Enter a valid email").isEmail(),
    body("password","Password cannot be blank").exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ success: false, message: errors.array()[0], otherDetails: req.body});
    }

    try {
        const user = await User.findOne({ Email: req.body.email }).select('+Password')
        if (!user) {
            return res.status(400).send({ success: false, msg: "User doesn't exists."});
        }

        const hash = user.Password;

        const result = await bcrypt.compare(req.body.password, hash);

        if(!result){
            return res.status(400).send({ success: false, msg: "Wrong Password!"});
        }

        const Auth_token = jwt.sign({user: {id: user._id}},JWT_SECRET)
        
        res.status(200).send({
            success: true,
            msg: "User login successful.",
            auth_token: Auth_token
        })

    } catch (error) {
        res.status(500).send({ success: true, err: error.message });
    }
})

module.exports = router;