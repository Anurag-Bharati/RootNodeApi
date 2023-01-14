require("colors");
let showCause = false;
const init = (loggerInstance, _showCause) => {
    logger = loggerInstance;
    showCause = _showCause;
};

const entryMiddleware = (req, res, next) => {
    console.log(
        " InBound ".bgYellow.bold,
        `${req.method} ${req.path} ← ${req.ip}`.yellow
    );
    logger.log(`[InBound] ${req.method} ${req.path}`);
    next();
};

const errorMiddleware = (err, req, res, next) => {
    const status = err.statusCode || 400;
    console.log(
        "↪".bold,
        ` ${err.name} `.bgRed.bold,
        `${status}: ${err.message}.`.red,
        showCause ? `Caused by ${req.method} at ${req.path}`.red : ""
    );
    logger.log(`[Error] ${err.name}:${status} ${err.message} ${req.path}`);
    res.status(status).json({
        success: false,
        status: status,
        reply: err.message,
        err: err.name,
    });
    next();
};
const exitMiddleware = (req, res, next) => {
    res.on("finish", () => {
        const who = req.user ? req.user._id.toString() : "Anonymous-User";
        console.log(
            res.statusCode >= 400 ? "  ↪".bold : "↪".bold,
            " OutBound ".bgGreen.bold,
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
