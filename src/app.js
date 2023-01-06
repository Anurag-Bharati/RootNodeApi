const express = require("express");
const path = require("path");

const runApp = () => {
    const app = express();
    app.use(express.json());
    app.use(
        "/public",
        express.static(path.join(__dirname, "/../", "/public/"))
    );

    return app;
};

module.exports = runApp;
