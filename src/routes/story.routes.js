const express = require("express");
const router = express.Router();
const controller = require("../controllers/story.controller");
const utils = require("../utils/utils");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const { Routes } = require("../config/constant");

router
    .route(Routes.BASE)
    .get(controller.getAllPublicStories)
    .post(auth.verifyUser, upload.single("media"), controller.createStory)
    .put(utils.notImplemented)
    .delete(auth.verifyUser, controller.deleteAllStories);

router
    .use(auth.verifyUser)
    .route(Routes.FEED)
    .get(controller.getMyStoryFeed)
    .all(utils.notImplemented);

router
    .use(auth.verifyUser)
    .route("/user/:id")
    .get(controller.getStoryByUser)
    .all(utils.notImplemented);

router
    .use(auth.verifyUser)
    .route(Routes.ID_PARAM)
    .get(controller.getStoryById)
    .post(controller.storyWatched)
    .put(upload.single("media"), controller.updateStoryById)
    .delete(controller.deleteStoryById);

router
    .use(auth.verifyUser)
    .route(Routes.ID_LIKE)
    .get(controller.getStoryLiker)
    .post(controller.likeUnlikeStory);

router
    .use(auth.verifyUser)
    .route(Routes.SEENBY)
    .get(controller.getStoryWatcher); // USING ARRAY

module.exports = router;
