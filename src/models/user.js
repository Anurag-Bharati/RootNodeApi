const { Schema, model } = require("mongoose");

const userSchema = new Schema(
    {
        fname: {
            type: String,
            minlength: [3, "First name must be at least 3 characters."],
            required: [true, "Please enter a first name."],
        },

        lname: {
            type: String,
            required: [true, "Please enter a last name."],
        },

        email: {
            type: String,
            required: [true, "Email is required."],
        },

        emailVerified: {
            type: Boolean,
            default: false,
        },

        username: {
            type: String,
            lowercase: true,
            unique: true,
            required: [true, "Please enter an username."],
            minlength: [3, "Username must be at least 3 characters."],
            maxlength: [20, "Username must not exceeds 20 characters."],
        },
        usernameChangedAt: Date,
        password: {
            type: String,
            required: [true, "Please enter a password."],
            minlength: [6, "Password must be at least 6 chars long."],
            select: false,
        },
        phone: String,
        countryCode: String,
        phoneVerified: {
            type: Boolean,
            default: false,
        },

        avatar: String,
        gender: String,
        dob: String,
        about: String,

        postsCount: {
            type: Number,
            default: 0,
        },

        connectionCount: {
            type: Number,
            default: 0,
        },

        role: {
            type: String,
            enum: ["user", "admin", "moderator"],
            default: "user",
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        showOnlineStatus: {
            type: Boolean,
            default: true,
        },

        lastSeen: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

userSchema.pre("save", function (next) {
    if (this.isModified("username")) this.usernameChangedAt = Date.now();
    next();
});

const User = model("User", userSchema);
module.exports = User;
