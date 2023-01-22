require("colors");
const { User } = require("../models/models.wrapper");

const getAllUsers = (req, res, next) => {
    User.find()
        .then((users) => res.json(users))
        .catch(next);
};

const getUserByID = (req, res, next) => {
    const uid = req.params.id;
    const isValid = isValidObjectId(uid);
    if (!isValid) return next(new IllegalArgumentException("Invalid user id"));
    User.findById(uid)
        .then((user) => res.json(user))
        .catch(next);
};

const whoAmI = (req, res, next) => {
    const user = req.user || { username: "Anonymous-User" };
    const isAnonymous = req.user === null;
    res.status(200).json({ user: user, isAnonymous: isAnonymous });
};

const updateUserByID = (req, res, next) => {
    User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        .then((user) => res.status(200).json(user))
        .catch(next);
};

module.exports = {
    whoAmI,
    getAllUsers,
    getUserByID,
    updateUserByID,
};
