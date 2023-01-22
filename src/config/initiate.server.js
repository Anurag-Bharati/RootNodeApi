require("colors");
const fs = require("fs");

function printProgress(progress) {
    process.stdout.write(progress);
}

const res = {};

const codeErrMap = {
    0x0000: "EnvNotFound",
    0x0001: "",
};

const checkEnvExists = () => {
    if (fs.existsSync(".env")) return;
    res.err = {
        code: "0x0000",
        message: ".env not found at the root dir",
        trace: process.cwd(),
        error: codeErrMap[0],
    };
};

/*
 * Init fields/methods inside before launch
 * Not really necessary rn, but could be later
 * Init: Simple Waiting Animation (replaceable)
 */
const initiateLaunch = async () => {
    // hide cursor
    process.stdout.write("\u001B[?25l");
    process.stdout.write(
        "\n" +
            " RootNode ".inverse.bold +
            " Launching Service. Please Wait".bold
    );
    let progress = 0;
    const switchAt = 30;
    const wait = 500;
    const interval = setInterval(() => {
        progress += 10;
        printProgress(".".bold);
        if (progress % switchAt == 0) {
            process.stdout.moveCursor(-3);
            process.stdout.write("   ");
            process.stdout.moveCursor(-3);
        }
        if (progress >= 80) {
            clearInterval(interval);
        }
    }, wait * 0.1);
    return new Promise((resolve) => {
        /* checks starts */
        checkEnvExists();
        /* checks end */
        setTimeout(() => resolve(res), wait);
    });
};

module.exports = initiateLaunch;
