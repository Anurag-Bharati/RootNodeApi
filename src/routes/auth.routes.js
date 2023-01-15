const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth.controller");
const utils = require("../utils/utils");

router
    .route("/register")
    .get(utils.notImplemented)
    .post(controller.handleRegister);

router.route("/login").get(utils.notImplemented).post(controller.handleLogin);

router.route("/refresh").get(controller.handleRefreshToken);

router.route("/logout").get(utils.notImplemented).post(controller.handleLogout);

module.exports = router;
