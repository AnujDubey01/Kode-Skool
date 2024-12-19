const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchUser = require("./middleware/fetchuser");

const User = require("../models/User");
const Student = require("../models/Student");

router.post('/profile/student/update', fetchUser, async (req, res) => {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-Password");
    try {
        if (!user) {
            return res.status(400).send({ success: false, msg: "User doesn't exists."});
        }

        const {name, phone, street, city, state, country, pin, university_type, school_clg_name, class_year, dob, hacker_rank, linkedin, codechef, instagram} = req.body;

        updateData = {
            Name: name,
            Phone: phone,
            Address: {
                street: street,
                city: city,
                state: state,
                country: country,
                pin: pin
            },
            Education: {
                university_type: university_type,
                school_clg_name: school_clg_name,
                class_year: class_year
            },
            DOB: new Date(dob),
            Social_Handles: [
                {handle_name: 'hacker_rank', handle_link: hacker_rank},
                {handle_name: 'linkedin', handle_link: linkedin},
                {handle_name: 'codechef', handle_link: codechef},
                {handle_name: 'instagram', handle_link: instagram}
            ]
        }

        const student = await Student.findOneAndUpdate(
            {_id: user.User_Data},
            {$set: updateData},
            {new: true, runValidators: true}
        );

        if(student){
            return res.status(200).send({ success: true, msg: "Updated details successfully."});
        }else{
            return res.status(400).send({ success: false, msg: "Student account doesn't exits."});
        }
        
    } catch (error) {
        res.status(500).send({ err: error });
    }
})

router.get('/profile/student', fetchUser, async(req, res) => {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-Password");
    try {
        if (!user) {
            return res.status(400).send({msg: "User doesn't exists."});
        }

        const student = await Student.findById(user.User_Data);

        if(student){
            res.status(200).send(student);
        }else{
            return res.status(400).send({msg: "Student account doesn't exits."});
        }
    } catch (error) {
        res.status(500).send({ err: error });
    }
})


module.exports = router