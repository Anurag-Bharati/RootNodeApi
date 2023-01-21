const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("colors");

const AuthToken = require("./user.authtoken");

const userSchema = new Schema(
    {
        username: {
            type: String,
            lowercase: true,
            unique: true,
            required: [true, "Please enter an username."],
            minlength: [3, "Username must be at least 3 characters."],
            maxlength: [20, "Username must not exceeds 20 characters."],
            trim: true,
        },

        email: {
            type: String,
            required: [true, "Email is required."],
            trim: true,
        },

        emailVerified: {
            type: Boolean,
            default: false,
        },

        password: {
            type: String,
            required: [true, "Please enter a password."],
            minlength: [6, "Password must be at least 6 characters."],
            select: false,
        },

        avatar: String,

        postsCount: {
            type: Number,
            default: 0,
        },

        storiesCount: {
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
        status: {
            type: String,
            enum: ["active", "inactive", "banned"],
            default: "active",
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

        usernameChangedAt: Date,
    },
    { timestamps: true }
);

userSchema.methods.generateToken = async function () {
    const token = jwt.sign(
        { id: this._id, username: this.username, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const decodedData = jwt.decode(token);
    const authToken = await AuthToken.create({
        token: token,
        user: this._id,
        issuedAt: decodedData.iat,
        expiresAt: decodedData.exp,
    });

    console.log(
        "↪".bold,
        " TokenGenerated ".bgCyan.bold,
        `New token has been assigned to ${this._id}`.cyan
    );

    return authToken;
};

userSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

userSchema.methods.matchPassword = async function (password) {
    const _this = await User.findById(this._id, { password: 1 }).exec();
    return await bcrypt.compare(password, _this.password);
};

userSchema.pre("save", function (next) {
    if (this.isModified("username")) this.usernameChangedAt = Date.now();
    next();
});

const User = model("User", userSchema);
module.exports = User;
