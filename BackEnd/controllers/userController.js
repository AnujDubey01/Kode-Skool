const User = require("../models/User");
const Student = require("../models/Student");

const updateStudentProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-Password");
        if (!user) {
            return res.status(400).send({ success: false, msg: "User doesn't exist." });
        }

        const {
            name, phone, street, city, state, country, pin,
            university_type, school_clg_name, class_year, dob,
            hacker_rank, linkedin, codechef, instagram
        } = req.body;

        const updateData = {};
        if (name && name.trim()) {
            updateData.Name = name.trim();
        }

        // Only validate phone if provided and not empty
        if (phone && phone.trim()) {
            updateData.Phone = phone.trim();
        }

        const addressData = {};
        if (street !== undefined) addressData.street = street.trim ? street.trim() : street;
        if (city !== undefined) addressData.city = city.trim ? city.trim() : city;
        if (state !== undefined) addressData.state = state.trim ? state.trim() : state;
        if (country !== undefined) addressData.country = country.trim ? country.trim() : country;
        if (pin && pin.trim()) {
            addressData.pin = pin.trim();
        }
        updateData.Address = addressData;

        const eduData = {};
        if (university_type) eduData.university_type = university_type;
        if (school_clg_name !== undefined) eduData.school_clg_name = school_clg_name.trim ? school_clg_name.trim() : school_clg_name;
        if (class_year) eduData.class_year = Number(class_year);
        updateData.Education = eduData;

        if (dob) {
            updateData.DOB = new Date(dob);
        }

        const socialHandles = [];
        if (hacker_rank !== undefined) socialHandles.push({ handle_name: 'hacker_rank', handle_link: hacker_rank });
        if (linkedin !== undefined) socialHandles.push({ handle_name: 'linkedin', handle_link: linkedin });
        if (codechef !== undefined) socialHandles.push({ handle_name: 'codechef', handle_link: codechef });
        if (instagram !== undefined) socialHandles.push({ handle_name: 'instagram', handle_link: instagram });
        updateData.Social_Handles = socialHandles;

        let student = null;
        if (user.User_Data) {
            student = await Student.findByIdAndUpdate(
                user.User_Data,
                { $set: updateData },
                { new: true, runValidators: true }
            );
        }

        // If student record was not found or not linked yet, create it
        if (!student) {
            student = new Student({
                Email: user.Email,
                Name: name || 'Student',
                ...updateData
            });
            await student.save();
            user.User_Data = student._id;
            await user.save();
        }

        return res.status(200).send({ success: true, msg: "Updated details successfully.", student });

    } catch (error) {
        return res.status(400).send({ success: false, msg: error.message });
    }
};

const getStudentProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-Password");
        if (!user) {
            return res.status(400).send({ msg: "User doesn't exist." });
        }

        let student = null;
        if (user.User_Data) {
            student = await Student.findById(user.User_Data);
        }

        // If student doesn't exist yet, lazily create default profile
        if (!student) {
            student = new Student({
                Email: user.Email,
                Name: user.Email.split('@')[0] || 'Student'
            });
            await student.save();
            user.User_Data = student._id;
            await user.save();
        }

        return res.status(200).send(student);
    } catch (error) {
        return res.status(500).send({ err: error.message });
    }
};

module.exports = {
    updateStudentProfile,
    getStudentProfile
};
