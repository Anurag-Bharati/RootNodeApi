const express = require("express");
const path = require("path");
const pipeline = require("./middleware/pipeline");
const logger = require("./utils/logger");
const staticPath = path.join(__dirname, "/../", "/public/");
const runApp = (params) => {
    const app = express();
    pipeline.init(logger, params.showCause);
    app.use(pipeline.entryMiddleware);
    app.use(pipeline.exitMiddleware);
    app.use(express.json());
    app.use("/public", express.static(staticPath));
    return app;
};

module.exports = runApp;
