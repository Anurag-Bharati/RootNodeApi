const express = require("express");
const router = express.Router();
const controller = require("../controllers/story.controller");
const utils = require("../utils/utils");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

router
    .route("/")
    .get(controller.getAllPublicStories)
    .post(auth.verifyUser, upload.single("media"), controller.createStory)
    .put(utils.notImplemented)
    .delete(auth.verifyUser, controller.deleteAllStories);

router
    .use(auth.verifyUser)
    .route("/:id")
    .get(controller.getStoryById)
    .post(utils.notImplemented)
    .put(upload.single("media"), controller.updateStoryById)
    .delete(controller.deleteStoryById);

router
    .use(auth.verifyUser)
    .route("/:id/likeunlike")
    .get(controller.getStoryLiker)
    .post(controller.likeUnlikeStory);

module.exports = router;
