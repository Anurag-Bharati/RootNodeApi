const User = require("../../../models/user/user");
const IOEvents = require("../helper/events.socket");

const sendMessage = function (message) {
    this.broadcast.emit(IOEvents.MESSAGE, this.id, message);
};

module.exports = {
    sendMessage,
};
