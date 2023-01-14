const mongoose = require("mongoose");
require("colors");
mongoose.set("strictQuery", true);

const generateBanner = (_) =>
    `                                       
 ___          _   _  _         _     `.black.bold +
    `
| _ \\___  ___| |_| \\| |___  __| |___ `.grey.bold +
    `
|   / _ \\/ _ \\  _| .\` / _ \\/ _\` / -_)`.brightWhite.bold +
    `
|_|_\\___/\\___/\\__|_|\\_\\___/\\____\\___|
`.bold +
    `
V ${_.V} - Running on ${_.ENV} environment \nUsing ${_.DS} Database - API: ${_.API_ROOT}
`;

const connectDBAndLaunch = async (launch) => {
    const conn = await mongoose.connect(
        process.env.USECLOUDDB === "1"
            ? process.env.CLOUDDB
            : process.env.LOCALDB
    );
    console.clear();
    const params = {};
    params.V = process.env.VERSION || "N/A";
    params.ENV = process.env.ENV || "N/A";
    params.DS = process.env.USECLOUDDB === "1" ? "Cloud" : "Local";
    params.API_ROOT = process.env.API_URL || "/api/v0";

    const banner = generateBanner(params);
    console.log(banner);
    console.log(
        "[INFO]".yellow.bold,
        "MongoDB connected to :".bold,
        conn.connection.host.underline.bold
    );
    let showCause = false;
    var args = process.argv.slice(2);
    args.forEach((a) => {
        if (a === "showCause") showCause = true;
    });
    launch(showCause);
};

module.exports = connectDBAndLaunch;
