const colors = require("colors/safe");
const dotenv = require("dotenv");
const runApp = require("./app.js");
const RootNodeSocket = require("./services/socket/socket");
const http = require("http");
const utils = require("./utils/utils.js");
const { BaseRoutes } = require("./config/constant.js");
const { serveRandom } = require("./utils/foods");
const routes = require("./routes/routes.wrapper");
const { connectDBAndLaunch } = require("./config/db");
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
    app.use(BaseRoutes.AUTH, routes.auth);
    app.use(BaseRoutes.USER, routes.user);
    app.use(BaseRoutes.POST, routes.post);
    app.use(BaseRoutes.CONN, routes.conn);
    app.use(BaseRoutes.STRY, routes.story);
    app.use(BaseRoutes.EVNT, routes.event);
    /* fallback routes  */
    app.get(BaseRoutes.WILDCARD, utils.notFound);
    app.all(BaseRoutes.WILDCARD, utils.notImplemented);
    /* routing end */
    app.use(errorMiddleware);
    if (process.env.NODE_ENV === "test") return app;
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
if (process.env.NODE_ENV !== "test")
    initiateApp().then((res) => connectDBAndLaunch(startApp, res));
module.exports = startApp;
