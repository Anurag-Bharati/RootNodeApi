require("colors");
const { isValidObjectId } = require("mongoose");
const { User } = require("../models/models.wrapper");
const { IllegalArgumentException } = require("../throwable/exception.rootnode");

const getAllUsers = (req, res, next) => {
    User.find()
        .then((users) => res.json(users))
        .catch(next);
};

const getUserByID = (req, res, next) => {
    const uid = req.user._id;
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
    User.findByIdAndUpdate(req.user._id, { $set: req.body }, { new: true })
        .then((user) => user.save().then(res.status(200).json(user)))
        .catch(next);
};

const isUsernameUnique = async (req, res, next) => {
    const un = req.query.username;
    try {
        if (!un) throw new IllegalArgumentException("Missing username field");
        const exists = await User.exists({ username: un });
        console.log(exists);
        if (exists === null) return res.sendStatus(200);
        return res.sendStatus(409);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    whoAmI,
    getAllUsers,
    getUserByID,
    updateUserByID,
    isUsernameUnique,
};
