const init = (loggerInstance) => (logger = loggerInstance);

const entryMiddleware = (req, res, next) => {
    console.log("\x1b[33m", `[INBOUND] ${req.method} ${req.path}`, "\x1b[0m");
    logger.log(`[INBOUND] ${req.method} ${req.path}`);
    next();
};
const errorMiddleware = (err, req, res, next) => {
    const status = err.statusCode || 400;
    console.log(
        "\x1b[31m",
        `[${err.name}] ${status} ${err.message}. Caused by ${req.method} at ${req.path}`,
        "\x1b[0m"
    );
    logger.log(`[ERR] ${err.name}:${status} ${err.message} ${req.path}`);
    res.status(status).json({
        status: status,
        err: err.message,
    });
    next();
};
const pipeline = {};
pipeline.init = init;
pipeline.entryMiddleware = entryMiddleware;
pipeline.errorMiddleware = errorMiddleware;
module.exports = pipeline;
