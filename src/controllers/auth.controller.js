const { User, Profile, UserSession } = require("../models/models.wrapper");
require("colors");

const {
    EntityNotFoundException,
    EntityConflictException,
    FieldNotMatchedException,
    IllegalArgumentException,
} = require("../throwable/exception.rootnode");

const handleLogin = async (req, res, next) => {
    let now = new Date();
    let nowInSec = Math.ceil(now.getTime() * 0.001);
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            throw new IllegalArgumentException("Missing required fields");
        }

        const user = await User.findOne({ username: username });

        if (!user) {
            throw new EntityNotFoundException(
                `User with ${username} name does not exists`
            );
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            throw new FieldNotMatchedException("Incorrect password");
        }

        if (user.status !== "active") {
            return res.status(401).json({
                success: false,
                accountStatus: user.status,
                reply: "Account not active",
            });
        }
        // Check for refresh token sth idk atm FIX_THIS
        let session = await UserSession.findOne({ user: user._id });

        if (!session) {
            //TODO
            throw new SessionExpireException();
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
    } catch (err) {
        next(err);
    }
};
const handleRegister = async (req, res, next) => {
    let now = new Date();
    const { username, email, password, fname, lname } = req.body;

    try {
        if (!username || !email || !password || !fname || !lname) {
            throw new IllegalArgumentException("Missing required fields");
        }

        const user = await User.findOne({ username: username });

        if (user)
            throw new EntityConflictException(
                `User with username ${username} already exists`
            );

        const newUser = await User({ username, email, password });
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
    } catch (err) {
        next(err);
    }
};

module.exports = {
    handleLogin,
    handleRegister,
};
