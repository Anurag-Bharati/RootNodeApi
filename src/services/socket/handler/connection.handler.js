const connect = (socket) => {
    process.stdout.cursorTo(0, 15);
    process.stdout.write(" LatestEvent ".bold.inverse);

    console.log(" Connected ".bold.cyan.inverse + " " + socket.id);
    process.stdout.cursorTo(0, 21);

    socket.emit("hello");
    socket.on("disconnect", () => disconnect(socket));
    setInterval(() => pingClients(socket), Math.random(1) + 1 * 500);
    socket.on("ping", () => acknowledge(socket));
};

const pingClients = (socket) => {
    process.stdout.cursorTo(0, 17);
    process.stdout.write(
        " PING ".inverse.green.bold + ` Sending ${socket.id}\n`
    );
    process.stdout.cursorTo(0, 21);

    socket.emit("ping");
};

const disconnect = (socket) => {
    process.stdout.cursorTo(13, 15);
    process.stdout.write(" Disconnected ".bold.red.inverse + " " + socket.id);
    process.stdout.cursorTo(0, 21);
};
const acknowledge = (socket) => {
    process.stdout.cursorTo(0, 18);
    process.stdout.write(
        " PING ".inverse.green.bold + ` Acknowledged ${socket.id}\n`
    );
    process.stdout.cursorTo(0, 21);
};

module.exports = { connect, disconnect };
