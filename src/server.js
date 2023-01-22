const colors = require("colors/safe");
const dotenv = require("dotenv");
const runApp = require("./app.js");
const RootNodeSocket = require("./services/socket/socket");
const http = require("http");
const utils = require("./utils/utils.js");
const { serveRandom } = require("./utils/foods");
const routes = require("./routes/routes.wrapper");
const connectDBAndLaunch = require("./config/db");
const { errorMiddleware } = require("./middleware/pipeline");
const initiateApp = require("./config/initiate.server");

// Config
colors.enable();
dotenv.config();

const PORT = process.env.PORT || 3000;
const ROOT = process.env.API_URL || "/api/v0";

const startApp = (params) => {
    const app = runApp(params);
    const server = http.createServer(app);
    /* routing start */
    app.use(`${ROOT}/auth`, routes.auth);
    app.use(`${ROOT}/user`, routes.user);
    app.use(`${ROOT}/post`, routes.post);
    app.use(`${ROOT}/conn`, routes.conn);
    app.use(`${ROOT}/story`, routes.story);
    /* fallback routes */
    app.get("*", utils.notFound);
    app.all("*", utils.notImplemented);
    /* routing end */
    app.use(errorMiddleware);
    server.listen(PORT, initialLogs);
    /* start socket.io server */
    RootNodeSocket.runSocket(server);
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

// Launch
initiateApp().then((res) => connectDBAndLaunch(startApp, res));
