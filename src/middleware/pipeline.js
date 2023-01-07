const init = (loggerInstance) => (logger = loggerInstance);

const entryMiddleware = (req, res, next) => {
    console.log("\x1b[33m", `[InBound] ${req.method} ${req.path}`, "\x1b[0m");
    logger.log(`[InBound] ${req.method} ${req.path}`);
    next();
};
const errorMiddleware = (err, req, res, next) => {
    const status = err.statusCode || 400;
    console.log(
        "\x1b[31m",
        `[${err.name}] ${status} ${err.message}. Caused by ${req.method} at ${req.path}`,
        "\x1b[0m"
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
            "\x1b[32m",
            `[OutBound] ${res.statusCode} ${res.statusMessage} ->`,
            who,
            "\x1b[0m"
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
