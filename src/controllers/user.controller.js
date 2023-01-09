const { User, Profile, AuthToken } = require("../models/models.wrapper");
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
    let now = Math.ceil(new Date().getTime() * 0.001); // in seconds
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

    if (now > authToken.expiresAt) {
        await authToken.remove();
        authToken = await user.generateToken();
    }
    res.status(200).json({
        success: true,
        reply: "User logged in succesfully",
        accountStatus: user.status,
        token: authToken.token,
        expiresAt: authToken.expiresAt,
    });
};
const register = async (req, res, next) => {
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
