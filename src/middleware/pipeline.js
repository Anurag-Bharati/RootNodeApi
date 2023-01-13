require("colors");
const init = (loggerInstance) => (logger = loggerInstance);

const entryMiddleware = (req, res, next) => {
    console.log(
        "\n" + " InBound ".bgYellow.bold,
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
        `${status}: ${err.message}. Caused by ${req.method} at ${req.path}`.red
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
            // "↪".bold,
            " OutBound ".bgGreen.bold,
            `${res.statusCode} ${res.statusMessage} → ${who}`.green
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
