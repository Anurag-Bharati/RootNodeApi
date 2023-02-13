const HyperLinks = require("../utils/_link.hyper");

require("colors");
let showCause = false;
const init = (loggerInstance, _showCause) => {
    logger = loggerInstance;
    showCause = _showCause || false;
};

const entryMiddleware = (req, res, next) => {
    console.log(
        " InBound ".bgYellow.black.bold,
        `${req.method} ${req.path} ← ${req.ip.substring(
            req.ip.lastIndexOf(":") + 1
        )}`.yellow
    );
    logger.log(`[InBound] ${req.method} ${req.path}`);
    next();
};

const errorMiddleware = (err, req, res, next) => {
    const status = err.statusCode || 400;
    console.log(
        "↪".bold,
        ` ${err.name} `.bgRed.black.bold,
        `${status}: ${err.message}.`.red,
        showCause ? `Caused by ${req.method} at ${req.path}`.red : ""
    );
    logger.log(`[Error] ${err.name}:${status} ${err.message} ${req.path}`);
    res.status(status).json({
        success: false,
        message: err.message,
        err: err.name,
        _links: {
            auth: HyperLinks.authLinks,
            user: HyperLinks.userLinks,
            post: HyperLinks.postLinks,
            story: HyperLinks.storyLinks,
            event: HyperLinks.eventLinks,
            connection: HyperLinks.connLinks,
        },
    });
    next();
};
const exitMiddleware = (req, res, next) => {
    res.on("finish", () => {
        const who = req.user ? req.user._id.toString() : "Anonymous-User";
        console.log(
            res.statusCode >= 400 ? "  ↪".bold : "↪".bold,
            " OutBound ".bgGreen.black.bold,
            `${res.statusCode} ${res.statusMessage} → ${who}\n`.green
        );
        logger.log(
            `[OutBound] ${res.statusCode} ${res.statusMessage} -> ${who}`
        );
    });
    next();
};
const pipeline = {};
pipeline.init = init;
pipeline.entryMiddleware = entryMiddleware;
pipeline.errorMiddleware = errorMiddleware;
pipeline.exitMiddleware = exitMiddleware;
module.exports = pipeline;
