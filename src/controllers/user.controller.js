require("colors");
const { User } = require("../models/models.wrapper");
const { IllegalArgumentException } = require("../throwable/exception.rootnode");
const HyperLinks = require("../utils/_link.hyper");

const bufferParser = require("../utils/buffer.parser");
const cloudinary = require("../config/cloudinary");
const env = process.env.NODE_ENV;

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
        .then(async (user) => {
            if (profile) {
                if (env === "dev") {
                    user.avatar = profile.path;
                    return;
                }
                const file = bufferParser(profile).content;
                await cloudinary.uploader
                    .upload(file, {
                        folder: `story/${req.user.username}`, // Set a folder in Cloudinary to store the uploaded files
                        resource_type: "auto", // Let Cloudinary automatically determine the resource type (e.g., image, video)
                    })
                    .then((result) => {
                        user.avatar = result.secure_url;
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }
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
