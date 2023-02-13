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
V ${_.V} - Running on ${
        _.ENV === "prod" ? "prod".bold : _.ENV
    } environment \nUsing ${_.DS} Database - API: ${_.API_ROOT}
`;

const generateError = (err) => {
    console.log(
        "\n" + ` ${err.error} `.bgRed.bold,
        err.code.red,
        err.message.bold,
        err.trace ? "\n\n Trace route:\n" : "",
        err.trace ?? "",
        "\n"
    );
};

const connectMongoDB = async () => {
    return mongoose.connect(
        process.env.NODE_ENV === "test"
            ? process.env.TESTDB
            : process.env.LOCALDB
    );
};

const connectDBAndLaunch = async (launch, res) => {
    if (res.err) return generateError(res.err);
    const conn = await connectMongoDB();

    // Clear and move to (0, 0)
    process.stdout.write("\u001b[2J\u001b[0;0H");
    // fallback clear
    console.clear();
    const bannerParams = {};
    bannerParams.V = process.env.VERSION || "N/A";
    bannerParams.ENV = process.env.NODE_ENV || "N/A";
    bannerParams.DS = process.env.USECLOUDDB === "1" ? "Cloud" : "Local";
    bannerParams.API_ROOT = process.env.API_URL || "/api/v0";

    const banner = generateBanner(bannerParams);
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
    const params = { showCause };
    return launch(params);
};

module.exports = { connectMongoDB, connectDBAndLaunch };
