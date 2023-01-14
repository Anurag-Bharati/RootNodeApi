const { User, Profile, AuthToken } = require("../models/models.wrapper");
require("colors");
const {
    EntityNotFoundException,
    EntityConflictException,
    FieldNotMatchedException,
    IllegalArgumentException,
} = require("../throwable/exception.rootnode");

const getUserByID = (req, res, next) => {
    User.findById(req.params.id)
        .then((user) => res.json(user))
        .catch(next);
};
const updateUserByID = (req, res, next) => {
    User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        .then((user) => res.status(200).json(user))
        .catch(next);
};
const login = async (req, res, next) => {
    let now = new Date();
    let nowInSec = Math.ceil(now.getTime() * 0.001);

    const { username, password } = req.body;
    if (!username || !password) {
        const e = new IllegalArgumentException("Missing required fields");
        return next(e);
    }
    const user = await User.findOne({ username: username });

    if (!user) {
        return next(
            new EntityNotFoundException(
                `User with ${username} name does not exists`
            )
        );
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        const e = new FieldNotMatchedException("Incorrect password");
        return next(e);
    }

    if (user.status !== "active") {
        return res.status(401).json({
            success: false,
            accountStatus: user.status,
            reply: "Account not active",
        });
    }

    let authToken = await AuthToken.findOne({ user: user._id });

    if (!authToken) {
        authToken = await user.generateToken();
    }

    if (nowInSec > authToken.expiresAt) {
        await authToken.remove();
        authToken = await user.generateToken();
    }
    console.log(
        "↪".bold,
        " UserLoggedIn ".bgCyan.bold,
        `${user._id} at ${now.toLocaleString()}`.cyan
    );
    res.status(200).json({
        success: true,
        reply: "User logged in succesfully",
        accountStatus: user.status,
        token: authToken.token,
        expiresAt: authToken.expiresAt,
    });
};
const register = async (req, res, next) => {
    let now = new Date();
    const { username, email, password, fname, lname } = req.body;

    if (!username || !email || !password || !fname || !lname) {
        const e = new IllegalArgumentException("Missing required fields");
        return next(e);
    }

    const user = await User.findOne({ username: username });

    if (user)
        return next(
            new EntityConflictException(
                `User with the ${username} already exists`
            )
        );

    const newUser = await User.create({ username, email, password });
    newUser.password = await newUser.encryptPassword(password);

    const profile = new Profile();
    profile.user = newUser._id;
    profile.fname = fname;
    profile.lname = lname;

    await newUser.save();
    await profile.save();

    console.log(
        "↪".bold,
        " UserCreated ".bgCyan.bold,
        `User registered with id: ${newUser._id} at ${now.toLocaleString()}`
            .cyan
    );
    res.status(201).json({
        success: true,
        reply: "User registered successfully!",
        username: newUser.username,
        userId: newUser._id,
    });
};

module.exports = {
    login,
    register,
    getUserByID,
    updateUserByID,
};
