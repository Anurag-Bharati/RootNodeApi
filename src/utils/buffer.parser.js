const path = require("path");
const DatauriParser = require("datauri/parser");

const parser = new DatauriParser();
const bufferParser = (file) =>
    parser.format(path.extname(file.originalname).toString(), file.buffer);

module.exports = bufferParser;
