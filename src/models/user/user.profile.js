const { Schema, model } = require("mongoose");

const profileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
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
