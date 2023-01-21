const express = require("express");
const router = express.Router();
const controller = require("../controllers/connection.controller");
const utils = require("../utils/utils");
const auth = require("../middleware/auth");

router
    .route("/")
    .get(auth.verifyUser, controller.getAllConnections)
    .all(utils.notImplemented);

router
    .route("/:id")
    .post(auth.verifyUser, controller.userConnectionToggler)
    .all(utils.notImplemented);

module.exports = router;
