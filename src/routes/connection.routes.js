const express = require("express");
const router = express.Router();
const controller = require("../controllers/connection.controller");
const utils = require("../utils/utils");
const auth = require("../middleware/auth");

router
    .route("/")
    .get(auth.verifyUser, controller.getAllConnections)
    .get(utils.notImplemented)
    .put(utils.notImplemented)
    .delete(utils.notImplemented);

router
    .use(auth.verifyUser)
    .route("/:id")
    .get(utils.notImplemented)
    .post(auth.verifyUser, controller.userConnectionToggler)
    .put(utils.notImplemented)
    .delete(utils.notImplemented);

module.exports = router;
