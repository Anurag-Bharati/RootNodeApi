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
    .route(Routes.OLD_RECENT_CONNS)
    .get(auth.verifyUser, controller.getMyOldAndRecentConns)
    .all(utils.notImplemented);

router
    .route(Routes.RECOM)
    .get(auth.verifyUser, controller.getRecommendedConns)
    .all(utils.notImplemented);

router
    .route(Routes.RANDOM)
    .get(auth.verifyUser, controller.getRandomConns)
    .all(utils.notImplemented);

// Get Add Delete
router
    .use(auth.verifyUser)
    .route(Routes.ID_PARAM)
    .get(controller.hasConnection)
    .post(controller.userConnectionToggler)
    .put(controller.updateConnectionById)
    .all(utils.notImplemented);

/* MESSAGE */
router
    .route(Routes.RECENT_MSG)
    .get(auth.verifyUser, controller.getRecentMessages)
    .all(utils.notImplemented);

module.exports = router;
