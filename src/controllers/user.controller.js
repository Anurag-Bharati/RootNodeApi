const { User } = require("../models/models.wrapper");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    User.findOne({ username: req.body.username }, "password").then((user) => {
        if (user == null) {
            let err = new Error(
                `User with ${req.body.username} name does not exists.`
            );
            res.status(404);
            return next(err);
        }
        bcrypt.compare(req.body.password, user.password, (err, status) => {
            if (err) return next(err);
            if (!status) {
                let err = new Error("Password does not match");
                res.status(401);
                return next(err);
            }
            let data = {
                userId: user._id,
                username: user.username,
                role: user.role,
            };
            jwt.sign(
                data,
                process.env.SECRET,
                { expiresIn: "1d" },
                (err, token) => {
                    if (err) return next(err);
                    res.json({
                        status: "User logged in succesfully",
                        token: token,
                    });
                }
            );
        });
    });
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
