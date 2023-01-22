require("colors");
const IOEvents = require("./helper/events.socket");
const handler = require("./handler/connection.handler");

const PORT = process.env.PORT || 3000;

const generateInfo = () => {
    console.log(
        "[INFO]".yellow.bold,
        "SocketIO attached on port".bold,
        `${PORT}`.bold.underline
    );
};

const runSocket = (server, params) => {
    const socket = require("socket.io")(server, { cors: { origin: "*" } });
    socket.on(IOEvents.CONNECT, (sc) => handler.connect(sc));
    generateInfo();
};

const RootNodeSocket = {};
RootNodeSocket.runSocket = runSocket;
module.exports = RootNodeSocket;
