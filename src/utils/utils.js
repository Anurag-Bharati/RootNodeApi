const notImplemented = (req, res) =>
    res.status(501).json({ success: false, reply: "Method not implemented" });

const utils = {};
utils.notImplemented = notImplemented;

module.exports = utils;
