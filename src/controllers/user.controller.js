const { User } = require("../models/models.wrapper");
require("colors");

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

module.exports = {
    whoAmI,
    getUserByID,
    updateUserByID,
};
