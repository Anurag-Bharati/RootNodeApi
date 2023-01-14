const dotenv = require("dotenv");
const runApp = require("./app.js");
const logger = require("./utils/logger");
const pipeline = require("./middleware/pipeline");
const routes = require("./routes/routes.wrapper");
const connectDBAndLaunch = require("./config/db");
const colors = require("colors/safe");
const utils = require("./utils/utils.js");

// Config
colors.enable();
dotenv.config();

const app = runApp();
const PORT = process.env.PORT || 3000;
const ROOT = process.env.API_URL || "/api/v0";

const startApp = (showCause) => {
    pipeline.init(logger, showCause);
    app.use(pipeline.entryMiddleware);
    app.use(pipeline.exitMiddleware);
    /* routing start */
    app.use(`${ROOT}/user`, routes.user);
    app.use(`${ROOT}/post`, routes.post);
    /* fallback routes  */
    app.get("*", utils.notFound);
    app.all("*", utils.notImplemented);
    /* routing end */
    app.use(pipeline.errorMiddleware);
    app.listen(PORT, () => {
        console.log(
            colors.yellow.bold("[INFO]"),
            "App is running on port".bold,
            PORT.underline.bold
        );
        console.log(
            "\n" + " ROOTNODE ".inverse.bold,
            "- waiting for requests... \n"
        );
        logger.log("[Info] App started on port:" + PORT);
    });
};

// Launch
connectDBAndLaunch(startApp);
