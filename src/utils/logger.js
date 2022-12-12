// Create event logger system where it shows message, date time, uid

const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fsPromises = require("fs").promises;
const path = require("path");

const saveLog = (logItem) =>
    fsPromises
        .appendFile(path.join(process.cwd(), "app.log"), logItem)
        .catch((err) => console.log(err));

const createLog = (data) =>
    `${uuid()}\t${data}    ${format(new Date(), "yyyy/MM/dd HH:mm:ss")} \n`;

const log = (data) => saveLog(createLog(data));

module.exports = { createLog, saveLog, log };
