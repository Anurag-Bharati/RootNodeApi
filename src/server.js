const colors = require("colors/safe");
const dotenv = require("dotenv");
const runApp = require("./app.js");
const utils = require("./utils/utils.js");
const { serveRandom } = require("./utils/foods");
const routes = require("./routes/routes.wrapper");
const connectDBAndLaunch = require("./config/db");
const { errorMiddleware } = require("./middleware/pipeline");

// Config
colors.enable();
dotenv.config();

const PORT = process.env.PORT || 3000;
const ROOT = process.env.API_URL || "/api/v0";

const startApp = (params) => {
    const app = runApp(params);
    /* routing start */
    app.use(`${ROOT}/user`, routes.user);
    app.use(`${ROOT}/post`, routes.post);
    app.use(`${ROOT}/conn`, routes.conn);
    /* fallback routes  */
    app.get("*", utils.notFound);
    app.all("*", utils.notImplemented);
    /* routing end */
    app.use(errorMiddleware);
    app.listen(PORT, () => initialLogs());
};

const initialLogs = () => {
    console.log(
        colors.yellow.bold("[INFO]"),
        "App is running on port".bold,
        PORT.underline.bold
    );
    console.log(
        "\n" + " RootNodeApi ".inverse.bold,
        `- waiting to serve ${serveRandom()}  \n`.bold
    );
    logger.log("[Info] App started on port:" + PORT);
};
function printProgress(progress) {
    process.stdout.write(progress);
}

// hide cursor
process.stdout.write("\u001B[?25l");
process.stdout.write(
    "\n" + " RootNode ".inverse.bold + " Launching Service. Please Wait".bold
);

let progress = 0;
const switchAt = 30;
const interval = setInterval(() => {
    progress += 10;
    printProgress(".".bold);
    if (progress % switchAt == 0) {
        process.stdout.moveCursor(-3);
        process.stdout.write("   ");
        process.stdout.moveCursor(-3);
    }
    if (progress >= 80) {
        clearInterval(interval);
    }
}, 50);

// Launch
setTimeout(() => connectDBAndLaunch(startApp), 500);
