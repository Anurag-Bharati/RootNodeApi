require("colors");
const ConsoleLog = {};

const genNewX = (title = "MISC", what = "", username) => {
    console.log(
        "↪".bold,
        ` ${title} `.cyan.bold.inverse,
        `generating new ${what} for ${username}`.cyan
    );
};

const usingOldX = (title = "MISC", what = "", username) => {
    console.log(
        "↪".bold,
        ` ${title} `.cyan.bold.inverse,
        `using old ${what} for ${username}`.cyan
    );
};

ConsoleLog.genNewX = genNewX;
ConsoleLog.usingOldX = usingOldX;
module.exports = ConsoleLog;
