const routes = {};
routes.user = require("./user.routes");
routes.post = require("./post.routes");
routes.conn = require("./connection.routes");

module.exports = routes;
