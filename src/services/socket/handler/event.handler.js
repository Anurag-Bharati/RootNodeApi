const sendMessage = (event, sender, reciever, message) => {
    if (!reciever) return;
    sender.to(reciever.id).emit("msg", sender.id, message);
};
const disconnect = (socket) => {
    console.log(" Left ".bold.red.inverse + " " + socket.id);
};

module.exports = {
    disconnect,
    sendMessage,
};
