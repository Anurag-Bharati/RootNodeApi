const notImplemented = (req, res) =>
    res.status(501).json({ reply: "Not implemented." });

const utils = {};
utils.notImplemented = notImplemented;

module.exports = utils;
