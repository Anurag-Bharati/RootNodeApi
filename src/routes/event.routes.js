const express = require("express");
const router = express.Router();
const controller = require("../controllers/event.controller");
const utils = require("../utils/utils");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const { Routes } = require("../config/constant");

router
    .use(auth.verifyUser)
    .route(Routes.BASE)
    .get(controller.getAllPublicEvents)
    .post(controller.addEvent)
    .delete(controller.deleteAllEvents);

router
    .use(auth.verifyUser)
    .route(Routes.MY)
    .get(controller.getAllMyEvents)
    .all(utils.notImplemented);

router
    .use(auth.verifyUser)
    .route(Routes.ID_PARAM)
    .get(controller.getEventById)
    .post(utils.notImplemented)
    .put(controller.updateEventById)
    .delete(controller.deleteEventById);

router
    .use(auth.verifyUser)
    .route(Routes.JOIN_LEAVE_EVENT)
    .get(controller.getEventCandidates)
    .post(controller.joinLeaveEvent)
    .all(utils.notImplemented);

router
    .use(auth.verifyUser)
    .route(Routes.TOGGLE_EVENT_INTERESTED)
    .get(controller.getEventInterested)
    .post(controller.interesedEventToggle)
    .all(utils.notImplemented);

module.exports = router;
