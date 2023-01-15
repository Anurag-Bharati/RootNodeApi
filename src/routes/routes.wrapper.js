const routes = {};
routes.auth = require("./auth.routes");
routes.user = require("./user.routes");
routes.post = require("./post.routes");

module.exports = routes;
