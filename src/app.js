const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const pipeline = require("./middleware/pipeline");
const logger = require("./utils/logger");
const staticPath = path.join(__dirname, "/../", "/public/");
const cors = require("cors");
const runApp = (params) => {
    const app = express();
    app.set("trust proxy", true);
    app.use(cookieParser());
    app.use(cors({ credentials: true, origin: true }));
    pipeline.init(logger, params.showCause);
    app.use(pipeline.entryMiddleware);
    app.use(pipeline.exitMiddleware);
    app.use(express.json());
    app.use("/public", express.static(staticPath));
    return app;
};

module.exports = runApp;
