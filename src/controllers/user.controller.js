const User = require("../models/user");

const updateUserByID = (req, res, next) => {};
const getUserByID = (req, res, next) => next();
const login = (req, res, next) => {};
const register = (req, res, next) => {};

module.exports = {
    login,
    register,
    getUserByID,
    updateUserByID,
};
