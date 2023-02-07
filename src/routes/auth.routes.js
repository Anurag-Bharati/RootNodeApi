const express = require("express");
const { Routes } = require("../config/constant");
const router = express.Router();
const controller = require("../controllers/auth.controller");
const utils = require("../utils/utils");

router
    .route(Routes.REGISTER)
    .get(utils.notImplemented)
    .post(controller.handleRegister);

router
    .route(Routes.LOGIN)
    .get(utils.notImplemented)
    .post(controller.handleLogin);

router.route(Routes.REFRESH).get(controller.handleRefreshToken);

router
    .route(Routes.LOGOUT)
    .get(utils.notImplemented)
    .post(controller.handleLogout);

module.exports = router;
