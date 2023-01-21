require("colors");
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

const whoAmI = (req, res, next) => {
    const user = req.user || { username: "Anonymous-User" };
    const isAnonymous = req.user == null;
    res.status(200).json({ user: user, isAnonymous: isAnonymous });
};
const updateUserByID = (req, res, next) => {
    User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        .then((user) => res.status(200).json(user))
        .catch(next);
};
const login = async (req, res, next) => {
    const now = new Date();
    const nowInSec = Math.ceil(now.getTime() * 0.001);
    const { username, password } = req.body;
    try {
        if (!username || !password)
            throw new IllegalArgumentException("Missing required fields");

        const user = await User.findOne({ username: username });
        if (!user) throw new EntityNotFoundException(`${username} not exists`);

        const isMatch = await user.matchPassword(password);
        if (!isMatch) throw new FieldNotMatchedException("Incorrect password");

        if (user.status !== "active") {
            return res.status(401).json({
                success: false,
                message: "Account not active",
                data: { accountStatus: user.status },
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
        res.json({
            success: true,
            message: "User logged in succesfully",
            data: {
                accountStatus: user.status,
                token: authToken.token,
                expiresAt: authToken.expiresAt,
            },
        });
    } catch (err) {
        next(err);
    }
};
const register = async (req, res, next) => {
    const now = new Date();
    const { username, email, password, fname, lname } = req.body;
    const missing = !username || !email || !password || !fname || !lname;
    try {
        if (missing)
            throw new IllegalArgumentException("Missing required fields");

        const user = await User.findOne({ username: username });

        if (user)
            throw new EntityConflictException(
                `User with username ${username} already exists`
            );

        const newUser = User({ username, email, password });
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
            message: "User registered successfully!",
            data: { userId: newUser._id, username: newUser.username },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    whoAmI,
    login,
    register,
    getUserByID,
    updateUserByID,
};
