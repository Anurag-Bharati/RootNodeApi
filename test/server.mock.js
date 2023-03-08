const startApp = require("../src/server");
const { connectMongoDB } = require("../src/config/db");

connectMongoDB();
const app = startApp({});
module.exports = app;
