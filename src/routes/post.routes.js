const express = require("express");
const router = express.Router();
const controller = require("../controllers/post.controller");
const utils = require("../utils/utils");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

router
    .route("/")
    .get(controller.getAllPost)
    .post(auth.verifyUser, controller.createPost)
    .put(utils.notImplemented)
    .delete(utils.notImplemented);

router
    .use(auth.verifyUser)
    .route("/:id")
    .get(controller.getPostById)
    .post(utils.notImplemented)
    .put(controller.updatePostById)
    .delete(controller.deletePostById);

module.exports = router;
