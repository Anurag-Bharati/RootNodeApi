const mongoose = require("mongoose");
const dotenv = require("dotenv");
const runApp = require("./app.js");
const logger = require("./utils/logger");
const pipeline = require("./middleware/pipeline");

// Config
dotenv.config();

// ?
mongoose.set("strictQuery", false);

const app = runApp();
const port = process.env.PORT || 3030;

const startApp = () => {
    console.log("Connected to MongoDB Server");
    pipeline.init(logger);
    app.use(pipeline.entryMiddleware);
    // More middleware here
    app.use(pipeline.errorMiddleware);
    app.listen(port, () => {
        console.log("App is running on port: " + port);
        logger.log("[INFO] App started on port:" + port);
    });
};

// Launch
mongoose
    .connect(
        process.env.USECLOUDDB === "0"
            ? process.env.LOCALDB
            : process.env.CLOUDDB
    )
    .then(() => startApp())
    .catch((err) => {
        console.error(err);
        logger.log(`[ERR] ${err}`);
    });
