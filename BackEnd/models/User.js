const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    Email: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true, 
        lowercase: true,
        validate: {
            validator: function(value) {
                // Using a simple regular expression for email validation
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    Password: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    },
    User_Type: {
        type: String,
        enum: ['Student', 'Faculty', 'Admin'],
        required: true
    },
    User_Data: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
}, {
    timestamps: true,
});

userSchema.index({ User_Type: 1 });

const User = mongoose.model("User", userSchema);

module.exports = User;