const init = (loggerInstance) => (logger = loggerInstance);

const entryMiddleware = (req, res, next) => {
    console.log(`[INFO] ${req.method} ${req.path}`);
    logger.log(`[INFO] ${req.method} ${req.path}`);
    next();
};
const errorMiddleware = (err, req, res, next) => {
    console.log(err);
    logger.log(`[ERR] ${req.err} ${req.path}`);
    res.status(500).json({ err: err.message });
    next();
};
const pipeline = {};
pipeline.init = init;
pipeline.entryMiddleware = entryMiddleware;
pipeline.errorMiddleware = errorMiddleware;
module.exports = pipeline;
