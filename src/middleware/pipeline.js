const init = (loggerInstance) => (logger = loggerInstance);

const entryMiddleware = (req, res, next) => {
    console.log("\x1b[33m", `[INBOUND] ${req.method} ${req.path}`, "\x1b[0m");
    logger.log(`[INBOUND] ${req.method} ${req.path}`);
    next();
};
const errorMiddleware = (err, req, res, next) => {
    console.log(
        "\x1b[31m",
        `[ERROR] ${err.message} caused at ${req.path}`,
        "\x1b[0m"
    );
    logger.log(`[ERR] ${err.message} ${req.path}`);
    res.status(500).json({ err: err.message });
    next();
};
const pipeline = {};
pipeline.init = init;
pipeline.entryMiddleware = entryMiddleware;
pipeline.errorMiddleware = errorMiddleware;
module.exports = pipeline;
