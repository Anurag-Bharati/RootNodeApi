require("colors");
const { io } = require("socket.io-client");

process.stdout.write("\u001B[?25l");
process.stdout.write("\u001b[2J\u001b[0;0H");
console.clear();

console.log("\n" + " RNSClient ".bold.inverse, "running test".bold, "\n");

const socket = io("ws://localhost:3000");

socket.on("io:greet", () => {
    console.log(" Joined ".bold.cyan.inverse, `Hi from ${socket.id}`.bold);
});

socket.on("message", (io, message) => {
    console.log(`${io} said ${message}`);
});

setInterval(() => {
    console.log("sending hi");
    socket.emit("message:send", { id: "", message: "hi" });
}, 5000);
