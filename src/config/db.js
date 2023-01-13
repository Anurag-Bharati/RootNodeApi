const mongoose = require("mongoose");
require("colors");
mongoose.set("strictQuery", true);
const connectDBAndLaunch = async (launch) => {
    const conn = await mongoose.connect(
        process.env.USECLOUDDB === "0"
            ? process.env.LOCALDB
            : process.env.CLOUDDB
    );
    console.log(
        "MongoDB connected to :".bold,
        conn.connection.host.underline.bold
    );
    launch();
};

module.exports = connectDBAndLaunch;
