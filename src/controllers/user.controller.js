const User = require("../models/user");
const bcrypt = require("bcryptjs");

const getUserByID = (req, res, next) => {
    User.findById(req.params.id)
        .then((user) => res.json(user))
        .catch(next);
};
const updateUserByID = (req, res, next) => {
    User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        .then((user) => res.status(200).json(user))
        .catch(next);
};
const login = (req, res, next) => {
    res.json({ reply: "Login" });
};
const register = (req, res, next) => {
    User.findOne({ username: req.body.username })
        .then((x) => {
            if (x != null) {
                let err = new Error(
                    `User with the ${req.body.username} already exists.`
                );
                return next(err);
            }

            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) return next(err);
                let user = new User();
                user.username = req.body.username;
                user.fname = req.body.fname;
                user.lname = req.body.lname;
                user.email = req.body.email;
                user.password = hash;
                user.save()
                    .then((x) => {
                        res.status(201).json({
                            status: "User registered successfully!",
                            username: x.username,
                            userId: x._id,
                        });
                    })
                    .catch(next);
            });
        })
        .catch(next);
};

module.exports = {
    login,
    register,
    getUserByID,
    updateUserByID,
};
