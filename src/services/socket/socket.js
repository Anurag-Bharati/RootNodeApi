require("colors");
const IOEvents = require("./helper/events.socket");
const User = require("../../models/user/user");
const Message = require("../../models/user/user.message");

const PORT = process.env.PORT || 3000;

const generateInfo = () => {
    console.log(
        "[INFO]".yellow.bold,
        "SocketIO attached on port".bold,
        `${PORT}`.bold.underline
    );
};

const socketPool = new Map();

const establishConn = (socket) => {
    const rn = socket.request._query["rootnode"];
    if (!socketPool.has(rn)) socketPool.set(rn, socket.id);
    if (rn) {
        User.findById(rn).then((user) => {
            user.status = "active";
            user.save();
        });
    }
    socket.emit(IOEvents.HELLO);
    console.log(" Join ".bold.green.inverse + " " + socket.id);
    socket.on(IOEvents.DISCONNECT, () => {
        const rn = socket.request._query["rootnode"];
        if (socketPool.has(rn)) socketPool.delete(rn);
        User.findById(rn).then((user) => {
            user.status = "inactive";
            user.save();
        });
        console.log(" Left ".bold.red.inverse + " " + this.id);
    });
    socket.on(IOEvents.SEND_MESSAGE, function (data) {
        console.log(socketPool);
        const to = socketPool.get(data?.to);
        console.log(to);
        // if logged in send live msg
        if (to) this.to(to).emit(IOEvents.MESSAGE, data);
        // remove else and save to db instead of emit
        else this.broadcast.emit(IOEvents.MESSAGE, data);
        Message.create({
            text: data?.text,
            to: data?.to,
            from: data?.from,
        }).then();
    });
};

const runSocket = (server, params) => {
    const socket = require("socket.io")(server, { cors: { origin: "*" } });
    socket.on(IOEvents.CONNECT, establishConn);
    generateInfo();
};

const RootNodeSocket = {};
RootNodeSocket.runSocket = runSocket;
module.exports = RootNodeSocket;
