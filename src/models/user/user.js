const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("colors");

const UserSession = require("./user.sessions");

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

        email: {
            type: String,
            required: [true, "Email is required."],
            trim: true,
            unique: true,
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

        avatar: { type: String, default: "public/anonymous.jpg" },

        postsCount: {
            type: Number,
            default: 0,
        },

        storiesCount: {
            type: Number,
            default: 0,
        },
        // following
        connsCount: {
            type: Number,
            default: 0,
        },
        //followers
        nodesCount: {
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
            enum: ["active", "inactive", "busy", "away"],
            default: "inactive",
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
    { timestamps: true },
    { toObject: { getters: true } }
);

userSchema.virtual("fullname").get(function () {
    return `${this.fname} ${this.lname}`;
});

userSchema.methods.generateRefreshToken = async function () {
    const token = jwt.sign(
        { _id: this._id, username: this.username, role: this.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    );

    const decodedData = jwt.decode(token);
    const refreshToken = await UserSession.create({
        token: token,
        user: this._id,
        issuedAt: decodedData.iat,
        expiresAt: decodedData.exp,
    });

    console.log(
        "↪".bold,
        " RefreshTokenGenerated ".bgCyan.bold,
        `New refresh token has been assigned to ${this._id}`.cyan
    );

    return refreshToken;
};
userSchema.methods.generateAccessToken = async function () {
    const token = jwt.sign(
        { _id: this._id, username: this.username, role: this.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );

    console.log(
        "↪".bold,
        " AccessTokenGenerated ".bgCyan.bold,
        `New access token has been assigned to ${this._id}`.cyan
    );

    return token;
};

userSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

userSchema.methods.matchPassword = async function (password) {
    const _this = await User.findById(this._id, { password: 1 }).exec();
    return await bcrypt.compare(password, _this.password);
};

userSchema.methods.generateUsername = async (fname, lname) => {
    let username = `${fname}${lname}`;
    let user = await User.exists({ username });
    let number = 0;

    while (user) {
        number++;
        username = `${fname}${lname}${number}`;
        user = await User.exists({ username });
    }

    return username;
};

userSchema.pre("save", function (next) {
    if (this.isModified("username")) this.usernameChangedAt = Date.now();
    next();
});

const User = model("User", userSchema);
module.exports = User;
