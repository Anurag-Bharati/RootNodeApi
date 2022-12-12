const express = require("express");

const runApp = () => {
    const app = express();
    app.use(express.json());
    return app;
};

module.exports = runApp;
