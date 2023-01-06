const jwt = require("jsonwebtoken");
const { User } = require("../models/models.wrapper");
const { PermissionError } = require("../throwable/error.rootnode");

const verifyUser = (req, res, next) => {
    if (!req.headers.authorization) {
        const err = new PermissionError("Authorization token is missing", 401);
        res.status(400);
        return next(err);
    }
    token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return next(err);
        // setting req.user val
        // req.user = decoded;
        req.user = await User.findById(decoded.id, {
            _id: 1,
            fname: 1,
            avatar: 1,
            connectionCount: 1,
        });
        next();
    });
};

module.exports = { verifyUser };
