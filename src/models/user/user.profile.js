const { Schema, model } = require("mongoose");

const profileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    fname: {
        type: String,
        minlength: [3, "First name must be at least 3 characters."],
        required: [true, "Please enter a first name."],
        trim: true,
    },

    lname: {
        type: String,
        required: [true, "Please enter a last name."],
        trim: true,
    },
    gender: {
        type: String,
        enum: ["male", "female", "others"],
    },
    phone: {
        type: String,
        trim: true,
    },
    countryCode: {
        type: String,
        trim: true,
    },
    phoneVerified: {
        type: Boolean,
        default: false,
    },
    dob: {
        type: String,
        trim: true,
    },
    about: {
        type: String,
        trim: true,
    },
    cover: String,
});

const Profile = model("Profile", profileSchema);

module.exports = Profile;
