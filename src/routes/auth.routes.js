const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth.controller");
const utils = require("../utils/utils");

router
    .route("/register")
    .get(utils.notImplemented)
    .post(controller.handleRegister)
    .put(utils.notImplemented);

router
    .route("/login")
    .get(utils.notImplemented)
    .post(controller.handleLogin)
    .put(utils.notImplemented);

router
    .route("/refresh")
    .get(controller.handleRefreshToken)
    .post(controller.handleLogin)
    .put(utils.notImplemented);
module.exports = router;
