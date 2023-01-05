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
    },

    lname: {
        type: String,
        required: [true, "Please enter a last name."],
    },
    gender: {
        type: String,
        enum: ["male", "female", "others"],
    },
    phone: String,
    countryCode: String,
    phoneVerified: {
        type: Boolean,
        default: false,
    },
    dob: String,
    about: String,
    cover: String,
});

const Profile = model("Profile", profileSchema);

module.exports = Profile;
