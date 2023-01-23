const routes = {};
routes.auth = require("./auth.routes");
routes.user = require("./user.routes");
routes.post = require("./post.routes");
routes.conn = require("./connection.routes");
routes.story = require("./story.routes");
routes.event = require("./event.routes");

module.exports = routes;
