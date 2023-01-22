require("colors");
const IOEvents = require("./helper/events.socket");
const handler = require("./handler/event.handler");

const PORT = process.env.PORT || 3000;

const generateInfo = () => {
    console.log(
        "[INFO]".yellow.bold,
        "SocketIO attached on port".bold,
        `${PORT}`.bold.underline
    );
};

const socketPool = {};
const establishConn = (socket) => {
    if (!socketPool[socket.id]) socketPool[socket.id] = socket;
    socket.emit(IOEvents.HELLO);
    console.log(" Join ".bold.green.inverse + " " + socket.id);
    socket.on(IOEvents.DISCONNECT, () => handler.disconnect(socket));
    socket.on(IOEvents.MSG, (sid, message) =>
        handler.sendMessage(IOEvents.MSG, socket, socketPool[sid], message)
    );
};

const runSocket = (server, params) => {
    const socket = require("socket.io")(server, { cors: { origin: "*" } });
    socket.on(IOEvents.CONNECT, (cs) => establishConn(cs));
    generateInfo();
};

const RootNodeSocket = {};
RootNodeSocket.runSocket = runSocket;
module.exports = RootNodeSocket;
