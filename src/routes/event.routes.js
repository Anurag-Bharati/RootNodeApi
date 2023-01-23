const express = require("express");
const router = express.Router();
const controller = require("../controllers/event.controller");
const utils = require("../utils/utils");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

router
    .use(auth.verifyUser)
    .route("/")
    .get(controller.getAllPublicEvents)
    .post(controller.addEvent)
    .delete(controller.deleteAllEvents);

router
    .use(auth.verifyUser)
    .route("/my")
    .get(controller.getAllMyEvents)
    .all(utils.notImplemented);

router
    .use(auth.verifyUser)
    .route("/:id")
    .get(controller.getEventById)
    .post(controller.addEvent)
    .put(controller.updateEventById)
    .delete(controller.deleteEventById);

router
    .use(auth.verifyUser)
    .route("/:id/joinleave")
    .get(controller.getEventCandidates)
    .post(controller.joinLeaveEvent)
    .all(utils.notImplemented);

router
    .use(auth.verifyUser)
    .route("/:id/intrested")
    .get(controller.getEventInterested)
    .post(controller.interesedEventToggle)
    .all(utils.notImplemented);

module.exports = router;
