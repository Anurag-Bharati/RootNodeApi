const { User, Profile, UserSession } = require("../models/models.wrapper");
const jwt = require("jsonwebtoken");
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

        let session = await UserSession.findOne({ user: user._id });

        if (!session) {
            session = await user.generateRefreshToken();
        }

        if (nowInSec > session.expiresAt) {
            await session.remove();
            authToken = await session.generateToken();
        }

        let accessToken = await user.generateAccessToken();

        console.log(
            "↪".bold,
            " UserLoggedIn ".bgCyan.bold,
            `${user._id} at ${now.toLocaleString()}`.cyan
        );
        // TODO Add secure:true in production
        res.cookie("token", session.token, {
            httpOnly: true,
            maxAge: process.env.HTTP_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
            sameSite: "None",
            // secure: true,
        });

        res.json({
            success: true,
            reply: "User logged in succesfully",
            role: user.role,
            accountStatus: user.status,
            accessToken: accessToken,
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
            user: newUser._id,
        });
    } catch (err) {
        next(err);
    }
};

const handleLogout = async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.token) return res.sendStatus(204);
    const refreshToken = cookies.token;
    // clear session from DB
    const foundSession = await UserSession.findOne({ token: refreshToken });
    if (foundSession) await foundSession.remove();
    // TODO Add secure:true in production
    res.clearCookie("token", { httpOnly: true, sameSite: "None" });
    res.sendStatus(204);
};

// TODO Handle exception as well
const handleRefreshToken = async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.token) return res.sendStatus(401);
    const refreshToken = cookies.token;
    // checking for a session. Alternatively get data from decoded
    const foundSession = await UserSession.findOne({ token: refreshToken });
    if (!foundSession) return res.sendStatus(403);
    const foundUser = await User.findById(foundSession.user);
    if (!foundUser) return res.sendStatus(404);
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return next(err);
            if (!foundUser._id.equals(decoded._id)) return res.sendStatus(403);
            const accessToken = await foundUser.generateAccessToken();
            res.json({
                success: true,
                reply: "Access-Token renewed",
                accountStatus: foundUser.status,
                role: foundUser.role,
                accessToken: accessToken,
            });
        }
    );
};

module.exports = {
    handleLogin,
    handleRegister,
    handleRefreshToken,
    handleLogout,
};
