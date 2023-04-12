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
    } environment - @${_.API_ROOT}\nUsing ${_.STORAGE} File Storage (${
        _.STORAGE === "Cloudinary" ? _.ST_NAME : "public/media/uploads"
    }) \nUsing ${_.DS} Database (${_.DB_NAME})
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

const getDBLinkByEnv = () => {
    switch (process.env.NODE_ENV) {
        case "test":
            return process.env.TESTDB;
        case "prod":
            return process.env.CLOUDDB;
        case "dev":
            return process.env.LOCALDB;
        default:
            return process.env.LOCALDB;
    }
};

const getFileStorage = () => {
    const usingDiskStorage = process.env.USE_DISK_STORAGE === "1";
    const env = process.env.NODE_ENV;
    if (env === "prod") return "Cloudinary";
    if (usingDiskStorage && env === "dev") return "Local";
    if (!usingDiskStorage && env === "dev") return "⚠ In-Memory";
    else return "Local";
};

const connectMongoDB = async (link) => {
    return mongoose.connect(link);
};

const connectDBAndLaunch = async (launch, res) => {
    if (res.err) return generateError(res.err);
    const dbLink = getDBLinkByEnv();
    const conn = await connectMongoDB(dbLink);
    const fileStorage = getFileStorage();
    // Clear and move to (0, 0)
    // process.stdout.write("\u001b[2J\u001b[0;0H");
    // fallback clear
    console.clear();
    const bannerParams = {};
    bannerParams.V = process.env.VERSION || "N/A";
    bannerParams.ENV = process.env.NODE_ENV || "N/A";
    bannerParams.DS = process.env.NODE_ENV === "prod" ? "Cloud" : "Local";
    bannerParams.API_ROOT = process.env.API_URL || "/api/v0";
    bannerParams.STORAGE = fileStorage;
    bannerParams.ST_NAME = process.env.CLOUDINARY_CLOUD_NAME;
    bannerParams.DB_NAME = dbLink.substring(
        dbLink.lastIndexOf("/") + 1,
        dbLink.length
    );

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
