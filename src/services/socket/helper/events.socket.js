const IOEvents = {};
/* events start  */

IOEvents.CONNECT = "connection";
IOEvents.DISCONNECT = "disconnect";

IOEvents.SEND_MESSAGE = "message:send";
IOEvents.MESSAGE = "message";

IOEvents.HELLO = "io:greet";
IOEvents.IDENTIFY = "io:me";

/* events end  */
module.exports = IOEvents;
