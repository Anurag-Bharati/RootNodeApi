const express = require("express");
const router = express.Router();
const controller = require("../controllers/connection.controller");
const utils = require("../utils/utils");
const auth = require("../middleware/auth");
const { Routes } = require("../config/constant");

// GET
router
    .route(Routes.BASE)
    .get(auth.verifyUser, controller.getAllConnections)
    .all(utils.notImplemented);

// Get Add Delete
router
    .route(Routes.ID_PARAM)
    .get(auth.verifyUser, controller.hasConnection)
    .post(auth.verifyUser, controller.userConnectionToggler)
    .put(auth.verifyUser, controller.updateConnectionById)
    .all(utils.notImplemented);

router;

module.exports = router;
