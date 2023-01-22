require("colors");
const { io } = require("socket.io-client");

process.stdout.write("\u001B[?25l");
process.stdout.write("\u001b[2J\u001b[0;0H");
console.clear();

console.log("\n" + " RNSClient ".bold.inverse, "running test".bold, "\n");

const socket = io("ws://localhost:3000");

socket.on("hello", () => {
    console.log(" Joined ".bold.cyan.inverse, `Hi from ${socket.id}`.bold);
});

socket.on("msg", (sender, message) => {
    console.log(`${sender} said ${message}`);
});

setInterval(() => {
    console.log("sending hi");
    socket.emit("msg", "ID", "hi");
}, 500);
