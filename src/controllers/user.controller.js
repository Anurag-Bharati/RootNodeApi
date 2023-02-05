require("colors");
const { User } = require("../models/models.wrapper");
const { IllegalArgumentException } = require("../throwable/exception.rootnode");
const HyperLinks = require("../utils/_link.hyper");

const getAllUsers = (req, res, next) => {
    User.find()
        .then((users) => res.json(users))
        .catch(next);
};

const getLoggedInUser = (req, res, next) => {
    const uid = req.user._id;
    User.findById(uid)
        .then((user) =>
            res.json({ user: user, _links: { self: HyperLinks.userOpsLink } })
        )
        .catch(next);
};

const getUserByID = (req, res, next) => {
    const { id } = req.params;
    User.findById(id)
        .then((user) =>
            res.json({ user: user, _links: { self: HyperLinks.userOpsLink } })
        )
        .catch(next);
};

const whoAmI = (req, res, next) => {
    const user = req.user || null;
    const isAnonymous = req.user === null;
    res.status(200).json({
        user: user,
        isAnonymous: isAnonymous,
        _links: { self: HyperLinks.userLinks },
    });
};

const updateUserByID = (req, res, next) => {
    const profile = req.file;
    User.findByIdAndUpdate(req.user._id, { $set: req.body }, { new: true })
        .then((user) => {
            console.log("Profile Image:", profile?.path);
            if (profile) user.avatar = profile.path;
            user.save().then(
                res.status(200).json({
                    user: user,
                    _links: { self: HyperLinks.userOpsLink },
                })
            );
        })
        .catch(next);
};

const isUsernameUnique = async (req, res, next) => {
    const un = req.query.username;
    console.log(un);
    try {
        if (!un) throw new IllegalArgumentException("Missing username field");
        const exists = await User.exists({ username: un });
        if (exists === null) return res.sendStatus(200);
        return res.sendStatus(409);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    whoAmI,
    getAllUsers,
    getLoggedInUser,
    getUserByID,
    updateUserByID,
    isUsernameUnique,
};
