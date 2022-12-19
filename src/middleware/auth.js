const jwt = require("jsonwebtoken");
const { User } = require("../models/models.wrapper");

const verifyUser = (req, res, next) => {
    if (!req.headers.authorization) {
        let err = new Error("Authorization token is missing");
        res.status(400);
        return next(err);
    }
    token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET, async (err, decoded) => {
        if (err) return next(err);
        // setting req.user val
        // req.user = decoded;
        req.user = await User.findById(decoded.userId, {
            _id: 1,
            fname: 1,
            avatar: 1,
            connectionCount: 1,
        });
        next();
    });
};

module.exports = { verifyUser };
