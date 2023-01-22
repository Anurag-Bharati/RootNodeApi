require("colors");
const { io } = require("socket.io-client");
// hide cursor
process.stdout.write("\u001B[?25l");
// Clear and move to (0, 0)
process.stdout.write("\u001b[2J\u001b[0;0H");
// fallback clear
console.clear();

console.log("\n" + " RNSClient ".bold.inverse, "running test".bold, "\n");
const socket = io("ws://localhost:3000");

socket.on("hello", () => {
    console.log(" Joined ".bold.cyan.inverse, `Hi from ${socket.id}`.bold);
});
let count = 0;
socket.on("ping", () => {
    count++;
    process.stdout.clearLine();
    process.stdout.cursorTo(0, 5);
    process.stdout.write(
        " PING ".inverse.green.bold + ` ${count} recived ${socket.id}`
    );

    socket.emit("ping");
});
