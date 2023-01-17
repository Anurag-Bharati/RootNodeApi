const jwt = require("jsonwebtoken");
const { User } = require("../models/models.wrapper");
const { PermissionError } = require("../throwable/error.rootnode");

const verifyUser = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        const err = new PermissionError("Authorization token is missing", 401);
        res.status(400);
        return next(err);
    }
    token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) return next(err);
        const user = await User.findById(decoded.id, {
            _id: 1,
            username: 1,
            avatar: 1,
            connectionCount: 1,
            role: 1,
        });
        req.user = user;
        next();
    });
};

const checkUserOrAnonymous = (req, res, next) => {
    if (!req.headers.authorization) return next();
    token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) return next();
        req.user = await User.findById(decoded.id, {
            _id: 1,
            username: 1,
            avatar: 1,
            connectionCount: 1,
        });
        next();
    });
};

module.exports = { verifyUser, checkUserOrAnonymous };
