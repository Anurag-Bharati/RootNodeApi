const { User, UserSession } = require("../models/models.wrapper");
const jwt = require("jsonwebtoken");
require("colors");
const {
    EntityNotFoundException,
    EntityConflictException,
    FieldNotMatchedException,
    IllegalArgumentException,
} = require("../throwable/exception.rootnode");
const HyperLinks = require("../utils/_link.hyper");

const handleLogin = async (req, res, next) => {
    let now = new Date();
    let nowInSec = Math.ceil(now.getTime() * 0.001);
    const { username, email, password } = req.body;

    try {
        if ((!username && !email) || !password) {
            throw new IllegalArgumentException("Missing required fields");
        }

        let user = null;
        const [ubn, ube] = await Promise.all([
            User.findOne({ username: username }),
            User.findOne({ email: email }),
        ]);
        user = ubn ? ubn : ube;
        if (!user) {
            let err;
            if (!ubn) err = `User with username '${username}' does not exists`;
            else if (!ube) err = `User with email '${email}' does not exists`;
            else err = `User does not exists`;
            throw new EntityNotFoundException(err);
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) throw new FieldNotMatchedException("Incorrect password");

        // if (user.status !== "active") {
        //     return res.status(401).json({
        //         success: false,
        //         accountStatus: user.status,
        //         reply: "Account not active",
        //     });
        // }

        let session = await UserSession.findOne({ user: user._id });
        if (!session) session = await user.generateRefreshToken();
        if (nowInSec > session.expiresAt) {
            await session.remove();
            session = await user.generateRefreshToken();
        }
        const accessToken = await user.generateAccessToken();

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
        // console.log(accessToken);
        res.json({
            success: true,
            message: "User logged in succesfully",
            data: {
                rootnode: user,
                accessToken: accessToken,
            },
            _links: {
                user: HyperLinks.userLinks,
                post: HyperLinks.postLinks,
                story: HyperLinks.storyLinks,
                event: HyperLinks.eventLinks,
                connection: HyperLinks.connLinks,
            },
        });
    } catch (err) {
        next(err);
    }
};

const handleRegister = async (req, res, next) => {
    let now = new Date();
    const { email, password, fname, lname } = req.body;

    try {
        if (!email || !password || !fname || !lname) {
            throw new IllegalArgumentException("Missing required fields");
        }

        const user = await User.exists({ email: email });

        if (user)
            throw new EntityConflictException(
                `User with email ${email} already exists`
            );

        const newUser = User({ fname, lname, email });

        const [username, hash] = await Promise.all([
            newUser.generateUsername(fname, lname),
            newUser.encryptPassword(password),
        ]);

        newUser.username = username;
        newUser.password = hash;

        await newUser.save();

        console.log(
            "↪".bold,
            " UserCreated ".bgCyan.bold,
            `User registered with id: ${newUser._id} at ${now.toLocaleString()}`
                .cyan
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully!",
            data: { username: newUser.username, _id: newUser._id },
            _links: { self: HyperLinks.authLinks },
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
                message: "Access-Token renewed",
                data: {
                    accountStatus: foundUser.status,
                    role: foundUser.role,
                    accessToken: accessToken,
                },
                _links: {
                    user: HyperLinks.userLinks,
                    post: HyperLinks.postLinks,
                    story: HyperLinks.storyLinks,
                    event: HyperLinks.eventLinks,
                    connection: HyperLinks.connLinks,
                },
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
