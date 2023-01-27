const express = require("express");
const router = express.Router();
const controller = require("../controllers/connection.controller");
const utils = require("../utils/utils");
const auth = require("../middleware/auth");
const { Routes } = require("../config/constant");

// GET
router
    .use(auth.verifyUser)
    .route(Routes.BASE)
    .get(controller.getAllConnections)
    .all(utils.notImplemented);

router
    .use(auth.verifyUser)
    .route(Routes.OLD_RECENT_CONNS)
    .get(controller.getMyOldAndRecentConns)
    .all(utils.notImplemented);

// Get Add Delete
router
    .use(auth.verifyUser)
    .route(Routes.ID_PARAM)
    .get(controller.hasConnection)
    .post(controller.userConnectionToggler)
    .put(controller.updateConnectionById)
    .all(utils.notImplemented);

router;

module.exports = router;
