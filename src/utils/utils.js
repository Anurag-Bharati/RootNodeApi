const {
    NotImplementedError,
    RouteNotFoundError,
} = require("../throwable/error.rootnode");

const notImplemented = (req, res, next) =>
    next(new NotImplementedError("Method not implemented"));
const notFound = function (req, res, next) {
    next(new RouteNotFoundError("Route does not exists"));
};
const utils = {};
utils.notImplemented = notImplemented;
utils.notFound = notFound;

module.exports = utils;
